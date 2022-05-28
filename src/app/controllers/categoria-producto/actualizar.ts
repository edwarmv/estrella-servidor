import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CategoriaProducto } from 'app/entities/categoria-producto';

export const actualizarCategoriaProducto = async (
  req: Request,
  res: Response
) => {
  const categoriaProducto: CategoriaProducto = req.body;

  await getRepository(CategoriaProducto)
    .update(categoriaProducto.id, categoriaProducto)
    .catch((error) => {
      if (error.code === '23505') {
        res.status(409).json({
          mensaje: 'El nombre de la categoria ya se encuentra registrado'
        });
      } else {
        res.status(500).json(error);
      }
    });

  return res.json({ mensaje: 'Pedido actualizado' });
};
