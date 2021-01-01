import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { Rol } from 'app/entities/rol';
import { RolMenu } from 'app/entities/rol-menu';

export const actualizarRol = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { nombre, descripcion, rolesMenus }: Rol = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await getRepository(Rol).update(id, { nombre, descripcion });

    rolesMenus.forEach(async rolMenu => {
      await getRepository(RolMenu).insert({
        rol: { id: parseInt(id, 10) },
        menu: rolMenu.menu
      });
    });

    res.json({ mensaje: 'Rol actualizado' });

  } catch(error) {
    res.status(500).json(error);
  }
};
