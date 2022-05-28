import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Sucursal } from 'app/entities/sucursal';

export const obtenerSucursal = async (req: Request, res: Response) => {
  const idSucursal = req.params.idSucursal;

  try {
    const sucursal = await getRepository(Sucursal).findOne(idSucursal);

    return res.json({
      value: sucursal,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
