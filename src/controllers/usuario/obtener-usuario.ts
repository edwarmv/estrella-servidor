import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';

export const obtenerUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const usuario = await getRepository(Usuario)
    .findOne(
      id,
      {
        relations: [ 'rolesUsuarios', 'rolesUsuarios.rol' ]
      }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    delete usuario.key;
    delete usuario.salt;

    res.json(usuario);
  } catch(error) {
    res.status(500).json(error);
  }
};
