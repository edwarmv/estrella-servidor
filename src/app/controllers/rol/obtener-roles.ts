import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from 'app/entities/rol';

export const obtenerRoles = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  const termino = req.query.termino || '';

  try {
    const [roles, total] = await getRepository(Rol).createQueryBuilder('rol')
    .skip(skip as number)
    .take(take as number)
    .orderBy('rol.nombre', 'ASC')
    .where(
      'LOWER(rol.nombre) LIKE :nombre',
      { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();
    res.json({ roles, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
