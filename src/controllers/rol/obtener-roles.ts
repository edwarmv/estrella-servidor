import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from 'entities/rol';

export const obtenerRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getRepository(Rol).find();
    res.json(roles);
  } catch(error) {
    res.status(500).json(error);
  }
};
