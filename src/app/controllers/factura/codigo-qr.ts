import { format } from 'date-fns';

export class CodigoQR {
  generarInsumoQR(
    nitEmisor: string,
    numeroFactura: number,
    numeroAutorizacion: string,
    fechaEmision: Date,
    total: number,
    importe: number,
    codigoControl: string,
    nitCICliente: string
  ): string {
    return `${nitEmisor}|${numeroFactura}|${numeroAutorizacion}|\
${format(fechaEmision, 'dd/MM/y')}|${total}|${importe}|${codigoControl}|\
${nitCICliente}`;
  }
}
