import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CategoriaProducto } from 'app/entities/categoria-producto';

export const obtenerCategoriaProducto = async (req: Request, res: Response) => {
  const idCategoriaProducto = req.params.idCategoriaProducto;
  try {
    const categoriaProducto = await getRepository(CategoriaProducto).findOne(idCategoriaProducto);
    if (!categoriaProducto) {
      return res.status(401).json({ mensaje: 'Categoria no encontrada' });
    }
    return res.json(categoriaProducto);
  } catch (error) {
    return res.status(500).json(error);
  }
}
