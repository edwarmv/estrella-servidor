import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'entities/pedido';

export const obtenerPedidos = async (req: Request, res: Response) => {
  try {
    const [pedidos, total] = await getRepository(Pedido).findAndCount();

    res.json({ pedidos, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
