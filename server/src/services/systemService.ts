import { promises as fs } from 'fs';
import os from 'os';
import { runCommand } from '../utils/command';

export interface SystemInfo {
  kernel: string;
  uptimeSeconds: number;
  loadAverage: number[];
  cpuCount: number;
  memory: {
    totalMb: number;
    usedMb: number;
    freeMb: number;
  };
  disks: Array<{
    filesystem: string;
    size: string;
    used: string;
    available: string;
    capacity: string;
    mountpoint: string;
  }>;
  cpuTemperatureC: number | null;
}

const parseDf = (output: string): SystemInfo['disks'] => {
  const lines = output.split('\n').slice(1).filter((line) => line.trim() !== '');
  return lines.map((line) => {
    const parts = line.replace(/\s+/g, ' ').split(' ');
    return {
      filesystem: parts[0] ?? '',
      size: parts[1] ?? '',
      used: parts[2] ?? '',
      available: parts[3] ?? '',
      capacity: parts[4] ?? '',
      mountpoint: parts[5] ?? ''
    };
  });
};

const readCpuTemperature = async (): Promise<number | null> => {
  try {
    const raw = await fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    const milliC = Number(raw.trim());
    if (Number.isNaN(milliC)) {
      return null;
    }
    return milliC / 1000;
  } catch (error) {
    return null;
  }
};

export const getSystemInfo = async (): Promise<SystemInfo> => {
  const [kernelResult, uptimeFile, loadAvg, memoryResult, diskResult, cpuTemperature] = await Promise.all([
    runCommand('uname', ['-r']),
    fs.readFile('/proc/uptime', 'utf8'),
    os.loadavg(),
    runCommand('free', ['-m']),
    runCommand('df', ['-h']),
    readCpuTemperature()
  ]);

  const uptimeSeconds = Number(uptimeFile.split(' ')[0]);

  const memoryLines = memoryResult.stdout.split('\n').filter((line) => line.trim() !== '');
  const memValues = memoryLines.find((line) => line.startsWith('Mem:'))?.split(/\s+/) ?? [];
  const totalMb = Number(memValues[1] ?? 0);
  const usedMb = Number(memValues[2] ?? 0);
  const freeMb = Number(memValues[3] ?? 0);

  return {
    kernel: kernelResult.stdout,
    uptimeSeconds,
    loadAverage: Array.isArray(loadAvg) ? loadAvg : os.loadavg(),
    cpuCount: os.cpus().length,
    memory: {
      totalMb,
      usedMb,
      freeMb
    },
    disks: parseDf(diskResult.stdout),
    cpuTemperatureC: cpuTemperature
  };
};
