import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Submenu } from 'entities/submenu';

export const crearSubmenu = async (req: Request, res: Response) => {
  const submenu = req.body;

  try {
    await getRepository(Submenu).insert(submenu);

    res.json({ mensaje: 'Submenú creado exitosamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
