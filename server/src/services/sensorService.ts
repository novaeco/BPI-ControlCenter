import type { PromisifiedBus } from 'i2c-bus';
import { openPromisified } from 'i2c-bus';
import Bme280 from 'bme280-sensor';
import { env } from '../config/env';
import { prisma } from './prisma';
import { logger } from '../utils/logger';
import { readRelayStates } from './gpioService';

export const SENSOR_TYPES = {
  TEMPERATURE: 'TEMPERATURE',
  HUMIDITY: 'HUMIDITY',
  LIGHT: 'LIGHT',
  UV: 'UV',
  RELAY: 'RELAY'
} as const;

export type SensorType = (typeof SENSOR_TYPES)[keyof typeof SENSOR_TYPES];

export interface SensorValueDto {
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  label?: string;
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

class SensorHardware {
  private bus: PromisifiedBus | null = null;
  private bme280: Bme280 | null = null;

  private async getBus(): Promise<PromisifiedBus> {
    if (!this.bus) {
      this.bus = await openPromisified(1);
    }
    return this.bus;
  }

  public async init(): Promise<void> {
    try {
      this.bme280 = new Bme280({ i2cAddress: env.BME280_I2C_ADDRESS });
      await this.bme280.init();
      logger.info('BME280 initialisé');
    } catch (error) {
      logger.warn({ err: error }, "Impossible d'initialiser le BME280. Lecture logicielle uniquement.");
      this.bme280 = null;
    }
  }

  public async readTemperatureHumidity(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    if (!this.bme280) {
      return [];
    }
    try {
      const data = await this.bme280.readSensorData();
      return [
        { type: SENSOR_TYPES.TEMPERATURE, value: Number(data.temperature_C.toFixed(2)), unit: '°C' },
        { type: SENSOR_TYPES.HUMIDITY, value: Number(data.humidity.toFixed(2)), unit: '%' }
      ];
    } catch (error) {
      logger.error({ err: error }, 'Lecture BME280 échouée');
      return [];
    }
  }

  public async readLight(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    try {
      const bus = await this.getBus();
      const address = env.BH1750_I2C_ADDRESS;
      const buffer = Buffer.alloc(2);
      await bus.i2cWrite(address, 1, Buffer.from([0x01])); // power on
      await bus.i2cWrite(address, 1, Buffer.from([0x10])); // continuous high-res mode
      await delay(180);
      await bus.i2cRead(address, 2, buffer);
      const raw = (buffer[0] << 8) | buffer[1];
      if (raw === 0xffff) {
        throw new Error('BH1750 valeur saturée');
      }
      const lux = Number((raw / 1.2).toFixed(2));
      return [{ type: SENSOR_TYPES.LIGHT, value: lux, unit: 'lux' }];
    } catch (error) {
      logger.warn({ err: error }, 'Lecture BH1750 échouée');
      return [];
    }
  }
}

const hardware = new SensorHardware();
hardware.init().catch((error) => logger.error({ err: error }, 'Initialisation capteurs échouée'));

export const readSensors = async (): Promise<SensorValueDto[]> => {
  const readings: SensorValueDto[] = [];
  const timestamp = new Date().toISOString();

  const hardwareValues = [
    ...(await hardware.readTemperatureHumidity()),
    ...(await hardware.readLight())
  ];

  const relayStates = await readRelayStates();
  if (relayStates.length > 0) {
    readings.push(
      ...relayStates.map((relay) => ({
        sensorType: SENSOR_TYPES.RELAY,
        value: relay.value,
        unit: 'state',
        timestamp,
        label: `Relais GPIO${relay.pin}`
      }))
    );
  }

  if (hardwareValues.length > 0) {
    await Promise.all(
      hardwareValues.map((value) =>
        prisma.sensorReading.create({
          data: {
            sensorType: value.type,
            value: value.value,
            unit: value.unit,
            capturedAt: new Date(timestamp)
          }
        })
      )
    );

    readings.push(
      ...hardwareValues.map((value) => ({
        sensorType: value.type,
        value: value.value,
        unit: value.unit,
        timestamp
      }))
    );
  }

  if (readings.length === 0) {
    const fallback = await prisma.sensorReading.findMany({
      orderBy: { capturedAt: 'desc' },
      take: 4
    });

    readings.push(
      ...fallback.map((value) => ({
        sensorType: value.sensorType as SensorType,
        value: value.value,
        unit: value.unit,
        timestamp: value.capturedAt.toISOString()
      }))
    );
  }

  if (!readings.some((reading) => reading.sensorType === SENSOR_TYPES.UV)) {
    const uvReading = await prisma.sensorReading.findFirst({
      where: { sensorType: SENSOR_TYPES.UV },
      orderBy: { capturedAt: 'desc' }
    });
    if (uvReading) {
      readings.push({
        sensorType: SENSOR_TYPES.UV,
        value: uvReading.value,
        unit: uvReading.unit,
        timestamp: uvReading.capturedAt.toISOString()
      });
    }
  }

  return readings;
};
