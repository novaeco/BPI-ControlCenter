export enum SensorType {
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITY = 'HUMIDITY',
  LIGHT = 'LIGHT',
  UV = 'UV',
  RELAY = 'RELAY'
}

export const SENSOR_TYPES = Object.freeze({
  TEMPERATURE: SensorType.TEMPERATURE,
  HUMIDITY: SensorType.HUMIDITY,
  LIGHT: SensorType.LIGHT,
  UV: SensorType.UV,
  RELAY: SensorType.RELAY
});

export interface SensorValue {
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  label?: string;
}

export type SensorValueDto = SensorValue;
