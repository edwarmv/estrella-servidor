import { Request, Response } from 'express';
import { PagoPedido } from 'app/entities/pago-pedido';
import { getRepository, getConnection } from 'typeorm';
import { DetallePedido } from 'app/entities/detalle-pedido';
import { Big } from 'big.js';
import { Pedido } from 'app/entities/pedido';
import { TokenUtil } from 'app/utils/token.util';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';

export const actualizarPagoPedido = async (req: Request, res: Response) => {
  const { id, monto, pedido }: PagoPedido = req.body;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  const pedidoDB = await getRepository(Pedido).findOne(pedido.id, {
    relations: ['factura'],
  });

  if (!pedidoDB) {
    return res.status(403).json({ mensaje: 'Pedido no encontrado' });
  }

  if (pedidoDB.factura) {
    return res.status(403).json({
      mensaje: 'Pedido facturado, no se permiten modificaciones de pagos',
    });
  }

  try {
    // si el monto es el mismo al guardado en la bd entonces no realizamos
    // ninguna accion
    const pago = await getRepository(PagoPedido).findOne({ id, pedido });
    if (pago && pago.monto === monto) {
      return res.status(201).json({ mensaje: 'Pago actualizado correctamente' });
    }

    const total: number = (
      await getRepository(DetallePedido).find({ pedido })
    ).reduce(
      (prev, curr) =>
        new Big(prev)
          .plus(new Big(curr.cantidad).times(curr.precioUnitario))
          .toNumber(),
      0
    );

    const pagos: number = (
      await getRepository(PagoPedido).find({ pedido })
    ).reduce((prev, curr) => {
      if (curr.id === id) {
        return new Big(prev).plus(monto).toNumber();
      } else {
        return new Big(prev).plus(curr.monto).toNumber();
      }
    }, 0);

    const saldo: number = new Big(total).minus(pagos).toNumber();

    if (saldo < 0) {
      return res
        .status(409)
        .json({ mensaje: 'El monto no debe ser mayor al saldo' });
    }

    await getConnection().transaction(async (transaction) => {
      const pagoAnterior = await transaction.findOne(PagoPedido, {
        id,
        pedido,
      });
      await transaction.update(
        PagoPedido,
        { id, pedido },
        {
          id,
          pedido,
          monto,
        }
      );
      const pagoActualizado = await transaction.findOne(PagoPedido, {
        id,
        pedido,
      });

      await transaction.insert(TablaLog, {
        operacion: OperacionTablaLog.UPDATE,
        nombreTabla: TableNames.pagos_pedido,
        usuario: { id: parseInt(idUsuario!) },
        nuevoValor: pagoActualizado,
        antiguoValor: pagoAnterior,
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }

  return res.json({
    mensaje: 'Pago actualizado correctamente',
  });
};
