import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';
import jwt from 'jsonwebtoken';
import { RolUsuario } from 'entities/rol-usuario';

type IniciarSesionBody = { correoElectronico: string, password: string };

export const iniciarSesion = async (req: Request, res: Response) => {
  const { correoElectronico, password }: IniciarSesionBody = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const usuario = await getRepository(Usuario)
    .findOne({ correoElectronico });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // if (!usuario.cuentaVerificada) {
      // return res.status(401).json({ error: 'Cuenta no verificada.' });
    // }

    if (!usuario.verificarPassword(password)) {
      return res.status(400).json({ error: 'correo electrónico o contraseña incorrecto.' });
    }

    const rolesUsuario: RolUsuario[] = await getRepository(RolUsuario)
    .find({ usuario: { id: usuario.id } });

    const tiempo = 60 * 60 * 12; // 12hr
    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
    const token = jwt.sign(
      {
        roles: rolesUsuario
      },
      TOKEN_SECRET,
      {
        expiresIn: tiempo,
        subject: usuario.id.toString()
      }
    );

    delete usuario.key;
    delete usuario.salt;
    delete usuario.cuentaVerificada;

    // en caso de que el usuario no tenga un rol asignado
    // if (!usuario.rolesUsuarios[0].rol) {
      // usuario.rolesUsuarios = [];
    // }

    res.json(token);

  } catch(error) {
    res.status(500).json(error);
  }
};
