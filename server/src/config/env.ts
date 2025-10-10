import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DB_PATH: z.string().min(1).default('./data/database.sqlite'),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  BME280_I2C_ADDRESS: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  BH1750_I2C_ADDRESS: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  GPIO_RELAY_PINS: z
    .string()
    .transform((value) => {
      try {
        return JSON.parse(value) as number[];
      } catch (error) {
        return [] as number[];
      }
    })
    .optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed');
}

export const env = {
  ...parsed.data,
  GPIO_RELAY_PINS: parsed.data.GPIO_RELAY_PINS ?? [],
  BME280_I2C_ADDRESS: parsed.data.BME280_I2C_ADDRESS ?? 0x76,
  BH1750_I2C_ADDRESS: parsed.data.BH1750_I2C_ADDRESS ?? 0x23
};
