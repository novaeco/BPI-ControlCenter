import { Request, Response } from 'express';
import { z } from 'zod';
import { login, refreshTokens } from '../services/authService';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = loginSchema.parse(req.body);
  const tokens = await login(email, password);
  res.json(tokens);
};

export const refreshHandler = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = refreshSchema.parse(req.body);
  const tokens = await refreshTokens(refreshToken);
  res.json(tokens);
};
