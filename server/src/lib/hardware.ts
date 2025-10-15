import { spawn } from 'child_process';
import { once } from 'events';
import { env } from '../config/env';
import { CommandExecutionError, runCommand } from '../utils/command';

export interface GpioOptions {
  chip?: string;
  timeoutMs?: number;
}

const ensureNonNegativeInteger = (value: number, label: string): void => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} doit être un entier positif.`);
  }
};

const resolveChip = (options?: GpioOptions): string => options?.chip ?? env.GPIO_CHIP;

export const writeGpioLine = async (line: number, value: 0 | 1, options?: GpioOptions): Promise<void> => {
  ensureNonNegativeInteger(line, 'La ligne GPIO');
  if (value !== 0 && value !== 1) {
    throw new Error('La valeur GPIO doit être 0 ou 1.');
  }
  const chip = resolveChip(options);
  await runCommand('gpioset', ['--mode=exit', chip, `${line}=${value}`], {
    timeoutMs: options?.timeoutMs
  });
};

export const readGpioLine = async (line: number, options?: GpioOptions): Promise<0 | 1> => {
  ensureNonNegativeInteger(line, 'La ligne GPIO');
  const chip = resolveChip(options);
  const { stdout } = await runCommand('gpioget', [chip, String(line)], {
    timeoutMs: options?.timeoutMs
  });
  const trimmed = stdout.trim();
  if (!/^[01]$/.test(trimmed)) {
    throw new Error(`Valeur de GPIO inattendue: "${trimmed}".`);
  }
  return Number(trimmed) as 0 | 1;
};

export interface I2cCommandOptions {
  bus?: number;
  timeoutMs?: number;
}

const resolveBus = (options?: I2cCommandOptions): number => options?.bus ?? env.I2C_BUS;

const hex = (value: number): string => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Les valeurs I²C doivent être des entiers positifs.');
  }
  return `0x${value.toString(16)}`;
};

export const i2cWriteByte = async (
  address: number,
  register: number,
  value: number,
  options?: I2cCommandOptions
): Promise<void> => {
  const bus = resolveBus(options);
  await runCommand(
    'i2cset',
    ['-y', String(bus), hex(address), hex(register), hex(value)],
    { timeoutMs: options?.timeoutMs }
  );
};

export const i2cSendByte = async (address: number, value: number, options?: I2cCommandOptions): Promise<void> => {
  const bus = resolveBus(options);
  await runCommand('i2cset', ['-y', String(bus), hex(address), hex(value)], {
    timeoutMs: options?.timeoutMs
  });
};

export const i2cReadByte = async (
  address: number,
  register: number,
  options?: I2cCommandOptions
): Promise<number> => {
  const bus = resolveBus(options);
  const { stdout } = await runCommand('i2cget', ['-y', String(bus), hex(address), hex(register)], {
    timeoutMs: options?.timeoutMs
  });
  const parsed = Number.parseInt(stdout, 16);
  if (Number.isNaN(parsed)) {
    throw new Error(`Lecture I²C invalide: ${stdout}`);
  }
  return parsed;
};

export const i2cReadByteDirect = async (address: number, options?: I2cCommandOptions): Promise<number> => {
  const bus = resolveBus(options);
  const { stdout } = await runCommand('i2cget', ['-y', String(bus), hex(address)], {
    timeoutMs: options?.timeoutMs
  });
  const parsed = Number.parseInt(stdout, 16);
  if (Number.isNaN(parsed)) {
    throw new Error(`Lecture I²C directe invalide: ${stdout}`);
  }
  return parsed;
};

export const i2cReadWord = async (address: number, options?: I2cCommandOptions): Promise<number> => {
  const high = await i2cReadByteDirect(address, options);
  const low = await i2cReadByteDirect(address, options);
  return (high << 8) | low;
};

export const i2cReadBytes = async (
  address: number,
  register: number,
  length: number,
  options?: I2cCommandOptions
): Promise<Uint8Array> => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('La longueur de lecture I²C doit être un entier positif.');
  }
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    bytes[index] = await i2cReadByte(address, register + index, options);
  }
  return bytes;
};

export interface SerialOptions {
  baudRate?: number;
  timeoutMs?: number;
  raw?: boolean;
}

const ensureDevicePath = (device: string): void => {
  if (!device.startsWith('/dev/')) {
    throw new Error(`Le périphérique série doit se trouver sous /dev (reçu: ${device}).`);
  }
};

export const configureSerialPort = async (device: string, options: SerialOptions = {}): Promise<void> => {
  ensureDevicePath(device);
  const args: string[] = ['-F', device];
  if (options.baudRate) {
    ensureNonNegativeInteger(options.baudRate, 'La vitesse');
    args.push(String(options.baudRate));
  }
  args.push('cs8', '-cstopb', '-parenb');
  if (options.raw !== false) {
    args.push('-echo', 'raw');
  }
  await runCommand('stty', args, { timeoutMs: options.timeoutMs });
};

export const writeSerial = async (
  device: string,
  data: string | Buffer,
  options: SerialOptions = {}
): Promise<void> => {
  ensureDevicePath(device);
  const process = spawn('tee', [device], { stdio: ['pipe', 'ignore', 'pipe'] });
  let timeout: NodeJS.Timeout | undefined;
  const timeoutMs = options.timeoutMs ?? env.COMMAND_TIMEOUT_MS;
  if (timeoutMs > 0) {
    timeout = setTimeout(() => {
      process.kill('SIGKILL');
    }, timeoutMs);
  }
  process.stdin.write(data);
  process.stdin.end();
  const [code] = (await once(process, 'close')) as [number | null];
  if (timeout) {
    clearTimeout(timeout);
  }
  if (code !== 0) {
    const stderr = (process.stderr?.read() as Buffer | null)?.toString('utf8');
    throw new CommandExecutionError(`Écriture série échouée sur ${device}`, 'tee', [device], {
      exitCode: code ?? undefined,
      stderr: stderr ?? undefined
    });
  }
};

export const readSerial = async (device: string, options: SerialOptions = {}): Promise<string> => {
  ensureDevicePath(device);
  const { stdout } = await runCommand('cat', [device], { timeoutMs: options.timeoutMs });
  return stdout;
};
