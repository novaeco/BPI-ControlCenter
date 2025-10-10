import { Setting } from '../models';

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
  const settings = await Setting.findAll({ order: [['key', 'ASC']] });
  return settings.map((setting) => {
    const plain = setting.get({ plain: true });
    return {
      key: plain.key,
      value: parseValue(plain.value),
      updatedAt: (plain.updatedAt ?? plain.createdAt ?? new Date()).toISOString()
    };
  });
};

export const upsertSetting = async (key: string, value: unknown): Promise<SettingResponse> => {
  const serialised = serializeValue(value);
  const [setting, created] = await Setting.findOrCreate({
    where: { key },
    defaults: { key, value: serialised }
  });

  if (!created) {
    setting.value = serialised;
    await setting.save();
  }

  const plain = setting.get({ plain: true });
  return {
    key: plain.key,
    value: parseValue(plain.value),
    updatedAt: (plain.updatedAt ?? plain.createdAt ?? new Date()).toISOString()
  };
};
