import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, token requerido' });
  }

  const token = authHeader.split(' ')[1];

  const { valid, expired, decoded } = verifyJwt(token);

  if (expired) {
    return res.status(401).json({ error: 'Token expirado' });
  }

  if (!valid || !decoded) {
    return res.status(401).json({ error: 'Fallo al autenticar token' });
  }

  // Inject user info into res.locals
  res.locals.user = decoded;

  return next();
};
