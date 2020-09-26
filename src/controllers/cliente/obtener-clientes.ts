import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'entities/cliente';

export const obtenerClientes = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;

  const take = req.query.take || 5;

  const termino = req.query.termino || '';

  try {
    const [clientes, total] = await getRepository(Cliente)
    .createQueryBuilder('cliente')
    .skip(skip as number)
    .take(take as number)
    .orderBy('cliente.nombres', 'ASC')
    .orderBy('cliente.apellidos', 'ASC')
    .where(
      'LOWER(cliente.nombres) LIKE :nombres',
      { nombres: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({ clientes, total });
  } catch(error) {
    res.status(500).json(error);
  }
};
