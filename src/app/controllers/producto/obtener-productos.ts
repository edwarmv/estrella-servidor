import { Request, Response } from 'express';
import { getRepository, ILike, In } from 'typeorm';
import { Producto } from 'app/entities/producto';

export const obtenerProductos = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 5;
  const termino = req.query.termino || '';
  const estadoProducto = req.query.estadoProducto;

  let categoriasProductos = req.query.categoriasProductos;
  if (categoriasProductos) {
    categoriasProductos = JSON.parse(categoriasProductos as string);
  }

  try {
    let productos: Producto[], total: number;
    const query = getRepository(Producto)
      .createQueryBuilder('producto')
      .skip(skip)
      .take(take)
      .leftJoinAndSelect(
        'producto.categoriasProductosProductos',
        'categoriasProductosProductos'
      )
      .leftJoinAndSelect('categoriasProductosProductos.categoriaProducto', 'categoriaProducto')
      .where('producto.nombre ILIKE :termino', { termino: `%${termino}%` })
      .orderBy('producto.nombre', 'ASC');
    if (Array.isArray(categoriasProductos) && categoriasProductos.length > 0) {
      query
        .andWhere('categoriaProducto.nombre IN (:...categoriasProductos)', {
          categoriasProductos,
        });
    }
    if (estadoProducto === 'true') {
      query
        .andWhere('producto.estado = :estadoProducto', {
          estadoProducto: true,
        });
    }
    if (estadoProducto === 'false') {
      query
        .andWhere('producto.estado = :estadoProducto', {
          estadoProducto: false
        });
    }

    [productos, total] = await query.getManyAndCount();

    res.json({ productos, total });
  } catch (error) {
    res.status(500).json(error);
  }
};
