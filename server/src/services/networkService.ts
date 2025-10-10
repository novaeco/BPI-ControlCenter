import { runCommand } from '../utils/command';
import { HttpError } from '../middleware/errorHandler';

export interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
}

export const getWifiStatus = async (): Promise<{ enabled: boolean }> => {
  const { stdout } = await runCommand('nmcli', ['radio', 'wifi']);
  return { enabled: stdout.trim() === 'enabled' };
};

export const toggleWifi = async (enabled: boolean): Promise<{ enabled: boolean }> => {
  const command = enabled ? 'on' : 'off';
  await runCommand('nmcli', ['radio', 'wifi', command]);
  return getWifiStatus();
};

export const scanWifiNetworks = async (): Promise<WifiNetwork[]> => {
  const { stdout } = await runCommand('nmcli', ['-t', '-f', 'ssid,signal,security', 'dev', 'wifi', 'list']);
  if (!stdout) {
    return [];
  }

  return stdout
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [ssidRaw, signalRaw, securityRaw] = line.split(':');
      const ssid = ssidRaw || 'Réseau sans nom';
      const signal = Number(signalRaw ?? '0');
      if (Number.isNaN(signal)) {
        throw new HttpError(500, 'Valeur de signal invalide reçue.');
      }
      const secure = securityRaw !== undefined && securityRaw !== '' && securityRaw !== '--';
      return { ssid, signal, secure } satisfies WifiNetwork;
    });
};

type BluetoothDevice = {
  id: string;
  name: string;
  paired: boolean;
};

const parseBluetoothDevices = (raw: string, pairedOnly: boolean): BluetoothDevice[] => {
  return raw
    .split('\n')
    .filter((line) => line.startsWith('Device '))
    .map((line) => {
      const [, mac, ...nameParts] = line.split(' ');
      return {
        id: mac,
        name: nameParts.join(' ') || 'Inconnu',
        paired: pairedOnly
      };
    });
};

export const getBluetoothStatus = async (): Promise<{ powered: boolean }> => {
  const { stdout } = await runCommand('bluetoothctl', ['show']);
  const poweredLine = stdout
    .split('\n')
    .find((line) => line.trim().toLowerCase().startsWith('powered:'));
  const powered = poweredLine?.toLowerCase().includes('yes') ?? false;
  return { powered };
};

export const toggleBluetooth = async (enabled: boolean): Promise<{ powered: boolean }> => {
  await runCommand('bluetoothctl', ['power', enabled ? 'on' : 'off']);
  return getBluetoothStatus();
};

export const listBluetoothDevices = async (): Promise<{ discovered: BluetoothDevice[]; paired: BluetoothDevice[] }> => {
  const [discoveredResult, pairedResult] = await Promise.all([
    runCommand('bluetoothctl', ['devices']),
    runCommand('bluetoothctl', ['devices', 'Paired'])
  ]);

  const discovered = parseBluetoothDevices(discoveredResult.stdout, false);
  const paired = parseBluetoothDevices(pairedResult.stdout, true);
  const pairedIds = new Set(paired.map((device) => device.id));

  return {
    discovered: discovered.map((device) => ({ ...device, paired: pairedIds.has(device.id) })),
    paired
  };
};
