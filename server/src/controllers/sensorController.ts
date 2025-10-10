import { Request, Response } from 'express';
import { readSensors } from '../services/sensorService';

export const getSensors = async (_req: Request, res: Response): Promise<void> => {
  const sensors = await readSensors();
  res.json(sensors);
};
