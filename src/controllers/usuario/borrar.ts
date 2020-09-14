import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TokenVerificacion } from 'entities/token-verificacion';
import { Usuario } from 'entities/usuario';

export const borrarUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await getRepository(Usuario).delete(id);
    await getRepository(TokenVerificacion).delete(id);

    res.json({ mensaje: 'Usuario eliminado.' });
  } catch(error) {
    res.status(500).json(error);
  }
};
