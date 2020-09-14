import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { Rol } from 'entities/rol';

type RolBody = { nombre: string };

export const actualizarRol = async (req: Request, res: Response) => {
  const id = req.params.id;

  const { nombre }: RolBody = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await getRepository(Rol).update(id, {
      nombre
    });

    res.json({ mensaje: 'Rol actualizado' });

  } catch(error) {
    res.status(500).json(error);
  }
};
