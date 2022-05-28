import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { CasaMatriz } from 'app/entities/casa-matriz';
import Big from 'big.js';
import { basePath } from 'index';
import { format } from 'date-fns';
import PdfPrinter from 'pdfmake';
import { NumeroLiteral } from '../factura/numero-literal';

export class CrearNotaVentaPedido {
  constructor() {
    this.execute = this.execute.bind(this);
    this.generarPDF = this.generarPDF.bind(this);
  }

  async execute(req: Request, res: Response) {
    const idPedido = req.params.idPedido;
    try {
      const pedido = await getRepository(Pedido).findOne(idPedido, {
        relations: ['detallesPedidos', 'detallesPedidos.producto'],
      });
      if (!pedido) {
        return res.status(409).json({ mensaje: 'Pedido no encontrado' });
      }
      const casaMatriz = (await getRepository(CasaMatriz).find())[0];
      if (!casaMatriz) {
        return res
          .status(409)
          .json({ mensaje: 'No existe una casa matriz registrada' });
      }

      console.log('execute');
      this.generarPDF(pedido, casaMatriz, pdfBase64 => {
        res.setHeader('Content-Type', 'application/pdf');
        res.set(
          'Content-disposition',
          `inline; filename=nota-venta-pedido-${pedido.id}.pdf`
        );
        res.end(pdfBase64);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  generarPDF(
    pedido: Pedido,
    casaMatriz: CasaMatriz,
    cb: (pdfBase64: Buffer) => void
  ): void {
    const total = pedido.detallesPedidos.reduce(
      (acumulator, detallePedido) =>
        new Big(acumulator)
          .add(
            new Big(detallePedido.precioUnitario)
              .times(detallePedido.cantidad)
              .toFixed(2)
          )
          .toNumber(),
      0
    );
    const totalLiteral = new NumeroLiteral().convertir(
      Number(total),
      'BOLIVIANOS'
    );
    const docDefinition: TDocumentDefinitions = {
      pageSize: {
        width: 80 * 2.835,
        height: 'auto',
      },
      content: [
        { text: casaMatriz.nombre, style: 'title' },
        { text: 'NOTA DE VENTA', style: 'header' },
        { text: `ID PEDIDO: ${pedido.id}` },
        {
          text: `GENERADO EL: ${format(Date.now(), 'dd/MM/yyyy HH:mm')}`,
          margin: [0, 0, 0, 5],
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
              { text: detallePedido.producto.nombre },
              {
                text: new Big(detallePedido.cantidad).toFixed(2),
                alignment: 'right',
              },
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
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 5],
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

    try {
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => cb(Buffer.concat(chunks)));
      doc.end();
    } catch (error) {
      throw error;
    }
  }
}
