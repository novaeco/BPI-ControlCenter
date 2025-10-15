import { config } from 'dotenv';
import { z } from 'zod';

config();

const booleanFromEnv = (value: unknown, defaultValue = false): boolean => {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  const normalized = String(value).toLowerCase().trim();
  return ['1', 'true', 'yes', 'y', 'on'].includes(normalized);
};

const jsonArrayFromEnv = (value: unknown): number[] => {
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
  }
  if (typeof value !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item));
  } catch (error) {
    return [];
  }
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  DB_ENGINE: z.enum(['postgres', 'sqljs']).default('postgres'),
  PG_HOST: z.string().trim().default('127.0.0.1'),
  PG_PORT: z.coerce.number().default(5432),
  PG_USER: z.string().trim().default('bpi_control'),
  PG_PASSWORD: z.string().trim().default('bpi_control'),
  PG_DATABASE: z.string().trim().default('bpi_control'),
  PG_SSL: z.string().optional(),
  PG_SSL_REJECT_UNAUTHORIZED: z.string().optional(),
  PG_IN_MEMORY: z.string().optional(),
  SQLJS_PATH: z.string().trim().optional(),
  SQLJS_PERSISTENCE_PATH: z.string().trim().optional(),
  COMMAND_TIMEOUT_MS: z.coerce.number().default(5000),
  I2C_BUS: z.coerce.number().default(1),
  BME280_I2C_ADDRESS: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  BH1750_I2C_ADDRESS: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  GPIO_RELAY_PINS: z.string().optional(),
  GPIO_CHIP: z.string().trim().default('gpiochip0')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed');
}

export const env = {
  ...parsed.data,
  COMMAND_TIMEOUT_MS: Math.max(parsed.data.COMMAND_TIMEOUT_MS, 1000),
  PG_SSL: booleanFromEnv(parsed.data.PG_SSL),
  PG_SSL_REJECT_UNAUTHORIZED: booleanFromEnv(parsed.data.PG_SSL_REJECT_UNAUTHORIZED, true),
  PG_IN_MEMORY: booleanFromEnv(parsed.data.PG_IN_MEMORY),
  GPIO_RELAY_PINS: jsonArrayFromEnv(parsed.data.GPIO_RELAY_PINS),
  BME280_I2C_ADDRESS: parsed.data.BME280_I2C_ADDRESS ?? 0x76,
  BH1750_I2C_ADDRESS: parsed.data.BH1750_I2C_ADDRESS ?? 0x23
};
