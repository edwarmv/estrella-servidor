import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Menu } from 'entities/menu';

export const desasignarSubmenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;
  const idSubmenu = req.params.idSubmenu;

  try {
    await getConnection()
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(idMenu)
    .remove(idSubmenu);

    res.json({ mensaje: 'Submenú desasignado correctamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
