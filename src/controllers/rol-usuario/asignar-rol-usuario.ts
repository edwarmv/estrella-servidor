import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RolUsuario } from 'entities/rol-usuario';
import { getRepository } from 'typeorm';

type RolUsuarioBody = { idRol: string, idUsuario: string };

export const asignarRolUsuario = async (req: Request, res: Response) => {
  const { idRol, idUsuario }: RolUsuarioBody = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await getRepository(RolUsuario).insert({
      rol: { id: parseInt(idRol, 10) },
      usuario: { id: parseInt(idUsuario, 10) }
    });

    res.status(201).json({ mensaje: 'Rol asignado correctamente' });

  } catch(error) {
    if (error.code === '23505') {
      res.status(400).json({ mensaje: 'El rol ya se encuentra asignado' });
    } else {
      res.status(500).json(error);
    }
  }
};
