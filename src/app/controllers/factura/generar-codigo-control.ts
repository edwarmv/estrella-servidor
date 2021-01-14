import { Request, Response } from 'express';
import { CodigoControl } from './codigo-control/codigo-control';

export const generarCodigoControl = (req: Request, res: Response) => {
  const datosCodigoControl: {
    numeroAutorizacion: string,
    numeroFactura: string,
    nitCI: string,
    fechaTransaccion: string,
    montoTransaccion: string,
    llaveDosificacion: string,
  } = req.body;

  if (!datosCodigoControl.numeroAutorizacion ||
      !datosCodigoControl.numeroFactura      ||
      !datosCodigoControl.nitCI              ||
      !datosCodigoControl.fechaTransaccion   ||
      !datosCodigoControl.montoTransaccion   ||
      !datosCodigoControl.llaveDosificacion) {
    return res.status(404).json({ mensaje: 'Todos los campos son requerido' });
  }

  const fechaTransaccion = ((): string => {
    const [day, month, year] = datosCodigoControl.fechaTransaccion.split('/');
    return year + month + day;
  })();

  const montoTransaccion = ((): string => {
    const monto = datosCodigoControl.montoTransaccion.replace(/\,/g, '.');
    return Math.round(parseFloat(monto)).toString();
  })();

  try {
    const codigoControl = new CodigoControl()
    .generarCodigo(
      datosCodigoControl.numeroAutorizacion,
      datosCodigoControl.numeroFactura,
      datosCodigoControl.nitCI,
      fechaTransaccion,
      montoTransaccion,
      datosCodigoControl.llaveDosificacion
    );

    res.json(codigoControl);
  } catch(error) {
    res.status(500).json(error);
  }
};
