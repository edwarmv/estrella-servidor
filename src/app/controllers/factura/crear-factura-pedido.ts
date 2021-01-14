import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { Factura } from 'app/entities/factura';
import { Dosificacion } from 'app/entities/dosificacion';
import { EstadoPedido } from 'app/entities/pedido';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import Big from 'big.js';
import { basePath } from 'index';
import { NumeroLiteral } from './numero-literal';
import { CodigoControl } from './codigo-control/codigo-control';
import { CodigoQR } from './codigo-qr';

export class CrearFacturaPedido {
  constructor() {
    this.exec = this.exec.bind(this);
  }

  async exec(req: Request, res: Response)  {
    const idPedido = req.params.idPedido;

    try {
      // Verificamos si el pedido existe
      const pedidoCount = await getRepository(Pedido)
        .count({ where: { id: idPedido } });

      if (pedidoCount === 0) {
        return res.status(401).json({ mensaje: 'Pedido no encontrado' });
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
        const dosificacion = (await transaction.find(
          Dosificacion,
          {
            order: { id: 'DESC' },
            take: 1
          },
        ))[0];

        if (!dosificacion) {
          return res.status(401).json({
            mensaje: 'No existe ninguna dosificación registrada'
          });
        }

        // Obtenemos la ultima factura registrada
        // para incrementar el numero de factura
        const facturaAnterior = (await transaction.find(
          Factura,
          {
            order: { numeroFactura: 'DESC' },
            take: 1,
            relations: ['dosificacion']
          }
        ))[0];

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

        // Relacionamos la nueva factura con el pedido
        await transaction.createQueryBuilder()
          .relation(Pedido, 'factura')
          .of(idPedido)
          .set(factura);

        // Cambiamos el estado del pedido a completado
        await transaction.update(
          Pedido,
          idPedido,
          { estado: EstadoPedido.COMPLETADO }
        );
      });

      const pedido = await getRepository(Pedido)
        .findOne(idPedido, {
          relations: [
            'usuario',
            'cliente',
            'detallesPedidos',
            'detallesPedidos.producto',
            'factura',
            'factura.dosificacion',
            'factura.dosificacion.sucursal',
            'factura.dosificacion.sucursal.casaMatriz',
          ]
        });

      if (!pedido) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      }

