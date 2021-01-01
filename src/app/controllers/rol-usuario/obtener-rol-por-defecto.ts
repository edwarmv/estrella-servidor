import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { RolUsuario } from 'app/entities/rol-usuario';

export const obtenerRolPorDefecto = async (req: Request, res: Response) => {
  const idUsuario = req.params.idUsuario;

  try {
    const rolPorDefecto = await getRepository(RolUsuario).findOne(idUsuario);

    if (!rolPorDefecto) {
      return res.status(404).json({ mensaje: 'Rol por defecto no encontrado' });
    }

    res.json(rolPorDefecto);
  } catch(error) {
    res.status(500).json(error);
  }
};
