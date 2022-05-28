import { Request, Response } from 'express';
import { Caja } from 'app/entities/caja';
import { getRepository } from 'typeorm';

export const crearCaja = async (req: Request, res: Response) => {
  const caja: Caja = req.body;

  try {
    const cajaDB = await getRepository(Caja).save({
      nombre: caja.nombre,
      sucursal: { id: caja.sucursal.id },
    });

    return res.status(201).json({
      mensaje: 'Caja registrada correctamente',
      value: cajaDB,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        mensaje: 'Ya existe una caja con este nombre asingada a esta sucursal',
      });
    }
    return res.status(500).json(error);
  }
};
