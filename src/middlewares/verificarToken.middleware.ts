import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../environments/environment';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No se ha proporcionado ningún token.' });
  }

  jwt.verify(token, environment.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'No se ha podido autentificar el token.' });
    }

    if ((decoded as any).exp * 1000 < Date.now()) {
      return res.status(401).json({ error: 'Token expirado, vuelva a iniciar sesión.' });
    }

    next();
  });
};
