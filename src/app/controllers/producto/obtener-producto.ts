import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Producto } from 'app/entities/producto';

export const obtenerProducto = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const producto = await getRepository(Producto).findOne(id, {
      relations: [
        'categoriasProductosProductos',
        'categoriasProductosProductos.categoriaProducto',
      ],
    });

    if (!producto) {
      return res.status(400).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json(error);
  }
};
