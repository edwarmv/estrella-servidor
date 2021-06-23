import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const obtenerMenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;

  try {
    const menu = await getRepository(Menu).findOne(idMenu);

    res.json(menu);
  } catch(error) {
    res.status(500).json(error);
  }
};
