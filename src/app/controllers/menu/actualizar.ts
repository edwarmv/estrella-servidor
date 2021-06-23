import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const actualizarMenu = async (req: Request, res: Response) => {
  const idMenu = req.params.idMenu;
  const { nombre, path }: Menu = req.body;

  try {
    await getRepository(Menu).update(idMenu, { nombre, path });

    res.json({ mensaje: 'Menú actualizado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
