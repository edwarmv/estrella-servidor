import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from 'environments/environment';
import { getRepository } from 'typeorm';
import { TokenVerificacion } from 'entities/token-verificacion';
import { Usuario } from 'entities/usuario';

type Payload = { id: number, iat: number, exp: number };

export const verificarUsuario = (req: Request, res: Response) => {
  const token = req.params.token;

  jwt.verify(token, environment.tokenSecret, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ mensaje: 'Verificar token.' });
    }

    if (decoded) {
      const payload = decoded as Payload;
      if (tokenExpirado(payload)) {
        return res.status(401).json({ error: 'Token expirado. Vuelva a reenviar el correo de confirmación.' });
      }

      try {
        await getRepository(TokenVerificacion).delete((decoded as any).id);
        await getRepository(Usuario).update((decoded as any).id, { cuentaVerificada: true });

        res.json({ mensaje: 'Cuenta verificada.' });

      } catch(error) {
        res.status(500).json(error);
      }
    }
  });
};

const tokenExpirado = (payload: Payload): boolean => {
  return payload.exp * 1000 < Date.now();
};
