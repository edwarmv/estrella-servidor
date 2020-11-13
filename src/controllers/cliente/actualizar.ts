import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cliente } from 'entities/cliente';
import { validationResult } from 'express-validator';
import { Body } from './crear';


export const actualizarCliente = async (req: Request, res: Response) => {
  const id = req.params.id;

  const {
    nombre,
    apellido,
    nitCI,
    telefonoFijo,
    telefonoMovil,
    direccionDomicilio,
    coordenadasDireccionDomicilio
  }: Body = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json(error.array());
  }

  try {
    await getRepository(Cliente).update(id, {
      nombre,
      apellido,
      nitCI,
      telefonoFijo,
      telefonoMovil,
      direccionDomicilio,
      coordenadasDireccionDomicilio,
    });

    res.status(201).json({ mensaje: 'Cliente actualizado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
