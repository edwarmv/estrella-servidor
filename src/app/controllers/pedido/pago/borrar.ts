import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { PagoPedido } from 'app/entities/pago-pedido';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { TokenUtil } from 'app/utils/token.util';

export const borrarPagoPedido = async (req: Request, res: Response) => {
  const idPagoPedido = req.params.idPagoPedido;
  const idPedido = req.params.idPedido;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  await getConnection()
    .transaction(async (transaction) => {
      const pagoPedido = await transaction.findOne(PagoPedido, {
        id: parseInt(idPagoPedido),
        pedido: { id: parseInt(idPedido) },
      });
      await transaction.delete(PagoPedido, {
        id: parseInt(idPagoPedido, 10),
        pedido: { id: parseInt(idPedido, 10) },
      });

      await transaction.insert(TablaLog, {
        operacion: OperacionTablaLog.DELETE,
        nombreTabla: TableNames.pagos_pedido,
        usuario: { id: parseInt(idUsuario!) },
        antiguoValor: pagoPedido,
      });
    })
    .catch((error) => res.status(500).json(error));

  res.json({ mensaje: 'Pago eliminado correctamente' });
};
