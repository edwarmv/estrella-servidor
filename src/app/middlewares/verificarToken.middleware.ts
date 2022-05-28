import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ mensaje: 'No se ha proporcionado ningún token.' });
  }

  const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ mensaje: 'La sesión ha experado, por favor vuelva a iniciar sesión', tokenExpired: true });
      }
      return res.status(400).json({ mensaje: 'No se pudo autentificar el token.' });
    }

    if ((decoded as any).exp * 1000 < Date.now()) {
      return res.status(401).json({ mensaje: 'Token expirado, vuelva a iniciar sesión.' });
    }

    next();
  });
};
