import { env } from '../config/env';
import { SensorReading } from '../models';
import { logger } from '../utils/logger';
import { readRelayStates } from './gpioService';
import { SENSOR_TYPES, SensorType, type SensorValueDto } from '../../../shared/sensors';
import { i2cReadByte, i2cReadByteDirect, i2cReadBytes, i2cSendByte, i2cWriteByte } from '../lib/hardware';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

interface Bme280Calibration {
  digT1: number;
  digT2: number;
  digT3: number;
  digH1: number;
  digH2: number;
  digH3: number;
  digH4: number;
  digH5: number;
  digH6: number;
}

class Bme280Driver {
  private calibration: Bme280Calibration | null = null;

  constructor(private readonly address: number, private readonly bus: number) {}

  public async init(): Promise<void> {
    try {
      await i2cWriteByte(this.address, 0xe0, 0xb6, { bus: this.bus });
      await delay(10);
      this.calibration = await this.loadCalibration();
      await i2cWriteByte(this.address, 0xf2, 0x01, { bus: this.bus });
      await i2cWriteByte(this.address, 0xf4, 0x27, { bus: this.bus });
      await i2cWriteByte(this.address, 0xf5, 0xa0, { bus: this.bus });
      logger.info('BME280 initialisé via i2c-tools');
    } catch (error) {
      this.calibration = null;
      logger.warn({ err: error }, "Impossible d'initialiser le BME280.");
    }
  }

  private async loadCalibration(): Promise<Bme280Calibration> {
    const buf1 = await i2cReadBytes(this.address, 0x88, 24, { bus: this.bus });
    const h1 = await i2cReadByte(this.address, 0xa1, { bus: this.bus });
    const buf2 = await i2cReadBytes(this.address, 0xe1, 7, { bus: this.bus });

    const u16 = (buffer: Uint8Array, offset: number): number => buffer[offset] | (buffer[offset + 1] << 8);
    const s16 = (buffer: Uint8Array, offset: number): number => {
      const value = u16(buffer, offset);
      return value > 0x7fff ? value - 0x10000 : value;
    };

    const digH4 = (buf2[3] << 4) | (buf2[4] & 0x0f);
    const digH5 = (buf2[5] << 4) | (buf2[4] >> 4);

    return {
      digT1: u16(buf1, 0),
      digT2: s16(buf1, 2),
      digT3: s16(buf1, 4),
      digH1: h1,
      digH2: s16(buf2, 0),
      digH3: buf2[2],
      digH4: digH4 > 0x7ff ? digH4 - 0x1000 : digH4,
      digH5: digH5 > 0x7ff ? digH5 - 0x1000 : digH5,
      digH6: buf2[6] > 0x7f ? buf2[6] - 0x100 : buf2[6]
    };
  }

  public async read(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    if (!this.calibration) {
      return [];
    }

    try {
      await i2cWriteByte(this.address, 0xf4, 0x27, { bus: this.bus });
      await delay(100);
      const data = await i2cReadBytes(this.address, 0xf7, 8, { bus: this.bus });

      const rawTemp = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
      const rawHum = (data[6] << 8) | data[7];

      const cal = this.calibration;
      const var1 = (rawTemp / 16384 - cal.digT1 / 1024) * cal.digT2;
      const var2 = ((rawTemp / 131072 - cal.digT1 / 8192) * (rawTemp / 131072 - cal.digT1 / 8192)) * cal.digT3;
      const tFine = var1 + var2;
      const temperature = Number(((tFine / 5120)).toFixed(2));

      let varH = tFine - 76800;
      varH = (rawHum - (cal.digH4 * 64 + (cal.digH5 / 16384) * varH)) * (cal.digH2 / 65536);
      varH =
        varH *
        (1 + (cal.digH3 / 67108864) * varH * (1 + (cal.digH6 / 67108864) * varH));
      const humidity = Math.max(0, Math.min(100, varH));

      return [
        { type: SENSOR_TYPES.TEMPERATURE, value: temperature, unit: '°C' },
        { type: SENSOR_TYPES.HUMIDITY, value: Number(humidity.toFixed(2)), unit: '%' }
      ];
    } catch (error) {
      logger.error({ err: error }, 'Lecture BME280 échouée');
      return [];
    }
  }
}

class Bh1750Driver {
  constructor(private readonly address: number, private readonly bus: number) {}

  public async read(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    try {
      await i2cSendByte(this.address, 0x01, { bus: this.bus });
      await i2cSendByte(this.address, 0x10, { bus: this.bus });
      await delay(180);
      const high = await i2cReadByteDirect(this.address, { bus: this.bus });
      const low = await i2cReadByteDirect(this.address, { bus: this.bus });
      const raw = (high << 8) | low;
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

class SensorHardware {
  private readonly bme280 = new Bme280Driver(env.BME280_I2C_ADDRESS, env.I2C_BUS);

  private readonly bh1750 = new Bh1750Driver(env.BH1750_I2C_ADDRESS, env.I2C_BUS);

  public async init(): Promise<void> {
    await this.bme280.init();
  }

  public async readTemperatureHumidity(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    return this.bme280.read();
  }

  public async readLight(): Promise<Array<{ type: SensorType; value: number; unit: string }>> {
    return this.bh1750.read();
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
        SensorReading.create({
          sensorType: value.type,
          value: value.value,
          unit: value.unit,
          capturedAt: new Date(timestamp)
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
    const fallback = await SensorReading.findAll({
      order: [['capturedAt', 'DESC']],
      limit: 4
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
    const uvReading = await SensorReading.findOne({
      where: { sensorType: SENSOR_TYPES.UV },
      order: [['capturedAt', 'DESC']]
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
