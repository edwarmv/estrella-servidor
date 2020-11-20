import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'entities/cliente';

export const obtenerCliente = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const cliente = await getRepository(Cliente).findOne(id);

    if (!cliente) {
      return res.status(400).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch(error) {
    if (error.code === '22P02') {
      return res.status(400).json({ mensaje: 'ID inválida' });
    }
    res.status(500).json(error);
  }
};
