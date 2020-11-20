import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Submenu } from 'entities/submenu';

export const obtenerSubmenu = async (req: Request, res: Response) => {
  const idSubmenu = req.params.idSubmenu;

  try {
    const submenu = await getRepository(Submenu).findOne(idSubmenu);

    res.json(submenu);
  } catch(error) {
    res.status(500).json(error);
  }
};
