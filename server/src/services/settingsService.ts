import { prisma } from './prisma';

export type SettingResponse = {
  key: string;
  value: unknown;
  updatedAt: string;
};

const serializeValue = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return JSON.stringify({ error: 'serialization_failed', reason: String(error) });
  }
};

const parseValue = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const getSettings = async (): Promise<SettingResponse[]> => {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  return settings.map((setting) => ({
    key: setting.key,
    value: parseValue(setting.value),
    updatedAt: setting.updatedAt.toISOString()
  }));
};

export const upsertSetting = async (key: string, value: unknown): Promise<SettingResponse> => {
  const serialised = serializeValue(value);
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value: serialised },
    create: { key, value: serialised }
  });
  return {
    key: setting.key,
    value: parseValue(setting.value),
    updatedAt: setting.updatedAt.toISOString()
  };
};
