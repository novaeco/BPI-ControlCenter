declare module 'bme280-sensor' {
  interface Bme280Options {
    i2cBusNo?: number;
    i2cAddress?: number;
  }

  interface Bme280Reading {
    temperature_C: number;
    humidity: number;
    pressure_hPa: number;
  }

export default class Bme280 {
  constructor(options?: Bme280Options);
  init(): Promise<void>;
  readSensorData(): Promise<Bme280Reading>;
}
}

declare module 'i2c-bus' {
  export interface PromisifiedBus {
    i2cRead(address: number, length: number, buffer: Buffer): Promise<{ bytesRead: number; buffer: Buffer }>;
    i2cWrite(address: number, length: number, buffer: Buffer): Promise<{ bytesWritten: number; buffer: Buffer }>;
    close(): Promise<void>;
  }

  export function openPromisified(busNumber: number): Promise<PromisifiedBus>;
}
