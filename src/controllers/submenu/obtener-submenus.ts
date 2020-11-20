import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Submenu } from 'entities/submenu';

export const obtenerSubmenus = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  const termino = req.query.termino || '';

  try {
    const [ submenus, total ] = await getRepository(Submenu)
    .createQueryBuilder('submenu')
    .skip(skip as number)
    .take(take as number)
    .orderBy('submenu.nombre', 'ASC')
    .where(
      'LOWER(submenu.nombre) LIKE :nombre',
      { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({ submenus, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
