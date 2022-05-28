import { Request, Response } from 'express';
import { CategoriaProductoProducto } from 'app/entities/categoria-producto-producto';
import { getRepository } from 'typeorm';

export const crearCategoriaProductoProducto = async (
  req: Request,
  res: Response
) => {
  const categoriaProductoProducto: CategoriaProductoProducto = req.body;

  try {
    await getRepository(CategoriaProductoProducto).insert(
      categoriaProductoProducto
    );

    return res.status(201).json({
      mensaje: 'Categoria relacionada correctamente',
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({
        mensaje: 'Categoria seleccionada ya asociada',
      });
    } else {
      res.status(500).json(error);
    }
  }
};
