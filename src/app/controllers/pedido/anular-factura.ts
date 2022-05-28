import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { Factura } from "app/entities/factura";
import { Pedido } from "app/entities/pedido";
import { TablaLog, OperacionTablaLog } from "app/entities/tabla-log";
import { TokenUtil } from "app/utils/token.util";
import { TableNames } from "app/entities/table-names.enum";

export const anularFacturaPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  try {
    const pedido = await getRepository(Pedido).findOne(
      idPedido,
      { relations: [ 'factura' ] }
    );

    if (!pedido || !pedido.factura) {
      return res.status(404).json({
        mensaje: 'El pedido no esta facturado'
      });
    }

    await getConnection().transaction(async (transaction) => {
      const pedidoActualizado = await transaction.save(Pedido, { id: parseInt(idPedido), cancelado: true });
      const factura = await transaction.save(Factura, { id: pedido.factura.id, anulado: true });

      await transaction.insert<TablaLog<Factura>>(TablaLog, {
        operacion: OperacionTablaLog.UPDATE,
        nombreTabla: TableNames.facturas,
        usuario: { id: parseInt(idUsuario!) },
        nuevoValor: factura,
        antiguoValor: pedido.factura,
      });

      await transaction.insert<TablaLog<Pedido>>(TablaLog, {
        operacion: OperacionTablaLog.UPDATE,
        nombreTabla: TableNames.facturas,
        usuario: { id: parseInt(idUsuario!) },
        nuevoValor: pedidoActualizado,
        antiguoValor: pedido,
      });
    })

    res.json({
      mensaje: 'Factura anulada'
    });
  } catch(error) {
    res.status(500).json(error);
  }
};
