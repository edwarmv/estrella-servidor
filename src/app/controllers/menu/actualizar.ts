import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const actualizarMenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;
  const { nombre, submenus }: Menu = req.body;

  try {
    await getRepository(Menu).update(idMenu, { nombre });

    const submenusIDs = submenus.map(submenu => submenu.id);

    await getConnection()
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(idMenu)
    .add(submenusIDs);

    res.json({ mensaje: 'Menú actualizado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
