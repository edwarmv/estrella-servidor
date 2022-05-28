import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Caja } from 'app/entities/caja';

export const obtenerCaja = async (req: Request, res: Response) => {
  const idCaja = req.params.idCaja;

  try {
    const caja = await getRepository(Caja).findOne(idCaja, {
      relations: ['sucursal'],
    });

    return res.json({ value: caja });
  } catch (error) {
    return res.status(500).json(error);
  }
};
