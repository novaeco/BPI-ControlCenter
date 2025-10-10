import { Request, Response } from 'express';
import { z } from 'zod';
import { getSettings, upsertSetting } from '../services/settingsService';

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.any()
});

export const listSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getSettings();
  res.json(settings);
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  const { key, value } = settingSchema.parse(req.body);
  const setting = await upsertSetting(key, value);
  res.json(setting);
};
