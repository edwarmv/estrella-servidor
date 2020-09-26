import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Producto } from 'entities/producto';

export const obtenerProductos = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;

  const take = req.query.take || 5;

  const termino = req.query.termino || '';

  try {
    const [productos, total] = await getRepository(Producto)
    .createQueryBuilder('producto')
    .skip(skip as number)
    .take(take as number)
    .orderBy('producto.nombre', 'ASC')
    .where(
      'LOWER(producto.nombre) LIKE :nombre',
       { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({ productos, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
