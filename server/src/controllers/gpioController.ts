import { Request, Response } from 'express';
import { z } from 'zod';
import { readRelayStates, setRelayState } from '../services/gpioService';

const relayUpdateSchema = z.object({
  value: z.union([z.literal(0), z.literal(1)])
});

const relayPinSchema = z.coerce.number().int().nonnegative();

export const listRelayStates = async (_req: Request, res: Response): Promise<void> => {
  const relays = await readRelayStates();
  res.json({ relays });
};

export const updateRelayStateHandler = async (req: Request, res: Response): Promise<void> => {
  const pin = relayPinSchema.parse(req.params.pin);
  const { value } = relayUpdateSchema.parse(req.body);
  await setRelayState(pin, value);
  res.json({ pin, value });
};
