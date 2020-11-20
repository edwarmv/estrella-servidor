import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Submenu } from 'entities/submenu';

export const borrarSubmenu = async (req: Request, res: Response) => {
  const idSubmenu = req.params.idSubmenu;

  try {
    await getRepository(Submenu).delete(idSubmenu);

    res.json({ mensaje: 'Submenú eliminado correctamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
