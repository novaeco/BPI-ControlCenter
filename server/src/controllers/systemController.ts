import { Request, Response } from 'express';
import { getSystemInfo } from '../services/systemService';

export const systemInfo = async (_req: Request, res: Response): Promise<void> => {
  const info = await getSystemInfo();
  res.json(info);
};
