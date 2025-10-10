import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { add } from 'date-fns';
import { RefreshToken, User } from '../models';
import { env } from '../config/env';
import { HttpError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const ACCESS_TOKEN_TTL_MINUTES = 15;
const REFRESH_TOKEN_TTL_DAYS = 30;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const createAccessToken = (userId: string, role: string): { token: string; expiresIn: number } => {
  const expiresInSeconds = ACCESS_TOKEN_TTL_MINUTES * 60;
  const token = jwt.sign({ role }, env.JWT_ACCESS_SECRET, {
    subject: userId,
    expiresIn: expiresInSeconds
  });
  return { token, expiresIn: expiresInSeconds };
};

const createRefreshToken = async (userId: string): Promise<string> => {
  const expiresAt = add(new Date(), { days: REFRESH_TOKEN_TTL_DAYS });
  const token = jwt.sign({ type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    subject: userId,
    expiresIn: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60
  });
  await RefreshToken.create({
    token,
    userId,
    expiresAt
  });
  return token;
};

export const login = async (email: string, password: string): Promise<TokenPair> => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new HttpError(401, 'Identifiants invalides.');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new HttpError(401, 'Identifiants invalides.');
  }

  const accessToken = createAccessToken(user.id, user.role).token;
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL_MINUTES * 60
  };
};

export const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored) {
      throw new HttpError(401, 'Jeton de rafraîchissement invalide.');
    }
    if (stored.expiresAt < new Date()) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      throw new HttpError(401, 'Jeton de rafraîchissement expiré.');
    }

    const user = payload.sub ? await User.findByPk(payload.sub) : null;
    if (!user) {
      throw new HttpError(401, 'Utilisateur introuvable.');
    }

    const { token: accessToken, expiresIn } = createAccessToken(user.id, user.role);
    const newRefreshToken = await createRefreshToken(user.id);
    await RefreshToken.destroy({ where: { token: refreshToken } });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn
    };
  } catch (error) {
    logger.warn({ err: error }, 'Rafraîchissement de jeton échoué');
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(401, 'Jeton de rafraîchissement invalide ou expiré.', error);
  }
};
