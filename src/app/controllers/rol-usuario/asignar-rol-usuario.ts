import { Request, Response } from 'express';
import { RolUsuario } from 'app/entities/rol-usuario';
import { getRepository } from 'typeorm';

export const asignarRolUsuario = async (req: Request, res: Response) => {
  const rolUsuario: RolUsuario = req.body;

  try {
    await getRepository(RolUsuario).insert(rolUsuario);

    res.status(201).json({ mensaje: 'Rol asignado correctamente' });

  } catch(error) {
    if (error.code === '23505') {
      res.status(400).json({ mensaje: 'El rol ya se encuentra asignado' });
    } else {
      res.status(500).json(error);
    }
  }
};
