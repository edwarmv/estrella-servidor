import { Request, Response } from 'express';
import { RolUsuario } from 'app/entities/rol-usuario';
import { getRepository } from 'typeorm';

export const borrarRolUsuario = async (req: Request, res: Response) => {
  const idRol = req.params.idRol;
  const idUsuario = req.params.idUsuario;

  try {
    await getRepository(RolUsuario).delete({
      rol: { id: parseInt(idRol, 10) },
      usuario: { id: parseInt(idUsuario, 10) }
    });

    res.json({ mensaje: 'Eliminado correctamente' });

  } catch(error) {
    res.status(500).json(error);
  }
};
