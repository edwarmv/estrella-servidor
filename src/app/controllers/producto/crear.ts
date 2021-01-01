import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Producto } from 'app/entities/producto';
import { validationResult } from 'express-validator';

type Body = {
  nombre: string,
  descripcion: string,
  precio: number
};

export const crearProducto = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio }: Body = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: errors.array() });
  }

  try {
    await getRepository(Producto)
    .insert({ nombre, descripcion, precio });

    res.status(201).json({ mensaje: 'Producto creado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
