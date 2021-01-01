import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const asignarSubmenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;
  const submenu = req.body;

  try {
    await getConnection()
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(idMenu)
    .add(submenu.id);

    res.json({ mensaje: 'Submenú asignado correctamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
