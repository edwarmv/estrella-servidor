import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RolUsuario } from 'entities/rol-usuario';
import { getRepository } from 'typeorm';

type RolUsuarioBody = { idUsuario: string, idRol: string };

export const actualizarRolUsuario = async (req: Request, res: Response) => {
  const _idUsuario = req.params.idUsuario;
  const _idRol = req.params.idRol;

  const { idUsuario, idRol }: RolUsuarioBody = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await getRepository(RolUsuario).update(
      {
        rol: {
          id: parseInt(_idRol, 10)
        },
        usuario: {
          id: parseInt(_idUsuario, 10)
        }
      }, {
        rol: { id: parseInt(idRol, 10) },
        usuario: { id: parseInt(idUsuario, 10) }
      });

    res.status(201).json({ mensaje: 'Modificado correctamente' });

  } catch(error) {
    res.status(500).json(error);
  }
};
