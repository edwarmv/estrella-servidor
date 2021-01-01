import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Rol } from 'app/entities/rol';

export const obtenerRol = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const rol = await getRepository(Rol)
    .findOne(id, { relations: ['rolesMenus', 'rolesMenus.menu'] });

    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    res.json(rol);
  } catch(error) {
    res.status(500).json(error);
  }
};
