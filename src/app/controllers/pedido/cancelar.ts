import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { TokenUtil } from 'app/utils/token.util';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { Factura } from 'app/entities/factura';

export const cancelarPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  const pedido = await getRepository(Pedido).findOne(idPedido, {
    relations: ['factura'],
  });

  if (!pedido) {
    return res.status(400).json({ mensaje: 'Pedido no encontrado' });
  }

  let respuesta: { mensaje: string, status: number } = {
    mensaje: 'Pedido cancelado correctamente',
    status: 200,
  };

  await getConnection()
    .transaction(async (transaction) => {
      if (pedido.factura) {
        if (pedido.factura.anulado) {
          respuesta.mensaje = 'Factura del pedido anulada, no se permiten más cambios';
          respuesta.status = 403;
        } else {
          await transaction.update(Pedido, idPedido, { cancelado: true });

          await transaction.insert(TablaLog, {
            usuario: { id: parseInt(idUsuario!) },
            operacion: OperacionTablaLog.UPDATE,
            nombreTabla: TableNames.pedidos,
            antiguoValor: pedido,
            nuevoValor: { ...pedido, ...{ cancelado: true } },
          });

          await transaction.update(Factura, pedido.factura.id, { anulado: true });

          await transaction.insert(TablaLog, {
            usuario: { id: parseInt(idUsuario!) },
            operacion: OperacionTablaLog.UPDATE,
            nombreTabla: TableNames.facturas,
            antiguoValor: pedido.factura,
            nuevoValor: { ...pedido.factura, ...{ anulado: true } },
          });
        }
      } else {
        await transaction.update(Pedido, idPedido, {
          cancelado: !pedido.cancelado,
        });

        await transaction.insert(TablaLog, {
          usuario: { id: parseInt(idUsuario!) },
          operacion: OperacionTablaLog.UPDATE,
          nombreTabla: TableNames.pedidos,
          antiguoValor: pedido,
          nuevoValor: { ...pedido, ...{ cancelado: !pedido.cancelado } },
        });
      }
    })
    .catch((error) => res.status(500).json(error));

  res.status(respuesta.status).json({ mensaje: respuesta.mensaje });
};
