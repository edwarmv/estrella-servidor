import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Rol } from 'app/entities/rol';
import { getRepository } from 'typeorm';
import { RolMenu } from 'app/entities/rol-menu';

export const crearRol = async (req: Request, res: Response) => {
  const { nombre, descripcion, rolesMenus }: Rol = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: errors.array() });
  }

  try {
    const rol = await getRepository(Rol).save({ nombre, descripcion });

    rolesMenus.forEach(async rolMenu => {
      await getRepository(RolMenu).insert({ rol, menu: rolMenu.menu });
    });

    res.json({ mensaje: 'Rol creado' });

  } catch(error) {
    res.status(500).json(error);
  }
};
