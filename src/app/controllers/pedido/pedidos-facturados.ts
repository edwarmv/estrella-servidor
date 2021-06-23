import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';

export const pedidosFacturados = async (req: Request, res: Response) => {
  try {
    const [pedidos, total] = await getRepository(Pedido)
    .findAndCount({
      join: {
        alias: 'pedido',
        innerJoinAndSelect: {
          factura: 'pedido.factura'
        },
        leftJoinAndSelect: {
          cliente: 'pedido.cliente'
        }
      }
    });

    res.json({ pedidos, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
