import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Rol } from 'entities/rol';
import { getRepository } from 'typeorm';

type RolBody = { nombre: string };

export const crearRol = async (req: Request, res: Response) => {
  const { nombre }: RolBody = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const rol = new Rol();
  rol.nombre = nombre;

  try {
    const nuevoRol = await getRepository(Rol).save(rol);
    res.json(nuevoRol);

  } catch(error) {
    res.status(500).json(error);
  }
};
