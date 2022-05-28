import { Request, Response } from 'express';
import { getRepository, ILike } from 'typeorm';
import { CategoriaProducto } from 'app/entities/categoria-producto';

export const obtenerCategoriasProductos = async (
  req: Request,
  res: Response
) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 5;
  const termino = req.query.termino || '';

  try {
    const [categoriasProductos, total] = await getRepository(
      CategoriaProducto
    ).findAndCount({ skip, take, where: { nombre: ILike(`%${termino}%`) }, order: { nombre: 'ASC' } });

    return res.json({
      categoriasProductos,
      total,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
