import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'app/entities/usuario';

export const obtenerUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const usuario = await getRepository(Usuario)
    .findOne(id, { relations: ['rolesUsuarios', 'rolesUsuarios.rol'] });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (usuario.rolesUsuarios.length === 1) {
      usuario.rolesUsuarios = usuario.rolesUsuarios[0].rol ?
        usuario.rolesUsuarios : [];
    }

    res.json(usuario);
  } catch(error) {
    if (error.code === '22P02') {
      return res.status(400).json({ mensaje: 'ID inválida' });
    }
    res.status(500).json(error);
  }
};
