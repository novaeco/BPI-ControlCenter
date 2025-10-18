import { apiRequest } from './client';
import type { SensorValue } from '../../shared/sensors';

export interface WifiStatusResponse {
  enabled: boolean;
}

export interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
}

export interface WifiConnectionResponse {
  connected: boolean;
  ssid: string;
}

export interface BluetoothStatusResponse {
  powered: boolean;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  paired: boolean;
}

export interface BluetoothDevicesResponse {
  discovered: BluetoothDevice[];
  paired: BluetoothDevice[];
}

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

export interface TerrariumDto {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isActive: boolean;
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface TerrariumInput {
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
}

export interface SettingDto {
  key: string;
  value: unknown;
  updatedAt: string;
}

export interface RelayStateDto {
  pin: number;
  value: 0 | 1;
}

export interface RelayListResponse {
  relays: RelayStateDto[];
}

export const fetchWifiStatus = (token: string) => apiRequest<WifiStatusResponse>('/wifi/status', { token });
export const toggleWifi = (token: string, enabled: boolean) =>
  apiRequest<WifiStatusResponse>('/wifi/toggle', { token, method: 'POST', body: JSON.stringify({ enabled }) });
export const fetchWifiNetworks = (token: string) => apiRequest<WifiNetwork[]>('/wifi/networks', { token });
export const connectWifiNetwork = (token: string, ssid: string, password?: string) =>
  apiRequest<WifiConnectionResponse>('/wifi/connect', {
    token,
    method: 'POST',
    body: JSON.stringify({ ssid, password })
  });

export const fetchBluetoothStatus = (token: string) => apiRequest<BluetoothStatusResponse>('/bluetooth/status', { token });
export const toggleBluetooth = (token: string, powered: boolean) =>
  apiRequest<BluetoothStatusResponse>('/bluetooth/toggle', { token, method: 'POST', body: JSON.stringify({ powered }) });
export const fetchBluetoothDevices = (token: string) => apiRequest<BluetoothDevicesResponse>('/bluetooth/devices', { token });

export const fetchSystemInfo = (token: string) => apiRequest<SystemInfo>('/system/info', { token });
export const fetchSensors = (token: string) => apiRequest<SensorValue[]>('/sensors', { token });

export const fetchTerrariums = (token: string) => apiRequest<TerrariumDto[]>('/terrariums', { token });
export const createTerrariumRequest = (token: string, payload: TerrariumInput) =>
  apiRequest<TerrariumDto>('/terrariums', { token, method: 'POST', body: JSON.stringify(payload) });
export const updateTerrariumRequest = (token: string, id: string, payload: TerrariumInput) =>
  apiRequest<TerrariumDto>(`/terrariums/${id}`, { token, method: 'PUT', body: JSON.stringify(payload) });
export const deleteTerrariumRequest = (token: string, id: string) =>
  apiRequest<void>(`/terrariums/${id}`, { token, method: 'DELETE' });

export const fetchSettings = (token: string) => apiRequest<SettingDto[]>('/settings', { token });
export const updateSettingRequest = (token: string, key: string, value: unknown) =>
  apiRequest<SettingDto>('/settings', { token, method: 'POST', body: JSON.stringify({ key, value }) });

export const fetchRelayStates = (token: string) => apiRequest<RelayListResponse>('/gpio/relays', { token });
export const updateRelayStateRequest = (token: string, pin: number, value: 0 | 1) =>
  apiRequest<RelayStateDto>(`/gpio/relays/${pin}`, {
    token,
    method: 'PUT',
    body: JSON.stringify({ value })
  });
