import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';

export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const usuario = await getRepository(Usuario).findOne(id);

    await getRepository(Usuario).update(id, { estado: !usuario?.estado });

    res.json({ mensaje: 'Se ha cambiar el estado exitosamente' });
  } catch(error) {
    res.status(500).json(error);
  }
};
