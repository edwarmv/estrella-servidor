import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Producto } from 'entities/producto';

export const borrarProducto = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await getRepository(Producto).delete(id);

    res.json({ mensaje: 'Producto borrado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
