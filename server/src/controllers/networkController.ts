import { Request, Response } from 'express';
import {
  getWifiStatus,
  toggleWifi,
  scanWifiNetworks,
  connectWifiNetwork,
  getBluetoothStatus,
  toggleBluetooth,
  listBluetoothDevices
} from '../services/networkService';

export const wifiStatus = async (_req: Request, res: Response): Promise<void> => {
  const status = await getWifiStatus();
  res.json(status);
};

export const wifiToggle = async (req: Request, res: Response): Promise<void> => {
  const enabled = Boolean(req.body?.enabled);
  const status = await toggleWifi(enabled);
  res.json(status);
};

export const wifiNetworks = async (_req: Request, res: Response): Promise<void> => {
  const networks = await scanWifiNetworks();
  res.json(networks);
};

export const wifiConnect = async (req: Request, res: Response): Promise<void> => {
  const ssid = String(req.body?.ssid ?? '').trim();
  const password = typeof req.body?.password === 'string' ? req.body.password : undefined;
  const result = await connectWifiNetwork(ssid, password);
  res.json(result);
};

export const bluetoothStatus = async (_req: Request, res: Response): Promise<void> => {
  const status = await getBluetoothStatus();
  res.json(status);
};

export const bluetoothToggle = async (req: Request, res: Response): Promise<void> => {
  const powered = Boolean(req.body?.powered);
  const status = await toggleBluetooth(powered);
  res.json(status);
};

export const bluetoothDevices = async (_req: Request, res: Response): Promise<void> => {
  const devices = await listBluetoothDevices();
  res.json(devices);
};
