import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
export class TokenUtil {
  constructor() {}

  getTokenPayload(req: Request): JwtPayload {
    const payload = jwt.decode(
      req.headers.authorization?.split(' ')[1]!
    ) as JwtPayload;
    return payload;
  }
}
