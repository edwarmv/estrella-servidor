import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Sucursal } from 'app/entities/sucursal';

export const actualizarSucursal = async (req: Request, res: Response) => {
  const idSucursal = req.params.idSucursal;
  const sucursal: Sucursal = req.body;

  try {
    await getRepository(Sucursal).update(idSucursal, {
      nombre: sucursal.nombre,
      ubicacion: sucursal.ubicacion,
      direccion: sucursal.direccion,
      numeroTelefono: sucursal.numeroTelefono,
      estado: sucursal.estado,
    });

    return res.json({
      mensaje: 'Sucursal actualizada correctamente',
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
