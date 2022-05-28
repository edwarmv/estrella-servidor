import { Request, Response } from 'express';
import { Sucursal } from 'app/entities/sucursal';
import { getRepository } from 'typeorm';
import { CasaMatriz } from 'app/entities/casa-matriz';

export const crearSucursal = async (req: Request, res: Response) => {
  const sucursal: Sucursal = req.body;

  try {
    const casaMatriz = await getRepository(CasaMatriz).findOne(1);

    if (!casaMatriz) {
      return res.status(400).json({
        mensaje: 'No existe registrada una casa matriz',
      });
    }

    const sucursalDB = await getRepository(Sucursal).save({
      nombre: sucursal.nombre,
      ubicacion: sucursal.ubicacion,
      direccion: sucursal.direccion,
      numeroTelefono: sucursal.numeroTelefono,
      estado: sucursal.estado,
      casaMatriz,
    });

    return res.status(201).json({
      mensaje: 'Sucursal registrada correctamente',
      value: sucursalDB,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
