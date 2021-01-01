import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'app/entities/cliente';

export const obtenerClientes = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;

  const take = req.query.take || 5;

  const termino = req.query.termino || '';

  try {
    const [clientes, total] = await getRepository(Cliente)
    .createQueryBuilder('cliente')
    .skip(skip as number)
    .take(take as number)
    .orderBy('cliente.nombre', 'ASC')
    .orderBy('cliente.apellido', 'ASC')
    .where(
      'LOWER(cliente.nitCI) LIKE :nitCI',
      { nitCI: `%${(termino as string).toLowerCase()}%` }
    )
    .orWhere(
      'LOWER(cliente.nombre) LIKE :nombre',
      { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .orWhere(
      'LOWER(cliente.apellido) LIKE :apellido',
      { apellido: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({ clientes, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
