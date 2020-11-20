import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Menu } from 'entities/menu';

export const obtenerMenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;

  try {
    const menu = await getRepository(Menu)
    .findOne(idMenu, { relations: ['submenus'] });

    res.json(menu);
  } catch(error) {
    res.status(500).json(error);
  }
};
