import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const obtenerMenus = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  const termino = req.query.termino || '';

  try {
    const [menus, total] = await getRepository(Menu)
    .createQueryBuilder('menu')
    .skip(skip as number)
    .take(take as number)
    .orderBy('menu.nombre', 'ASC')
    .where(
      'LOWER(menu.nombre) LIKE :nombre',
      { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({ menus, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
