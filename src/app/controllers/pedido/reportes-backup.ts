import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import PdfPrinter from 'pdfmake';
import {
  TDocumentDefinitions,
  TFontDictionary,
  TableCell,
  Table,
  Content
} from 'pdfmake/interfaces';
import { basePath } from 'index';
import Big from 'big.js';
import { format } from 'date-fns';

export class ReportesPedido {
  constructor() {
    this.exec = this.exec.bind(this);
  }

  async exec(req: Request, res: Response) {
    const estado = req.query.estado;
    const take = req.query.take || 10;

    try {
      const pedidosQuery = getRepository(Pedido)
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.detallesPedidos', 'detallesPedidos')
      .leftJoinAndSelect('detallesPedidos.producto', 'producto')
      .take(Number(take))
      .orderBy('pedido.fechaEntrega','DESC');

      let pedidos: Pedido[];
      if (estado) {
        pedidos = await pedidosQuery
        .where('pedido.estado = :estado', { estado })
        .getMany();
      } else {
        pedidos = await pedidosQuery.getMany();
      }

      if (pedidos.length === 0) {
        return res.json({ mensaje: '0 pedidos' });
      }

      const pdf = await this.generarPDF(pedidos);

      res.setHeader('Content-Type', 'application/pdf');
      res.set('Content-disposition', `inline; filename=reporte-pedidos.pdf`);
      res.end(pdf);
    } catch(error) {
      res.status(500).json(error.message);
    }
  }

  private generarPDF(pedidos: Pedido[]): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const docDefinition: TDocumentDefinitions = {
        header: {
          text: 'PANADERÍA Y PASTELERÍA LA ESTRELLA DEL SUR',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        footer: (currentPage, pageCount) => ({
          columns: [
            {
              text: `${format(new Date(), 'dd/MM/y H:mm')}`,
            },
            {
              text: `${currentPage} - ${pageCount}`,
              alignment: 'right',
            }
          ],
          margin: [40, 10, 40, 0]
        }),
        pageSize: 'LETTER',
        content: [
          { text: 'REPORTE DE PEDIDOS', style: 'header' },
          {
            table: this.pedidosTable(pedidos),
            margin: [0, 0, 0, 16]
          },
          {
            stack: this.detallesPedidosContent(pedidos),
          }
        ],
        styles: {
          header: {
            bold: true,
            alignment: 'center',
            fontSize: 16,
            margin: [0, 0, 0, 12]
          }
        }
      };

      const fonts: TFontDictionary = {
        Roboto: {
          normal: `${basePath}/./../assets/fonts/Roboto/Roboto-Regular.ttf`,
          bold: `${basePath}/./../assets/fonts/Roboto/Roboto-Medium.ttf`,
          italics: `${basePath}/./../assets/fonts/Roboto/Roboto-Italic.ttf`,
          bolditalics: `${basePath}/./../assets/fonts/Roboto/Roboto-MediumItalic.ttf`
        }
      };

      const printer = new PdfPrinter(fonts);
      const doc = printer.createPdfKitDocument(docDefinition);

      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.end();
    });
  }

  private pedidosTable(pedidos: Pedido[]): Table {
    const header: TableCell[][] = [
      [
        { text: 'Nº', bold: true },
        { text: 'CLIENTE', bold: true },
        { text: 'FECHA DE ENTREGA', bold: true },
        { text: 'ESTADO', bold: true }
      ]
    ];

    const tableBody: TableCell[][] = pedidos.map((pedido, i): TableCell[] => {
      return [
        { text: `${i + 1}` },
        { text: `${pedido.cliente.nombre} ${pedido.cliente.apellido}` },
        { text: format(pedido.fechaEntrega, 'dd/MM/Y H:m') },
        { text: `${pedido.estado.toUpperCase()}` }
      ];
    });

    return {
      widths: ['auto', '*', 'auto', 'auto'],
      headerRows: 1,
      body: [ ...header, ...tableBody ],
    };
  } // fin pedidosTable

  private detallesPedidosContent(pedidos: Pedido[]): Content[] {
    return pedidos.map((pedido, indexPedido) => {
      const header: TableCell[][] = [
        [
          { text: 'Nº', bold: true },
          { text: 'PRODUCTO', bold: true },
          { text: 'P. UNITARIO', bold: true },
          { text: 'CANTIDAD', bold: true },
          { text: 'SUBTOTAL', bold: true }
        ]
      ];

      const detallesPedidos: TableCell[][] = pedido.detallesPedidos
      .map((detallePedido, indexDetallePedido): TableCell[] => {
        return [
          indexDetallePedido === 0 ?
            {
              text: `${indexPedido + 1}`,
              rowSpan: pedido.detallesPedidos.length + 1
            } : {},
          { text: `${detallePedido.producto.nombre}` }, // producto
          {
            text: new Big(detallePedido.precioUnitario).toFixed(2),
            alignment: 'right'
          }, // p. unitario
          {
            text: `${detallePedido.cantidad}`,
            alignment: 'right'
          }, // cantidad
          {
            text: new Big(detallePedido.precioUnitario)
            .times(detallePedido.cantidad)
            .toFixed(2),
            alignment: 'right'
          } // subtotal
        ];
      });

      const total: TableCell[] = [
        { text: '' },
        {
          text: `TOTAL: ${pedido.detallesPedidos.reduce(
            (accumulator, detallePedido): number => {
              return new Big(detallePedido.precioUnitario)
              .times(detallePedido.cantidad)
              .add(accumulator).toNumber();
            },
            0
          ).toFixed()}`,
          bold: true,
          alignment: 'right',
          colSpan: 4
        }, {}, {}, {}
      ];

      detallesPedidos.push(total);

      return {
        table: {
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [...header, ...detallesPedidos],
        },
        margin: [0, 0, 0, 16]
      };
    });
  } // fin detallesPedidosContent
}