      this.generarPDF(pedido, (pdfBase64) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.set('Content-disposition', `inline; filename=factura-${pedido.cliente.nitCI}.pdf`);
        res.end(pdfBase64);
      });
    } catch(error) {
      res.status(500).json(error.message);
    }
  }

  private generarPDF(pedido: Pedido, cb: (pdfBase64: Buffer) => void): void {
    try {
      const casaMatriz = pedido.factura.dosificacion.sucursal.casaMatriz;
      const sucursal = pedido.factura.dosificacion.sucursal;
      const factura = pedido.factura;
      const dosificacion = pedido.factura.dosificacion;
      const cliente = pedido.cliente;
      const total = pedido.detallesPedidos
      .reduce((acumulator, detallePedido) => {
          return new Big(acumulator)
          .add(
            new Big(detallePedido.precioUnitario)
            .times(detallePedido.cantidad)
            .toFixed(2)
          ).toNumber();
      }, 0);
      const totalLiteral = new NumeroLiteral()
      .convertir(Number(total), 'BOLIVIANOS');
      const codigoControl = new CodigoControl()
      .generarCodigo(
        dosificacion.numeroAutorizacion,
        factura.numeroFactura.toString(),
        cliente.nitCI,
        factura.fechaEmision,
        total.toFixed(0),
        dosificacion.llaveDosificacion
      );
      const qrSupply = new CodigoQR()
      .generarInsumoQR(
        casaMatriz.nit,
        factura.numeroFactura,
        dosificacion.numeroAutorizacion,
        factura.fechaEmision,
        total,
        total,
        codigoControl,
        cliente.nitCI
      );

      const docDefinition: TDocumentDefinitions  = {
        pageSize: {
          width: 80 * 2.835,
          height: 'auto'
        },
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
              { text: `Nº FACTURA: ${factura.numeroFactura}` }
            ]
          },
          { text: `Nº AUTORIZACIÓN: ${dosificacion.numeroAutorizacion}` },
          {
            text: casaMatriz.descripcionActividadEconomica,
            margin: [0, 5],
            alignment: 'center'
          },
          { text: `Fecha: ${this.formatDate(factura.fechaEmision, true)}` },
          { text: `NIT/CI: ${cliente.nitCI}` },
          {
            text: `Nombre: ${cliente.nombre} ${cliente.apellido}`,
            margin: [0, 0, 0, 10]
          },
          {
            columns: [
              { text: 'DETALLE' },
              { text: 'CANTIDAD', alignment: 'right' },
              { text: 'P. UNITARIO', alignment: 'right' },
              { text: 'SUBTOTAL', alignment: 'right' }
            ]
          },
          {
            stack: pedido.detallesPedidos.map(detallePedido => {
              return {
                columns: [
                  { text: detallePedido.producto.nombre }, // detalle
                  { text: new Big(detallePedido.cantidad).toFixed(2), alignment: 'right' }, // cantidad
                  {
                    text: new Big(detallePedido.precioUnitario).toFixed(2),
                    alignment: 'right'
                  }, // precio unitario
                  {
                    text: new Big(detallePedido.cantidad)
                      .times(detallePedido.precioUnitario)
                      .toFixed(2),
                    alignment: 'right'
                  } // subtotal
                ]
              };
            })
          },
          {
            text: `Total: ${total.toFixed(2)}`,
            bold: true,
            alignment: 'right',
            margin: [0, 5]
          }, // total
          { text: `SON: ${totalLiteral}`, bold: true }, // total literal
          {
            text:  `CÓDIGO DE CONTROL: ${codigoControl}`,
            bold: true,
            margin: [0, 5, 0, 0]
          },
          {
            text: `FECHA LÍMITE DE EMISIÓN:\
${this.formatDate(dosificacion.fechaLimiteEmision)}`,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          { qr: qrSupply, fit: 100, alignment: 'center' }, // codigo qr
          {
            text: `ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS.\
EL USO ILÍCITO DE ESTA SERÁ SANCIONADO DE ACUERDO A LA LEY`,
            alignment: 'center',
            margin: [0, 10, 0, 0]
          }
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
            margin: [0, 0, 0, 5]
          },
          sucursal: {
            alignment: 'center'
          },
          header: {
            fontSize: 10,
            bold: true,
            alignment: 'center',
            margin: [0, 5]
          },
          test: {
            margin: 10
          }
        },
        pageMargins: [10, 10, 10, 10]
      };

      const fonts: TFontDictionary = {
        Roboto: {
          normal: `${basePath}/assets/fonts/Roboto/Roboto-Regular.ttf`,
          bold: `${basePath}/assets/fonts/Roboto/Roboto-Medium.ttf`,
          italics: `${basePath}/assets/fonts/Roboto/Roboto-Italic.ttf`,
          bolditalics: `${basePath}/assets/fonts/Roboto/Roboto-MediumItalic.ttf`
        }
      };

      const printer = new PdfPrinter(fonts);
      const doc = printer.createPdfKitDocument(docDefinition);

      const chunks: any[] = [];

      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        cb(Buffer.concat(chunks));
      });

      doc.end();
    } catch(error) {
      throw(error);
    }
  }

  /**
   * @returns DD/MM/YYYY H:m?
   */
  private formatDate(date: Date, time: boolean = false): string {
    const day = date.getDate() < 10 ?
      '0' + date.getDate() :
      date.getDate().toString();

    const month = date.getMonth() < 10 ?
      '0' + date.getMonth() :
      date.getMonth().toString();

    const year = date.getFullYear();

    const hours = date.getHours();

    const minutes = date.getMinutes();

    return `${day}/${month}/${year}${time ? `${hours}:${minutes}` : ''}`;
  }
}
