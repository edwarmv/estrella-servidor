import { Request, Response } from 'express';
import { CasaMatriz } from 'app/entities/casa-matriz';
import { getRepository } from 'typeorm';

export const actualizarCasaMatriz = async (req: Request, res: Response) => {
  const id = 1;
  const casaMatriz: CasaMatriz = req.body;

  try {
    await getRepository(CasaMatriz).update(id, casaMatriz);

    res.json({ mensaje: 'Actualizado correctamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
