import { Request, Response } from 'express';
import { CategoriaProducto } from 'app/entities/categoria-producto';
import { getRepository } from 'typeorm';

export const crearCategoriaProducto = async (req: Request, res: Response) => {
  const { nombre }: CategoriaProducto = req.body;

  try {
    await getRepository(CategoriaProducto).insert({ nombre });

    return res.status(201).json({
      mensaje: 'Categoria creada exitosamente',
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({
        mensaje: 'El nombre de la categoria ya se encuentra registrado',
      });
    } else {
      res.status(500).json(error);
    }
  }
};
