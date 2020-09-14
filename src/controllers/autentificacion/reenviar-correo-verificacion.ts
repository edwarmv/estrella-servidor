import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';
import jwt from 'jsonwebtoken';
import { environment } from 'environments/environment';
import { TokenVerificacion } from 'entities/token-verificacion';

export const reenviarCorreoVerificacion = async (req: Request, res: Response) => {
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

      const token = jwt.sign(
        { id },
        environment.tokenSecret,
        { expiresIn: 43200 }
      );

      await getRepository(TokenVerificacion).update(id, { token });

      // transporter.sendMail({
        // from: 'no-reply@adminpro.com',
        // to: usuario.correoElectronico,
        // subject: 'Verificación de cuenta',
        // text: `Hola, Por favor verifica tu cuenta haciendo click en el enlace \
  // ${environment.url}/verificar-usuario/${token}.`
      // }, (err) => {
        // if (err) {
          // return res.status(500).json({
            // error: err.message
          // });
        // }

        // res.json({
          // token,
          // mensaje: `Un correo de verificación ha sido enviado a ${usuario.correoElectronico}.`
        // });
      // });

    res.json({
      token,
      mensaje: `Un correo de verificación ha sido enviado a ${usuario.correoElectronico}.`
    });

  } catch(error) {
    res.status(500).json(error);
  }
};
