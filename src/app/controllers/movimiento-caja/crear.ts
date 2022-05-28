import { Request, Response } from 'express';
import {
  MovimientoCaja,
  TipoMovimientoCaja,
} from 'app/entities/movimiento-caja';
import { getConnection } from 'typeorm';
import Big from 'big.js';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { TokenUtil } from 'app/utils/token.util';
import { Usuario } from 'app/entities/usuario';

export const crearMovimientoCaja = async (req: Request, res: Response) => {
  const { tipo, cantidad, motivoMovimiento, caja }: MovimientoCaja = req.body;
  const idUsuario = new TokenUtil().getTokenPayload(req).sub;

  if (!tipo || !cantidad || !motivoMovimiento || !caja) {
    return res.status(400).json({
      mensaje:
        'Los campos tipo, cantidad, motivoMovimiento y caja son requeridos',
    });
  }

  try {
    await getConnection().transaction(async transaction => {
      const movimientoCaja = new MovimientoCaja();
      movimientoCaja.tipo = tipo;
      movimientoCaja.cantidad = cantidad;
      movimientoCaja.motivoMovimiento = motivoMovimiento;
      movimientoCaja.caja = caja;
      movimientoCaja.usuario = { id: Number(idUsuario) } as Usuario;

      const ultimoMovimientoCaja = await transaction
        .getRepository(MovimientoCaja)
        .findOne({ order: { id: 'DESC' } });

      if (ultimoMovimientoCaja) {
        movimientoCaja.estadoAnterior = ultimoMovimientoCaja.estadoActual;
        if (tipo === TipoMovimientoCaja.INGRESO_EFECTIVO) {
          movimientoCaja.estadoActual = new Big(ultimoMovimientoCaja.estadoActual)
            .plus(cantidad)
            .toNumber();
        }
        if (tipo === TipoMovimientoCaja.RETIRO_EFECTIVO) {
          movimientoCaja.estadoActual = new Big(ultimoMovimientoCaja.estadoActual)
            .minus(cantidad)
            .toNumber();
        }
        if (movimientoCaja.estadoActual < 0) {
          return res.status(400).json({
            mensaje:
              'La caja no dispone de fondos suficientes para completar la operación',
          });
        }
      } else {
        if (tipo === TipoMovimientoCaja.RETIRO_EFECTIVO) {
          return res.status(400).json({
            mensaje: 'No hay fondos suficientes para completar esta operación',
          });
        }
        movimientoCaja.estadoAnterior = 0;
        movimientoCaja.estadoActual = cantidad;
      }
      const movimientoCajaDB = await transaction.save<MovimientoCaja>(
        movimientoCaja
      );

      await transaction.insert<TablaLog<MovimientoCaja>>(TablaLog, {
        operacion: OperacionTablaLog.INSERT,
        nombreTabla: TableNames.movimientos_cajas,
        usuario: { id: Number(idUsuario) },
        nuevoValor: movimientoCajaDB,
        antiguoValor: ultimoMovimientoCaja ? ultimoMovimientoCaja : {},
      });

      return res.status(201).json({
        value: movimientoCajaDB,
        mensaje: 'Movimiento registrado correctamente',
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
