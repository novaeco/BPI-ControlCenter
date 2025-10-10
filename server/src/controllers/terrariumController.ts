import { Request, Response } from 'express';
import { z } from 'zod';
import { createTerrarium, deleteTerrarium, getTerrarium, listTerrariums, TerrariumInput, updateTerrarium } from '../services/terrariumService';

const terrariumSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  isActive: z.boolean(),
  temperature: z.number(),
  humidity: z.number(),
  lightLevel: z.number(),
  uviLevel: z.number()
});

const parsePayload = (req: Request): TerrariumInput => {
  const payload = terrariumSchema.parse(req.body);
  return {
    ...payload,
    description: payload.description ?? null
  };
};

export const listTerrariumHandler = async (_req: Request, res: Response): Promise<void> => {
  const terrariums = await listTerrariums();
  res.json(terrariums);
};

export const getTerrariumHandler = async (req: Request, res: Response): Promise<void> => {
  const terrarium = await getTerrarium(req.params.id);
  res.json(terrarium);
};

export const createTerrariumHandler = async (req: Request, res: Response): Promise<void> => {
  const data = parsePayload(req);
  const terrarium = await createTerrarium(data);
  res.status(201).json(terrarium);
};

export const updateTerrariumHandler = async (req: Request, res: Response): Promise<void> => {
  const data = parsePayload(req);
  const terrarium = await updateTerrarium(req.params.id, data);
  res.json(terrarium);
};

export const deleteTerrariumHandler = async (req: Request, res: Response): Promise<void> => {
  await deleteTerrarium(req.params.id);
  res.status(204).send();
};
