import { Request, Response } from 'express';
import { Submenu } from 'entities/submenu';
import { getRepository } from 'typeorm';

export const actualizarSubmenu = async (req: Request, res: Response) => {
  const idSubmenu = req.params.idSubmenu;
  const submenu: Submenu = req.body;

  try {
    await getRepository(Submenu).update(idSubmenu, submenu);

    res.json({ mensaje: 'Submenu actualizado correctamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
