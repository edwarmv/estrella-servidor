import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from 'entities/rol';

export const borrarRol = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await getRepository(Rol).delete(id);
    res.json({ mensaje: 'Rol eliminado' });

  } catch(error) {
    res.status(500).json(error);
  }
};
