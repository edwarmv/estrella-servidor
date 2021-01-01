import ejs from 'ejs';
import pdf from 'html-pdf';
import { basePath } from 'index';
import { CodigoQR } from './codigo-qr';
import { Pedido } from 'app/entities/pedido';
import { CodigoControl } from './codigo-control/codigo-control';
import { NumeroLiteral } from './numero-literal';
import { Sucursal } from 'app/entities/sucursal';
import { CasaMatriz } from 'app/entities/casa-matriz';
import { Cliente } from 'app/entities/cliente';
import Big from 'big.js';

export class FacturaPDF {
  generarPDFPedido(pedido: Pedido): Promise<Buffer> {
    return new Promise<Buffer>(async (resolve, reject) => {
      try {
        const casaMatriz = pedido.factura.dosificacion.sucursal.casaMatriz;

        const sucursal = pedido.factura.dosificacion.sucursal;

        const numeroAutorizacion =
          pedido.factura.dosificacion.numeroAutorizacion;

        const numeroFactura = pedido.factura.numeroFactura;

        const cliente = pedido.cliente;

        const fechaEmision = this.formatDate(pedido.factura.fechaEmision);

        const fechaLimiteEmision = this.formatDate(
          pedido.factura.dosificacion.fechaLimiteEmision
        );

        let total = 0;

        const llaveDosificacion = pedido.factura.dosificacion.llaveDosificacion;

        const ventas = pedido.detallesPedidos.map(detallePedido => {
          return {
            cantidad: detallePedido.cantidad,
            detalle: detallePedido.producto.nombre,
            precioUnitario: detallePedido.precioUnitario,
            subtotal: (() => {
              const subtotal = new Big(detallePedido.cantidad)
                .times(detallePedido.precioUnitario);

              total = Number(subtotal.add(total).valueOf());

              return subtotal.toFixed(2);
            })()
          };
        });

        const totalLiteral = new NumeroLiteral().convertir(total, 'Bolivianos');

        const codigoControl = new CodigoControl()
        .generarCodigo(
          numeroAutorizacion.toString(),
          numeroFactura.toString(),
          cliente.nitCI.toString(),
          pedido.factura.fechaEmision,
          total.toFixed(),
          llaveDosificacion
        );

        const codigoQR =  new CodigoQR()
        .generarInsumoQR(
          casaMatriz.nit,
          pedido.factura.numeroFactura,
          pedido.factura.dosificacion.numeroAutorizacion,
          pedido.factura.fechaEmision,
          total,
          total,
          codigoControl,
          cliente.nitCI
        );

        resolve(
          this.pdfCreate({
            casaMatriz,
            sucursal,
            dosificacion: {
              nitEmisor: casaMatriz.nit,
              numeroFactura,
              numeroAutorizacion,
            },
            transaccion: {
              fechaEmision,
              cliente,
              ventas,
            },
            total: total.toFixed(2),
            totalLiteral,
            codigoControl,
            codigoQR,
            fechaLimiteEmision
          })
        );
      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * @returns DD/MM/YYYY
   */
  private formatDate(date: Date): string {
    const day = date.getDate() < 10 ?
      '0' + date.getDate() :
      date.getDate().toString();

    const month = date.getMonth() < 10 ?
      '0' + date.getMonth() :
      date.getMonth().toString();

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private pdfCreate(
    data: {
      casaMatriz: CasaMatriz,
      sucursal: Sucursal,
      dosificacion: {
        nitEmisor: string,
        numeroFactura: number,
        numeroAutorizacion: string,
      },
      transaccion: {
        fechaEmision: string, // DD/MM/YYYY
        cliente: Cliente,
        ventas: {
          cantidad: number,
          detalle: string,
          precioUnitario: number,
          subtotal: string
        }[]
      }
      total: string,
      totalLiteral: string,
      codigoControl: string,
      codigoQR: string,
      fechaLimiteEmision: string // DD/MM/YYYY
    }
  ): Promise<Buffer> {
    return new Promise<Buffer>(async (resolve, reject) => {
      try {
        const html = await ejs.renderFile(
          'src/controllers/factura/template/factura.ejs',
          data
        );
        pdf.create(
          html,
          {
            // Base path para para los assets de factura.ejs
            base: `file://${basePath}/controllers/factura/template/`,
            // En caso de que se generen los archivos se guardarian en esta ruta
            directory: 'src/../tmp/',
            width: '80mm',
            height: '20cm'
          }
        ).toBuffer((error, res) => {
          if (error) {
            reject(error);
          } else {
            resolve(res);
          }
        });
      } catch(error) {
        reject(error);
      }
    });

  }
}
