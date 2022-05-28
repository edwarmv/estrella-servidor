import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DetallePedido } from "app/entities/detalle-pedido";

export const ObtenerDetallesPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;

  try {
    const [ detallesPedido, total ] = await getRepository(DetallePedido).findAndCount({
      where: { pedido: { id: parseInt(idPedido, 10) } }
    });

    return res.json({
      detallesPedido,
      total,
    })
  } catch (error) {
    return res.status(500).json(error);
  }
}
