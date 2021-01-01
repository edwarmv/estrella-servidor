import * as fs from 'fs';
import * as csv from 'fast-csv';
import { CodigoControl } from './codigo-control';

export class CasosPrueba {
  ejecutarPruebas() {
    const path = '/Users/edwar/Documents/taller/docs/casos-prueba-codigo-control.csv';
    const file = fs.createReadStream(path)
      .pipe(csv.parse({
        headers: [
          'nro',
          'numeroAutorizacion',
          'numeroFactura',
          'nitCI',
          'fechaTransaccion',
          'montoTransaccion',
          'llaveDocificacion',
          'cincoVerhoeff',
          'cadena',
          'sumatoriaProducto',
          'base64',
          'codigoControl'
        ],
        renameHeaders: true,
        delimiter: ';',
        // maxRows: 10
      }))
      .on('data', (row: {
        nro: string,
        numeroAutorizacion: string,
        numeroFactura: string,
        nitCI: string,
        fechaTransaccion: string,
        montoTransaccion: string,
        llaveDocificacion: string,
        cincoVerhoeff: string,
        cadena: string,
        sumatoriaProducto: string,
        base64: string,
        codigoControl: string
      }) => {
        const codigoControl = new CodigoControl();
        const result = codigoControl.generarCodigo(
          row.numeroAutorizacion,
          row.numeroFactura,
          row.nitCI,
          row.fechaTransaccion,
          Math.round(parseFloat(row.montoTransaccion)).toString(),
          row.llaveDocificacion
        );

        if (row.codigoControl !== result) {
          console.log('Uno o más registros no coinciden');
        }
      })
      .on('end', (rowCount: number) => {
        console.log('Registros cargados: ', rowCount);
      });
  }
}
