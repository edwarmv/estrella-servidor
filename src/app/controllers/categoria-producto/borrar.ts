import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CategoriaProducto } from 'app/entities/categoria-producto';

export const borrarCategoriaProducto = async (req: Request, res: Response) => {
  const idCategoriaProducto = Number(req.params.idCategoriaProducto);

  try {
    await getRepository(CategoriaProducto)
      .delete(idCategoriaProducto);

    res.json({
      mensaje: 'Categoria eliminada correctamente',
    })
  } catch (error) {
    res.status(500).json(error);
  }
}
