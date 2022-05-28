import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Usuario } from 'app/entities/usuario';
import { getRepository } from 'typeorm';

export const actualizarUsuario = async (req: Request, res: Response) => {
  const {
    nombre,
    apellido,
    estado,
  }: Usuario = req.body;

  const id = req.params.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const usuario = new Usuario();
  usuario.nombre = nombre;
  usuario.apellido = apellido;
  usuario.estado = estado;

  try {
    await getRepository(Usuario).update(id, usuario);

    res.json({ mensaje: 'Usuario actualizado' });

  } catch(error) {
    if (error.code === '23505') {
      return res.status(400).json({ mensaje: 'NIT/CI ya registrado' });
    }
    res.status(500).json(error);
  }
};
