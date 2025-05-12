export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null;
export const isArray = Array.isArray;

export const isNotEmpty = (value: string) => value.trim().length > 0;
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isInRange = (value: number, min: number, max: number) => value >= min && value <= max;
export const isValidDate = (date: string) => !isNaN(Date.parse(date));

export const validateEnvironmentReadings = (readings: {
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
}) => (
  isInRange(readings.temperature, -50, 100) &&
  isInRange(readings.humidity, 0, 100) &&
  isInRange(readings.lightLevel, 0, 100) &&
  isInRange(readings.uviLevel, 0, 15)
);