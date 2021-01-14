import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CasaMatriz } from 'app/entities/casa-matriz';

export const obtenerCasaMatriz = async (req: Request, res: Response) => {
  const id = 1;

  try {
    const casaMatriz = await getRepository(CasaMatriz).findOne(id);

    if (!casaMatriz) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    res.json(casaMatriz);
  } catch(error) {
    res.status(500).json(error);
  }
};
