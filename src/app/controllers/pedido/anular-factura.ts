import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Factura } from "app/entities/factura";
import { Pedido } from "app/entities/pedido";

export const anularFacturaPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;

  try {
    if (idPedido) {
      const pedido = await getRepository(Pedido).findOne(
        idPedido,
        { relations: [ 'factura' ] }
      );

      if (!pedido || !pedido.factura) {
        return res.status(404).json({
          mensaje: 'El pedido no esta facturado'
        });
      }

      await getRepository(Factura).update(pedido.factura.id, { anulado: true });

      res.json({
        mensaje: 'Factura anulada'
      });
    }
  } catch(error) {
    res.status(500).json(error);
  }
};
