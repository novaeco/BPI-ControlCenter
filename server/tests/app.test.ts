import request from './supertest.cjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createApp } from '../src/app';

vi.mock('../src/middleware/auth', () => ({
  authenticate: (_req: unknown, _res: unknown, next: () => void) => next()
}));

vi.mock('../src/services/networkService', () => ({
  getWifiStatus: vi.fn().mockResolvedValue({ enabled: true }),
  toggleWifi: vi.fn().mockResolvedValue({ enabled: false }),
  scanWifiNetworks: vi.fn().mockResolvedValue([{ ssid: 'test', signal: 70, secure: true }]),
  connectWifiNetwork: vi.fn().mockResolvedValue({ connected: true, ssid: 'test' }),
  getBluetoothStatus: vi.fn().mockResolvedValue({ powered: true }),
  toggleBluetooth: vi.fn().mockResolvedValue({ powered: false }),
  listBluetoothDevices: vi
    .fn()
    .mockResolvedValue({ discovered: [{ id: 'AA:BB', name: 'Device', paired: false }], paired: [] })
}));

vi.mock('../src/services/systemService', () => ({
  getSystemInfo: vi.fn().mockResolvedValue({ kernel: '5.10.0', uptimeSeconds: 100, loadAverage: [0.1, 0.2, 0.3], cpuCount: 4, memory: { totalMb: 1024, usedMb: 512, freeMb: 512 }, disks: [], cpuTemperatureC: 45 })
}));

vi.mock('../src/services/sensorService', () => ({
  readSensors: vi.fn().mockResolvedValue([
    { sensorType: 'TEMPERATURE', value: 25, unit: '°C', timestamp: new Date().toISOString() }
  ])
}));

vi.mock('../src/services/terrariumService', () => ({
  listTerrariums: vi.fn().mockResolvedValue([{ id: '1', name: 'Test', description: null, type: 'desert', isActive: true, temperature: 30, humidity: 40, lightLevel: 60, uviLevel: 5, createdAt: new Date(), updatedAt: new Date() }]),
  getTerrarium: vi.fn().mockResolvedValue({ id: '1', name: 'Test', description: null, type: 'desert', isActive: true, temperature: 30, humidity: 40, lightLevel: 60, uviLevel: 5, createdAt: new Date(), updatedAt: new Date() }),
  createTerrarium: vi.fn().mockResolvedValue({ id: '1', name: 'Test', description: null, type: 'desert', isActive: true, temperature: 30, humidity: 40, lightLevel: 60, uviLevel: 5, createdAt: new Date(), updatedAt: new Date() }),
  updateTerrarium: vi.fn().mockResolvedValue({ id: '1', name: 'Test', description: null, type: 'desert', isActive: true, temperature: 30, humidity: 40, lightLevel: 60, uviLevel: 5, createdAt: new Date(), updatedAt: new Date() }),
  deleteTerrarium: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('../src/services/authService', () => ({
  login: vi.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 }),
  refreshTokens: vi.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', expiresIn: 900 })
}));

vi.mock('../src/services/settingsService', () => ({
  getSettings: vi.fn().mockResolvedValue([{ key: 'theme', value: 'dark', updatedAt: new Date().toISOString() }]),
  upsertSetting: vi.fn().mockResolvedValue({ key: 'theme', value: 'dark', updatedAt: new Date().toISOString() })
}));

describe('API routes', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns wifi status', async () => {
    const response = await request(app).get('/api/wifi/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ enabled: true });
  });

  it('toggles wifi', async () => {
    const response = await request(app).post('/api/wifi/toggle').send({ enabled: false });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ enabled: false });
  });

  it('connects to wifi', async () => {
    const response = await request(app).post('/api/wifi/connect').send({ ssid: 'test', password: 'secret' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ connected: true, ssid: 'test' });
  });

  it('returns system info', async () => {
    const response = await request(app).get('/api/system/info');
    expect(response.status).toBe(200);
    expect(response.body.kernel).toBe('5.10.0');
  });

  it('authenticates login', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});
