import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Usuario } from 'entities/usuario';
import { getRepository } from 'typeorm';

type UsuarioBody = {
  nombre: string,
  apellido: string,
  nitCI: string,
  telefonoFijo: string,
  telefonoMovil: string,
  direccionDomicilio: string,
  coordenadasDireccionDomicilio: string
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  const {
    nombre,
    apellido,
    nitCI,
    telefonoFijo,
    telefonoMovil,
    direccionDomicilio,
    coordenadasDireccionDomicilio
  }: UsuarioBody = req.body;

  const id = req.params.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const usuario = new Usuario();
  usuario.nombre = nombre;
  usuario.apellido = apellido;
  usuario.nitCI = nitCI;
  usuario.telefonoFijo = telefonoFijo;
  usuario.telefonoMovil = telefonoMovil;
  usuario.direccionDomicilio = direccionDomicilio;
  usuario.coordenadasDireccionDomicilio = coordenadasDireccionDomicilio;

  // eliminarPropiedadesUndefined(usuario);

  try {
    await getRepository(Usuario).update(id, usuario);

    const usuarioActualizado = await getRepository(Usuario).findOne(id);

    if (usuarioActualizado) {
      usuarioActualizado.key = '';
      usuarioActualizado.salt = '';
    }

    res.json(usuarioActualizado);

  } catch(error) {
    res.status(500).json(error);
  }
};

// const eliminarPropiedadesUndefined = (usuario: Usuario): Usuario => {
  // Object.keys(usuario)
  // .forEach(key => usuario[key] === undefined && delete usuario[key]);

  // return usuario;
// };
