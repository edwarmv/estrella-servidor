import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'app/entities/cliente';

export const borrarCliente = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await getRepository(Cliente).delete(id);

    res.json({ mensaje: 'Cliente eliminado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
