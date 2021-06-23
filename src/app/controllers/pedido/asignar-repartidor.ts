import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';

export const asignarRepartidor = async (req: Request, res: Response) => {
  const { idPedido, idRepartidor } = req.body;

  try {
    await getRepository(Pedido).update(idPedido, { repartidor: { id: idRepartidor } });

    res.json({ mensaje: 'Repartidor asignado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
