import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PagoPedido } from "app/entities/pago-pedido";

export const obtenerPagosPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;

  try {
    const [pagosPedido, total] = await getRepository(PagoPedido).findAndCount({
      where: { pedido: { id: parseInt(idPedido, 10) } },
      order: {
        fechaPago: 'DESC'
      }
    });

    res.json({
      pagosPedido,
      total
    })
  } catch(error) {
    return res.status(500).json(error);
  }
}
