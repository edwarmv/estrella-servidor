import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'app/entities/usuario';
import jwt from 'jsonwebtoken';
import { TokenVerificacion } from 'app/entities/token-verificacion';
import { localTransporter } from 'app/configuration/transporter';
import { htmlVerificacion } from 'app/configuration/correo-verificacion';

export const reenviarCorreoVerificacion =
  async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const usuario = await getRepository(Usuario).findOne(id);
    if (!usuario) {
      return res.status(404).json({
        mensaje: `No se pudo encontrar al usuario con el id: ${id}.`
      });
    }

    if (usuario.cuentaVerificada) {
      return res.json({ mensaje: 'La cuenta ya se encuentra verificada.' });
    }

    const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

    const token = jwt.sign(
      { id },
      TOKEN_SECRET,
      { expiresIn: 43200 }
    );

    await getRepository(TokenVerificacion).update(id, { token });

    const CLIENT_URL = process.env.CLIENT_URL as string;

    await localTransporter.sendMail({
      from: 'Nodemailer <example@nodemailer.com>',
      to: usuario.correoElectronico,
      subject: 'Verificación de cuenta',
      html: htmlVerificacion(
        `${usuario.nombre} ${usuario.apellido}`,
        `${CLIENT_URL}/verificar-usuario/${token}`
      )
    });

    res.json({
      mensaje: `Un correo de verificación ha sido enviado a \
${usuario.correoElectronico}.`
    });

  } catch(error) {
    res.status(500).json(error);
  }
};
