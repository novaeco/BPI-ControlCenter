import React, { useMemo, useState } from 'react';
import { LogOut, RefreshCcw, Wifi, Bluetooth, Thermometer, Droplet, Sun, Activity, Cpu, Settings2, Zap } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import LoginForm from './components/auth/LoginForm';
import { useAuth } from './providers/AuthProvider';
import {
  useBluetoothDevices,
  useBluetoothStatus,
  useSensors,
  useSystemInfo,
  useTerrariums,
  useToggleBluetooth,
  useToggleWifi,
  useWifiNetworks,
  useWifiStatus,
  useCreateTerrarium,
  useDeleteTerrarium,
  useUpdateTerrarium,
  useRelayStates,
  useUpdateRelayState
} from './api/hooks';
import type { TerrariumInput } from './api/controlCenter';
import { SensorType, type SensorValue } from '../shared/sensors';
import GeneralSettingsPopup from './components/GeneralSettingsPopup';

const formatSeconds = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}j ${hours}h ${minutes}m`;
};

const formatSensorValue = (sensor: SensorValue): string => {
  if (sensor.sensorType === SensorType.RELAY || sensor.unit === 'state') {
    return sensor.value === 1 ? 'Activé' : 'Désactivé';
  }
  return `${sensor.value} ${sensor.unit}`;
};

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isGeneralSettingsOpen, setGeneralSettingsOpen] = useState(false);
  const [terrariumForm, setTerrariumForm] = useState<TerrariumInput>({
    name: '',
    type: 'custom',
    description: '',
    isActive: true,
    temperature: 28,
    humidity: 60,
    lightLevel: 70,
    uviLevel: 6
  });
  const [editingTerrariumId, setEditingTerrariumId] = useState<string | null>(null);

  const wifiStatus = useWifiStatus();
  const wifiNetworks = useWifiNetworks(wifiStatus.data?.enabled ?? false);
  const toggleWifiMutation = useToggleWifi();

  const bluetoothStatus = useBluetoothStatus();
  const bluetoothDevices = useBluetoothDevices();
  const toggleBluetoothMutation = useToggleBluetooth();

  const sensors = useSensors();
  const systemInfo = useSystemInfo();
  const terrariums = useTerrariums();
  const createTerrarium = useCreateTerrarium();
  const deleteTerrarium = useDeleteTerrarium();
  const updateTerrarium = useUpdateTerrarium();
  const relayStates = useRelayStates();
  const updateRelayState = useUpdateRelayState();

  const handleWifiToggle = async () => {
    if (!wifiStatus.data) return;
    await toggleWifiMutation.mutateAsync(!wifiStatus.data.enabled);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['wifi', 'status'] }),
      queryClient.invalidateQueries({ queryKey: ['wifi', 'networks'] })
    ]);
  };

  const handleBluetoothToggle = async () => {
    if (!bluetoothStatus.data) return;
    await toggleBluetoothMutation.mutateAsync(!bluetoothStatus.data.powered);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['bluetooth', 'status'] }),
      queryClient.invalidateQueries({ queryKey: ['bluetooth', 'devices'] })
    ]);
  };

  const activeSensors = useMemo(() => sensors.data ?? [], [sensors.data]);

  const handleTerrariumSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...terrariumForm,
      description: terrariumForm.description?.trim() ? terrariumForm.description : null
    } satisfies TerrariumInput;

    if (editingTerrariumId) {
      await updateTerrarium.mutateAsync({ id: editingTerrariumId, data: payload });
    } else {
      await createTerrarium.mutateAsync(payload);
    }
    setTerrariumForm((prev) => ({ ...prev, name: '', description: '' }));
    setEditingTerrariumId(null);
    await queryClient.invalidateQueries({ queryKey: ['terrariums'] });
  };

  const handleTerrariumDelete = async (id: string) => {
    await deleteTerrarium.mutateAsync(id);
    if (editingTerrariumId === id) {
      setEditingTerrariumId(null);
      setTerrariumForm((prev) => ({ ...prev, name: '', description: '' }));
    }
    await queryClient.invalidateQueries({ queryKey: ['terrariums'] });
  };

  const handleTerrariumEdit = (id: string) => {
    const terrarium = terrariums.data?.find((item) => item.id === id);
    if (!terrarium) return;
    setEditingTerrariumId(id);
    setTerrariumForm({
      name: terrarium.name,
      type: terrarium.type,
      description: terrarium.description ?? '',
      isActive: terrarium.isActive,
      temperature: terrarium.temperature,
      humidity: terrarium.humidity,
      lightLevel: terrarium.lightLevel,
      uviLevel: terrarium.uviLevel
    });
  };

  const handleTerrariumCancelEdit = () => {
    setEditingTerrariumId(null);
    setTerrariumForm({
      name: '',
      type: 'custom',
      description: '',
      isActive: true,
      temperature: 28,
      humidity: 60,
      lightLevel: 70,
      uviLevel: 6
    });
  };

  const handleRelayToggle = async (pin: number, value: 0 | 1) => {
    await updateRelayState.mutateAsync({ pin, value });
    await queryClient.invalidateQueries({ queryKey: ['gpio', 'relays'] });
    await queryClient.invalidateQueries({ queryKey: ['sensors'] });
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-cyan-500/20 bg-slate-900/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-cyan-400">BPI Control Center</h1>
            <p className="text-sm text-slate-300">Supervision temps réel de votre Banana Pi F3</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGeneralSettingsOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              <Settings2 className="w-4 h-4" />
              Paramètres
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Wifi className="w-5 h-5 text-cyan-400" /> Wi-Fi</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWifiToggle}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20"
                  disabled={toggleWifiMutation.isPending || wifiStatus.isLoading}
                >
                  <RefreshCcw className={`w-4 h-4 ${toggleWifiMutation.isPending ? 'animate-spin' : ''}`} />
                  {wifiStatus.data?.enabled ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => setGeneralSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
                >
                  Gérer les connexions
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              État : {wifiStatus.data?.enabled ? 'activé' : 'désactivé'}
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {wifiNetworks.data?.map((network) => (
                <div key={`${network.ssid}-${network.signal}`} className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-2">
                  <div>
                    <p className="font-medium">{network.ssid || 'SSID non diffusé'}</p>
                    <p className="text-xs text-slate-400">{network.secure ? 'Sécurisé' : 'Ouvert'}</p>
                  </div>
                  <span className="text-sm text-cyan-300">{network.signal}%</span>
                </div>
              ))}
              {wifiNetworks.isLoading && <p className="text-sm text-slate-400">Scan des réseaux…</p>}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Bluetooth className="w-5 h-5 text-cyan-400" /> Bluetooth</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBluetoothToggle}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20"
                  disabled={toggleBluetoothMutation.isPending || bluetoothStatus.isLoading}
                >
                  <RefreshCcw className={`w-4 h-4 ${toggleBluetoothMutation.isPending ? 'animate-spin' : ''}`} />
                  {bluetoothStatus.data?.powered ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => setGeneralSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
                >
                  Gérer les appareils
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              État : {bluetoothStatus.data?.powered ? 'activé' : 'désactivé'}
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {bluetoothDevices.data?.discovered.map((device) => (
                <div key={device.id} className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-2">
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-slate-400">{device.id}</p>
                  </div>
                  <span className={`text-xs ${device.paired ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {device.paired ? 'Appairé' : 'Découvert'}
                  </span>
                </div>
              ))}
              {bluetoothDevices.isLoading && <p className="text-sm text-slate-400">Recherche d'appareils…</p>}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" /> Capteurs</h2>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['sensors'] })}
              >
                <RefreshCcw className="w-4 h-4" /> Rafraîchir
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeSensors.map((sensor) => (
                <div key={`${sensor.sensorType}-${sensor.timestamp}-${sensor.label ?? ''}`} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
                  <p className="text-sm text-slate-400">{sensor.label ?? sensor.sensorType}</p>
                  <p className="text-2xl font-semibold text-cyan-300">{formatSensorValue(sensor)}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(sensor.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {activeSensors.length === 0 && <p className="text-sm text-slate-400">Aucune mesure disponible.</p>}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-cyan-400" /> Relais GPIO</h2>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['gpio', 'relays'] })}
              >
                <RefreshCcw className="w-4 h-4" /> Rafraîchir
              </button>
            </div>
            {relayStates.isError && <p className="text-sm text-red-400 mb-2">Impossible de lire les relais.</p>}
            {updateRelayState.isError && <p className="text-sm text-red-400 mb-2">Échec de la mise à jour d'un relais.</p>}
            <div className="space-y-3">
              {relayStates.data?.relays.map((relay) => (
                <div
                  key={relay.pin}
                  className="flex items-center justify-between bg-slate-800/50 border border-slate-700/40 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-slate-300">GPIO {relay.pin}</p>
                    <p className="text-xs text-slate-500">{relay.value === 1 ? 'Activé' : 'Désactivé'}</p>
                  </div>
                  <button
                    onClick={() => handleRelayToggle(relay.pin, relay.value === 1 ? 0 : 1)}
                    disabled={updateRelayState.isPending}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      relay.value === 1 ? 'bg-cyan-400' : 'bg-gray-600'
                    } ${updateRelayState.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        relay.value === 1 ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
              {relayStates.isLoading && <p className="text-sm text-slate-400">Lecture des relais…</p>}
              {!relayStates.isLoading && (relayStates.data?.relays.length ?? 0) === 0 && (
                <p className="text-sm text-slate-400">Aucun relais configuré.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-cyan-400" /> Système</h2>
            {systemInfo.data ? (
              <div className="space-y-3 text-sm text-slate-300">
                <p>Kernel : {systemInfo.data.kernel}</p>
                <p>Uptime : {formatSeconds(systemInfo.data.uptimeSeconds)}</p>
                <p>CPU : {systemInfo.data.cpuCount} cœurs — charge {systemInfo.data.loadAverage.map((value) => value.toFixed(2)).join(', ')}</p>
                <p>Mémoire : {systemInfo.data.memory.usedMb} / {systemInfo.data.memory.totalMb} Mo utilisés</p>
                <p>Température CPU : {systemInfo.data.cpuTemperatureC ? `${systemInfo.data.cpuTemperatureC.toFixed(1)} °C` : 'N/A'}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Collecte des informations système…</p>
            )}
          </div>
        </section>

        <section className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Terrariums</h2>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['terrariums'] })}
            >
              <RefreshCcw className="w-4 h-4" /> Rafraîchir
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {terrariums.data?.map((terrarium) => (
              <div
                key={terrarium.id}
                className={`bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2 ${
                  editingTerrariumId === terrarium.id ? 'ring-2 ring-cyan-400' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-cyan-300">{terrarium.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTerrariumEdit(terrarium.id)}
                      className="text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleTerrariumDelete(terrarium.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{terrarium.type}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-cyan-400" /> {terrarium.temperature}°C</div>
                  <div className="flex items-center gap-2"><Droplet className="w-4 h-4 text-cyan-400" /> {terrarium.humidity}%</div>
                  <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-cyan-400" /> {terrarium.lightLevel}%</div>
                  <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> UVI {terrarium.uviLevel}</div>
                </div>
                <p className={`text-xs ${terrarium.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {terrarium.isActive ? 'Actif' : 'Arrêté'}
                </p>
              </div>
            ))}
            {terrariums.isLoading && <p className="text-sm text-slate-400">Chargement des terrariums…</p>}
          </div>

          <form onSubmit={handleTerrariumSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
              placeholder="Nom"
              value={terrariumForm.name}
              onChange={(event) => setTerrariumForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
              placeholder="Type"
              value={terrariumForm.type}
              onChange={(event) => setTerrariumForm((prev) => ({ ...prev, type: event.target.value }))}
              required
            />
            <input
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
              placeholder="Description"
              value={terrariumForm.description ?? ''}
              onChange={(event) => setTerrariumForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Température
              <input
                type="number"
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 w-full"
                value={terrariumForm.temperature}
                onChange={(event) => setTerrariumForm((prev) => ({ ...prev, temperature: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Humidité
              <input
                type="number"
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 w-full"
                value={terrariumForm.humidity}
                onChange={(event) => setTerrariumForm((prev) => ({ ...prev, humidity: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Lumière
              <input
                type="number"
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 w-full"
                value={terrariumForm.lightLevel}
                onChange={(event) => setTerrariumForm((prev) => ({ ...prev, lightLevel: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              UVI
              <input
                type="number"
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 w-full"
                value={terrariumForm.uviLevel}
                onChange={(event) => setTerrariumForm((prev) => ({ ...prev, uviLevel: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Actif
              <input
                type="checkbox"
                checked={terrariumForm.isActive}
                onChange={(event) => setTerrariumForm((prev) => ({ ...prev, isActive: event.target.checked }))}
              />
            </label>
            <button
              type="submit"
              disabled={createTerrarium.isPending || updateTerrarium.isPending}
              className="md:col-span-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg py-2"
            >
              {editingTerrariumId
                ? updateTerrarium.isPending
                  ? 'Mise à jour…'
                  : 'Enregistrer les modifications'
                : createTerrarium.isPending
                  ? 'Enregistrement…'
                  : 'Ajouter un terrarium'}
            </button>
            {editingTerrariumId && (
              <button
                type="button"
                onClick={handleTerrariumCancelEdit}
                className="md:col-span-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg py-2"
              >
                Annuler la modification
              </button>
            )}
          </form>
        </section>
      </main>
      <GeneralSettingsPopup
        isOpen={isGeneralSettingsOpen}
        onClose={() => setGeneralSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
