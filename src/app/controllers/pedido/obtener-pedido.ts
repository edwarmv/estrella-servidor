import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';

export const obtenerPedido = async (req: Request, res: Response) => {
  const idPedido = req.params.idPedido;

  try {
    const pedido = await getRepository(Pedido)
    .findOne(
      idPedido,
      {
        relations: [
          'cliente',
          'detallesPedidos',
          'detallesPedidos.producto',
          'factura',
          'repartidor',
          'pagosPedido',
        ]
      }
    );

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encotrado' });
    }

    res.json(pedido);
  } catch(error) {
    res.status(500).json(error);
  }
};
