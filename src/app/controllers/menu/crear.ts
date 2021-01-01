import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const crearMenu = async (req: Request, res: Response) => {
  const { nombre, submenus }: Menu = req.body;

  try {
    const menu = await getRepository(Menu).save({ nombre });

    const submenusIDs = submenus.map(submenu => submenu.id);

    await getConnection()
    .createQueryBuilder()
    .relation(Menu, 'submenus')
    .of(menu)
    .add(submenusIDs);

    res.status(201).json({ mensaje: 'Menú creado correctamente'});
  } catch(error) {
    res.status(500).json(error);
  }
};
