import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Caja } from 'app/entities/caja';

export const actualizarCaja = async (req: Request, res: Response) => {
  const idCaja = req.params.idCaja;
  const caja = req.body;

  try {
    const cajaDB = await getRepository(Caja).save({
      id: Number(idCaja),
      nombre: caja.nombre,
      sucursal: { id: caja.sucursal.id },
    });

    return res.json({
      mensaje: 'Caja actualizada correctamente',
      value: cajaDB,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
