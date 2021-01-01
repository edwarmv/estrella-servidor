import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { Producto } from 'app/entities/producto';

type Body = {
  nombre: string,
  descripcion: string,
  precio: number
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const id = req.params.id;

  const { nombre, descripcion, precio }: Body = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: errors.array() });
  }

  try {
    await getRepository(Producto).update(id, { nombre, descripcion, precio });

    res.json({ mensaje: 'Producto actualizado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
