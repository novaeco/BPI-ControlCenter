import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    throw new HttpError(401, 'Jeton d\'authentification manquant.');
  }

  const [, token] = header.split(' ');
  if (!token) {
    throw new HttpError(401, 'Format de jeton invalide.');
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    throw new HttpError(401, 'Jeton invalide ou expiré.', error);
  }
};
