import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Menu } from 'app/entities/menu';

export const crearMenu = async (req: Request, res: Response) => {
  const { nombre, path }: Menu = req.body;

  try {
    await getRepository(Menu).save({ nombre, path });

    res.status(201).json({ mensaje: 'Menú creado correctamente'});
  } catch(error) {
    res.status(500).json(error);
  }
};
