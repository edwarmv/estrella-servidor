import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'app/entities/cliente';
import { validationResult } from 'express-validator';

export const crearCliente = async (req: Request, res: Response) => {
  const {
    nombre,
    apellido,
    nitCI,
    telefonoFijo,
    telefonoMovil,
    direccionDomicilio,
    coordenadasDireccionDomicilio
  }: Cliente = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json(error.array());
  }

  try {
    await getRepository(Cliente).insert({
      nombre,
      apellido,
      nitCI,
      telefonoFijo,
      telefonoMovil,
      direccionDomicilio,
      coordenadasDireccionDomicilio,
    });

    res.status(201).json({ mensaje: 'Cliente registrado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
