import { Request, Response } from "express"
import { getRepository, getConnection } from "typeorm";
import { PagoPedido } from "app/entities/pago-pedido";
import { DetallePedido } from "app/entities/detalle-pedido";
import { Big } from "big.js";
import { Pedido } from "app/entities/pedido";
import { TablaLog, OperacionTablaLog } from "app/entities/tabla-log";
import { TableNames } from "app/entities/table-names.enum";
import { TokenUtil } from "app/utils/token.util";

export const registrarPagoPedido = async (req: Request, res: Response) => {
  const { monto, pedido }: PagoPedido = req.body;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  const pedidoDB = await getRepository(Pedido).findOne(
    pedido.id,
    { relations: ['factura'] }
  );

  if (!pedidoDB) {
    return res.status(403).json({ mensaje: 'Pedido no encontrado' });
  }

  if (pedidoDB.factura) {
    return res.status(403).json(
      { mensaje: 'Pedido facturado, no se permiten más registros de pagos' }
    );
  }

  if (!monto || !pedido) {
    return res.status(401).json({ mensaje: 'Datos incompletos'});
  }

  try {
    const total: number = (await getRepository(DetallePedido).find({ pedido }))
    .reduce((prev, curr) => {
      return new Big(prev).plus(
        new Big(curr.cantidad).times(curr.precioUnitario)
      ).toNumber();
    }, 0);

    const pagos: number = (await getRepository(PagoPedido).find({ pedido }))
    .reduce((prev, curr) => {
      return new Big(prev).plus(curr.monto).toNumber();
    }, 0);

    const saldo: number = new Big(total).minus(pagos).toNumber();

    if (saldo === 0) {
      return res.status(403).json({ mensaje: 'El saldo es igual a 0, no se permiten mas registros de pagos'});
    }

    if (new Big(saldo).minus(monto).toNumber() < 0) {
      return res.status(409).json({ mensaje: 'El monto no debe ser mayor al saldo'});
    }

    await getConnection().transaction(async (transaction) => {
      const pagoPedido = await transaction.save(PagoPedido, { monto, pedido});

      await transaction.insert(TablaLog, {
        operacion: OperacionTablaLog.INSERT,
        nombreTabla: TableNames.pagos_pedido,
        usuario: { id: parseInt(idUsuario!) },
        nuevoValor: pagoPedido,
      })

      res.json({ mensaje: 'Monto registrado', pagoPedido });
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}
