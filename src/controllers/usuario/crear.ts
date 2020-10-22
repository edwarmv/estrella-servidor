import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { getRepository, QueryFailedError } from 'typeorm';
import { TokenVerificacion } from 'entities/token-verificacion';
import { Usuario } from 'entities/usuario';
import { localTransporter } from 'configuration/transporter';
import { htmlVerificacion } from 'configuration/correo-verificacion';

type UsuarioBody = {
  nombres: string,
  apellidos: string,
  correoElectronico: string,
  password: string
};

export const crearUsuario = async (req: Request, res: Response) => {
  const {
    nombres,
    apellidos,
    correoElectronico,
    password
  }: UsuarioBody = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const usuario = new Usuario();
    usuario.nombres = nombres;
    usuario.apellidos = apellidos;
    usuario.correoElectronico = correoElectronico.toLowerCase();
    usuario.setPassword(password);

    const nuevoUsuario = await getRepository(Usuario).save(usuario);
    nuevoUsuario.key = '';
    nuevoUsuario.salt = '';

    const tokenVerificacion = new TokenVerificacion();
    tokenVerificacion.usuario = nuevoUsuario;
    const medioDia = 60 * 60 * 12; // medio día
    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
    tokenVerificacion.token = jwt.sign(
      { id: nuevoUsuario.id },
      TOKEN_SECRET,
      { expiresIn: medioDia }
    );

    await getRepository(TokenVerificacion).insert(tokenVerificacion);

    const CLIENT_URL = process.env.CLIENT_URL as string;

    await localTransporter.sendMail({
      from: 'Nodemailer <example@nodemailer.com>',
      to: 'Nodemailer <example@nodemailer.com>',
      subject: 'Verificación de cuenta',
      html: htmlVerificacion(
        `${usuario.nombres} ${usuario.apellidos}`,
        `${CLIENT_URL}/verificar-usuario/${tokenVerificacion.token}`
      )
    });

    res.status(201).json({
      token: tokenVerificacion.token,
      mensaje:
        `Un correo de verificación ha sido enviado a ${correoElectronico}.`
    });

  } catch(error) {
    if (error instanceof QueryFailedError) {
      if (( error as any ).code === "23505") {
        res.status(400).json({
          mensaje:
            `El correo electrónico ${correoElectronico} ya está registrado`
        });
      }
    } else {
      res.status(500).json(error);
    }
  }

};
