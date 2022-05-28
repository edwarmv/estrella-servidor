import { Request, Response } from 'express';
import { CategoriaProductoProducto } from 'app/entities/categoria-producto-producto';
import { getRepository } from 'typeorm';

export const borrarCategoriaProductoProducto = async (
  req: Request,
  res: Response
) => {
  const idCategoriaProducto = Number(req.params.idCategoriaProducto);
  const idProducto = Number(req.params.idProducto);

  try {
    await getRepository(CategoriaProductoProducto).delete({
      categoriaProducto: { id: idCategoriaProducto },
      producto: { id: idProducto },
    });
    res.json({
      mensaje: 'Categoria eliminada correctamente',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
