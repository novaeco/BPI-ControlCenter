import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as command from '../src/utils/command';
import { i2cReadBytes, i2cSendByte, readGpioLine, writeGpioLine } from '../src/lib/hardware';

vi.mock('../src/utils/command', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/command')>();
  return {
    ...actual,
    runCommand: vi.fn()
  };
});

const runCommandMock = command.runCommand as unknown as vi.Mock;

describe('hardware command wrappers', () => {
  beforeEach(() => {
    runCommandMock.mockReset();
  });

  it('écrit une ligne GPIO', async () => {
    runCommandMock.mockResolvedValue({ stdout: '', stderr: '' });
    await writeGpioLine(4, 1);
    expect(runCommandMock).toHaveBeenCalledWith('gpioset', ['--mode=exit', 'gpiochip0', '4=1'], expect.any(Object));
  });

  it('lit une ligne GPIO', async () => {
    runCommandMock.mockResolvedValue({ stdout: '1\n', stderr: '' });
    const value = await readGpioLine(7);
    expect(value).toBe(1);
    expect(runCommandMock).toHaveBeenCalledWith('gpioget', ['gpiochip0', '7'], expect.any(Object));
  });

  it('écrit un octet I2C direct', async () => {
    runCommandMock.mockResolvedValue({ stdout: '', stderr: '' });
    await i2cSendByte(0x23, 0x10, { bus: 2 });
    expect(runCommandMock).toHaveBeenCalledWith('i2cset', ['-y', '2', '0x23', '0x10'], expect.any(Object));
  });

  it('lit un bloc I2C', async () => {
    runCommandMock.mockResolvedValueOnce({ stdout: '0x10', stderr: '' });
    runCommandMock.mockResolvedValueOnce({ stdout: '0x11', stderr: '' });
    runCommandMock.mockResolvedValueOnce({ stdout: '0x12', stderr: '' });
    const buffer = await i2cReadBytes(0x76, 0xf7, 3);
    expect([...buffer]).toEqual([0x10, 0x11, 0x12]);
    expect(runCommandMock).toHaveBeenNthCalledWith(1, 'i2cget', ['-y', '1', '0x76', '0xf7'], expect.any(Object));
  });
});
