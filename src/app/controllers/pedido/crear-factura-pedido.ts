import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { Factura } from 'app/entities/factura';
import { Dosificacion } from 'app/entities/dosificacion';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import Big from 'big.js';
import { basePath } from 'index';
import { NumeroLiteral } from '../factura/numero-literal';
import { CodigoControl } from '../factura/codigo-control/codigo-control';
import { CodigoQR } from '../factura/codigo-qr';
import { format } from 'date-fns';
import { DetallePedido } from 'app/entities/detalle-pedido';
import { PagoPedido } from 'app/entities/pago-pedido';
import { TokenUtil } from 'app/utils/token.util';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';

export class CrearFacturaPedido {
  constructor() {
    this.exec = this.exec.bind(this);
    this.generarFactura = this.generarFactura.bind(this);
  }

  async exec(req: Request, res: Response) {
    const idPedido = req.params.idPedido;
    const tokenUtil = new TokenUtil();
    const idUsuario = tokenUtil.getTokenPayload(req).sub;

    try {
      // el saldo del pedido debe ser 0 para gerar la factura
      const total: number = (
        await getRepository(DetallePedido).find({
          pedido: { id: parseInt(idPedido) },
        })
      ).reduce(
        (prev, curr) =>
          new Big(prev)
            .plus(new Big(curr.cantidad).times(curr.precioUnitario))
            .toNumber(),
        0
      );

      const pagos: number = (
        await getRepository(PagoPedido).find({
          pedido: { id: parseInt(idPedido) },
        })
      ).reduce((prev, curr) => new Big(prev).plus(curr.monto).toNumber(), 0);

      const saldo: number = new Big(total).minus(pagos).toNumber();

      if (saldo !== 0) {
        return res
          .status(403)
          .json({ mensaje: 'El saldo del pedido debe ser 0' });
      }

      // Verificamos si el pedido existe
      const pedido = await getRepository(Pedido).findOne(parseInt(idPedido), {
        relations: ['factura'],
      });

      if (!pedido) {
        return res.status(403).json({ mensaje: 'Pedido no encontrado' });
      }

      if (!pedido.factura && pedido.cancelado) {
        return res
          .status(403)
          .json({ mensaje: 'No es posible facturar pedidos cancelados' });
      }

      // Transaccion
      await getConnection().transaction(async transaction => {
        // Cargamos la factura del pedido
        // para verificar si es que tiene o no una factura
        let factura = await transaction
          .createQueryBuilder()
          .relation(Pedido, 'factura')
          .of(idPedido)
          .loadOne<Factura>();

        // Si el pedido ya cuenta con el registro de una factura
        // simplemente nos salimos de la transaccion
        if (factura) {
          return;
        }

        // Obtenemos el ultimo registro de la dosificacion
        const dosificacion = (
          await transaction.find(Dosificacion, {
            order: { id: 'DESC' },
            take: 1,
          })
        )[0];

        if (!dosificacion) {
          return res.status(401).json({
            mensaje: 'No existe ninguna dosificación registrada',
          });
        }

        // Obtenemos la ultima factura registrada
        // para incrementar el numero de factura
        const facturaAnterior = (
          await transaction.find(Factura, {
            order: { numeroFactura: 'DESC' },
            take: 1,
            relations: ['dosificacion'],
          })
        )[0];

        const numeroFactura = (() => {
          if (!facturaAnterior) {
            return 1;
          }
          if (facturaAnterior.dosificacion.id !== dosificacion.id) {
            return 1;
          }
          return facturaAnterior.numeroFactura + 1;
        })();

        // Creamos una nueva factura
        factura = new Factura();
        factura.numeroFactura = numeroFactura;
        factura.dosificacion = dosificacion;
        factura = await transaction.save<Factura>(factura);

        await transaction.insert<TablaLog<Factura>>(TablaLog, {
          operacion: OperacionTablaLog.INSERT,
          nombreTabla: TableNames.facturas,
          usuario: { id: parseInt(idUsuario!) },
          nuevoValor: factura,
        });

        // Relacionamos la nueva factura con el pedido
        await transaction
          .createQueryBuilder()
          .relation(Pedido, 'factura')
          .of(idPedido)
          .set(factura);
      });

      res.json({ url: `${process.env.URL}/pedido/factura/${idPedido}` });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async generarFactura(req: Request, res: Response) {
    const idPedido = req.params.idPedido;

    const pedido = await getRepository(Pedido).findOne(idPedido, {
      relations: [
        'cliente',
        'detallesPedidos',
        'detallesPedidos.producto',
        'factura',
        'factura.dosificacion',
        'factura.dosificacion.sucursal',
        'factura.dosificacion.sucursal.casaMatriz',
      ],
    });

    if (!pedido) {
      return res.status(403).json({ mensaje: 'Pedido no encontrado' });
    }

    if (!pedido.factura) {
      return res.status(403).json({ mensaje: 'El pedido no esta facturado' });
    }

    this.generarPDF(pedido, pdfBase64 => {
      res.setHeader('Content-Type', 'application/pdf');
      res.set(
        'Content-disposition',
        `inline; filename=factura-${pedido.cliente.nitCI}.pdf`
      );
      res.end(pdfBase64);
    });
  }

  private generarPDF(pedido: Pedido, cb: (pdfBase64: Buffer) => void): void {
    try {
      const casaMatriz = pedido.factura.dosificacion.sucursal.casaMatriz;
      const sucursal = pedido.factura.dosificacion.sucursal;
      const factura = pedido.factura;
      const dosificacion = pedido.factura.dosificacion;
      const cliente = pedido.cliente;
      const total = pedido.detallesPedidos.reduce(
        (acumulator, detallePedido) => {
          return new Big(acumulator)
            .add(
              new Big(detallePedido.precioUnitario)
                .times(detallePedido.cantidad)
                .toFixed(2)
            )
            .toNumber();
        },
        0
      );
      const totalLiteral = new NumeroLiteral().convertir(
        Number(total),
        'BOLIVIANOS'
      );
      const codigoControl = new CodigoControl().generarCodigo(
        dosificacion.numeroAutorizacion,
        factura.numeroFactura.toString(),
        cliente.nitCI,
        factura.fechaEmision,
        total.toFixed(0),
        dosificacion.llaveDosificacion
      );
      const qrSupply = new CodigoQR().generarInsumoQR(
        casaMatriz.nit,
        factura.numeroFactura,
        dosificacion.numeroAutorizacion,
        factura.fechaEmision,
        total,
        total,
        codigoControl,
        cliente.nitCI
      );

      const docDefinition: TDocumentDefinitions = {
        pageSize: {
          width: 80 * 2.835,
          height: 'auto',
        },
        watermark: factura.anulado ? { text: 'Anulado', angle: -45 } : '',
        content: [
          { text: casaMatriz.nombre, style: 'title' },
          { text: sucursal.nombre, style: 'sucursal' },
          { text: sucursal.direccion, style: 'sucursal' },
          { text: sucursal.numeroTelefono, style: 'sucursal' },
          { text: sucursal.ubicacion, style: 'sucursal' },
          { text: 'FACTURA', style: 'header' },
          {
            columns: [
              { text: `NIT: ${casaMatriz.nit}` },
              { text: `Nº FACTURA: ${factura.numeroFactura}` },
            ],
          },
          { text: `Nº AUTORIZACIÓN: ${dosificacion.numeroAutorizacion}` },
          {
            text: casaMatriz.descripcionActividadEconomica,
            margin: [0, 5],
            alignment: 'center',
          },
          {
            text: `Fecha: ${format(
              new Date(factura.fechaEmision),
              'dd/MM/yyyy HH:mm'
            )}`,
          },
          { text: `NIT/CI: ${cliente.nitCI}` },
          {
            text: `Nombre: ${cliente.nombre} ${cliente.apellido}`,
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              { text: 'DETALLE' },
              { text: 'CANTIDAD', alignment: 'right' },
              { text: 'P. UNITARIO (Bs.)', alignment: 'right' },
              { text: 'SUBTOTAL (Bs.)', alignment: 'right' },
            ],
            margin: [0, 0, 0, 5],
          },
          {
            stack: pedido.detallesPedidos.map(detallePedido => ({
              columns: [
                { text: detallePedido.producto.nombre }, // detalle
                {
                  text: new Big(detallePedido.cantidad).toFixed(2),
                  alignment: 'right',
                }, // cantidad
                {
                  text: new Big(detallePedido.precioUnitario).toFixed(2),
                  alignment: 'right',
                }, // precio unitario
                {
                  text: new Big(detallePedido.cantidad)
                    .times(detallePedido.precioUnitario)
                    .toFixed(2),
                  alignment: 'right',
                }, // subtotal
              ],
            })),
          },
          {
            text: `Total (Bs.): ${total.toFixed(2)}`,
            bold: true,
            alignment: 'right',
            margin: [0, 5],
          }, // total
          { text: `SON: ${totalLiteral}`, bold: true }, // total literal
          {
            text: `CÓDIGO DE CONTROL: ${codigoControl}`,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          {
            text: `FECHA LÍMITE DE EMISIÓN: ${format(
              new Date(dosificacion.fechaLimiteEmision),
              'dd/MM/yyyy'
            )}`,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          { qr: qrSupply, fit: 100, alignment: 'center' }, // codigo qr
          {
            text: `ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS.\
EL USO ILÍCITO DE ESTA SERÁ SANCIONADO DE ACUERDO A LA LEY`,
            alignment: 'center',
            margin: [0, 10, 0, 0],
          },
        ],
        defaultStyle: {
          font: 'Roboto',
          fontSize: 8,
        },
        styles: {
          title: {
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 5],
          },
          sucursal: {
            alignment: 'center',
          },
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'center',
            margin: [0, 5],
          },
          test: {
            margin: 10,
          },
        },
        pageMargins: [10, 10, 10, 10],
      };

      const fonts: TFontDictionary = {
        Roboto: {
          normal: `${basePath}/assets/fonts/Roboto/Roboto-Regular.ttf`,
          bold: `${basePath}/assets/fonts/Roboto/Roboto-Medium.ttf`,
          italics: `${basePath}/assets/fonts/Roboto/Roboto-Italic.ttf`,
          bolditalics: `${basePath}/assets/fonts/Roboto/Roboto-MediumItalic.ttf`,
        },
      };

      const printer = new PdfPrinter(fonts);
      const doc = printer.createPdfKitDocument(docDefinition);

      const chunks: any[] = [];

      doc.on('data', chunk => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        cb(Buffer.concat(chunks));
      });

      doc.end();
    } catch (error) {
      throw error;
    }
  }
}
