import React, { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Settings2, Volume2, Bell, Moon, Languages, Wifi, Bluetooth, ChevronRight, Activity, MonitorCheck, Server, Database, UserCircle2, Package, Cpu, Cable, BrainCircuit as Circuit, Radio, Usb, Puzzle, Brain, Ruler, Network, Keyboard, Monitor, X } from 'lucide-react';
import SensorSettingsPopup from './SensorSettingsPopup';
import SystemInfoPopup from './SystemInfoPopup';
import ServerSettingsPopup from './ServerSettingsPopup';
import DatabaseSettingsPopup from './DatabaseSettingsPopup';
import AccountSettingsPopup from './AccountSettingsPopup';
import ModuleSettingsPopup from './ModuleSettingsPopup';
import PortSettingsPopup from './PortSettingsPopup';
import ExtensionSettingsPopup from './ExtensionSettingsPopup';
import AISettingsPopup from './AISettingsPopup';
import ConnectionDistanceSettingsPopup from './ConnectionDistanceSettingsPopup';
import EthernetSettingsPopup from './EthernetSettingsPopup';
import WifiPopup from './WifiPopup';
import BluetoothPopup from './BluetoothPopup';
import VirtualKeyboardSettingsPopup from './VirtualKeyboardSettingsPopup';
import DisplaySettingsPopup from './DisplaySettingsPopup';
import {
  useBluetoothDevices,
  useBluetoothStatus,
  useConnectWifi,
  useToggleBluetooth,
  useToggleWifi,
  useWifiNetworks,
  useWifiStatus
} from '../api/hooks';

interface GeneralSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate?: (url: string) => void;
}

const GeneralSettingsPopup: React.FC<GeneralSettingsPopupProps> = ({ isOpen, onClose, onAvatarUpdate }) => {
  const [sensorSettingsOpen, setSensorSettingsOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);
  const [serverSettingsOpen, setServerSettingsOpen] = useState(false);
  const [databaseSettingsOpen, setDatabaseSettingsOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [moduleSettingsOpen, setModuleSettingsOpen] = useState(false);
  const [portSettingsOpen, setPortSettingsOpen] = useState(false);
  const [extensionSettingsOpen, setExtensionSettingsOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [connectionDistanceOpen, setConnectionDistanceOpen] = useState(false);
  const [ethernetSettingsOpen, setEthernetSettingsOpen] = useState(false);
  const [wifiPopupOpen, setWifiPopupOpen] = useState(false);
  const [bluetoothPopupOpen, setBluetoothPopupOpen] = useState(false);
  const [virtualKeyboardOpen, setVirtualKeyboardOpen] = useState(false);
  const [displaySettingsOpen, setDisplaySettingsOpen] = useState(false);
  const queryClient = useQueryClient();
  const wifiStatus = useWifiStatus();
  const toggleWifiMutation = useToggleWifi();
  const connectWifiMutation = useConnectWifi();
  const wifiNetworks = useWifiNetworks(wifiPopupOpen && (wifiStatus.data?.enabled ?? false));
  const bluetoothStatus = useBluetoothStatus();
  const toggleBluetoothMutation = useToggleBluetooth();
  const bluetoothDevices = useBluetoothDevices();
  const [wifiError, setWifiError] = useState<string | null>(null);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setWifiPopupOpen(false);
    setBluetoothPopupOpen(false);
    setWifiError(null);
    setBluetoothError(null);
    onClose();
  }, [onClose]);

  const handleWifiToggle = useCallback(async () => {
    if (!wifiStatus.data) {
      return;
    }
    setWifiError(null);
    try {
      await toggleWifiMutation.mutateAsync(!wifiStatus.data.enabled);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wifi', 'status'] }),
        queryClient.invalidateQueries({ queryKey: ['wifi', 'networks'] })
      ]);
    } catch (error) {
      setWifiError(error instanceof Error ? error.message : 'Impossible de basculer le Wi-Fi.');
    }
  }, [queryClient, toggleWifiMutation, wifiStatus.data]);

  const handleWifiConnect = useCallback(
    async (ssid: string, password?: string) => {
      setWifiError(null);
      try {
        await connectWifiMutation.mutateAsync({ ssid, password });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['wifi', 'networks'] }),
          queryClient.invalidateQueries({ queryKey: ['wifi', 'status'] })
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Connexion Wi-Fi échouée.';
        setWifiError(message);
        throw error;
      }
    },
    [connectWifiMutation, queryClient]
  );

  const handleBluetoothToggle = useCallback(async () => {
    if (!bluetoothStatus.data) {
      return;
    }
    setBluetoothError(null);
    try {
      await toggleBluetoothMutation.mutateAsync(!bluetoothStatus.data.powered);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bluetooth', 'status'] }),
        queryClient.invalidateQueries({ queryKey: ['bluetooth', 'devices'] })
      ]);
    } catch (error) {
      setBluetoothError(error instanceof Error ? error.message : 'Impossible de basculer le Bluetooth.');
    }
  }, [bluetoothStatus.data, queryClient, toggleBluetoothMutation]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
        <div
          className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-cyan-400">General Settings</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* System Section */}
              <div className="space-y-3">
                <h3 className="text-white text-sm font-medium">System</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setServerSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Server Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setDatabaseSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Database Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setAccountSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Account Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setModuleSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Module Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setExtensionSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Puzzle className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Extensions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setAiSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">AI Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setSystemInfoOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MonitorCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">System Information</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Display & Input Section */}
              <div className="space-y-3">
                <h3 className="text-white text-sm font-medium">Display & Input</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setDisplaySettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Display Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setVirtualKeyboardOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Virtual Keyboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Connectivity Section */}
              <div className="space-y-3">
                <h3 className="text-white text-sm font-medium">Connectivity</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setEthernetSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Ethernet Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setBluetoothPopupOpen(false);
                        setWifiPopupOpen((open) => {
                          const next = !open;
                          if (next) {
                            setWifiError(null);
                            void wifiNetworks.refetch();
                          }
                          return next;
                        });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">WiFi Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      {wifiStatus.isLoading
                        ? 'Chargement…'
                        : wifiStatus.isError
                          ? 'Statut Wi-Fi indisponible'
                          : `État : ${wifiStatus.data?.enabled ? 'activé' : 'désactivé'}`}
                    </p>
                    {wifiError && <p className="text-xs text-red-400 mt-1">{wifiError}</p>}
                  </div>

                  <div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setWifiPopupOpen(false);
                        setBluetoothPopupOpen((open) => {
                          const next = !open;
                          if (next) {
                            setBluetoothError(null);
                            void bluetoothDevices.refetch();
                          }
                          return next;
                        });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Bluetooth className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">Bluetooth Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      {bluetoothStatus.isLoading
                        ? 'Chargement…'
                        : bluetoothStatus.isError
                          ? 'Statut Bluetooth indisponible'
                          : `État : ${bluetoothStatus.data?.powered ? 'activé' : 'désactivé'}`}
                    </p>
                    {bluetoothError && <p className="text-xs text-red-400 mt-1">{bluetoothError}</p>}
                  </div>

                  <button 
                    onClick={() => setPortSettingsOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Cable className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Port Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setConnectionDistanceOpen(true)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Connection Distance</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-3">
                <h3 className="text-white text-sm font-medium">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Sound Effects</span>
                    </div>
                    <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-cyan-400">
                      <span className="inline-block h-3 w-3 transform translate-x-5 rounded-full bg-white" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Language</span>
                    </div>
                    <select className="bg-[#141e2a] text-white text-sm border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-400">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700 mt-4">
              <button className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <SensorSettingsPopup
        isOpen={sensorSettingsOpen}
        onClose={() => setSensorSettingsOpen(false)}
      />

      <SystemInfoPopup
        isOpen={systemInfoOpen}
        onClose={() => setSystemInfoOpen(false)}
      />

      <ServerSettingsPopup
        isOpen={serverSettingsOpen}
        onClose={() => setServerSettingsOpen(false)}
      />

      <DatabaseSettingsPopup
        isOpen={databaseSettingsOpen}
        onClose={() => setDatabaseSettingsOpen(false)}
      />

      <AccountSettingsPopup
        isOpen={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
        onAvatarUpdate={onAvatarUpdate}
      />

      <ModuleSettingsPopup
        isOpen={moduleSettingsOpen}
        onClose={() => setModuleSettingsOpen(false)}
      />

      <PortSettingsPopup
        isOpen={portSettingsOpen}
        onClose={() => setPortSettingsOpen(false)}
      />

      <ExtensionSettingsPopup
        isOpen={extensionSettingsOpen}
        onClose={() => setExtensionSettingsOpen(false)}
      />

      <AISettingsPopup
        isOpen={aiSettingsOpen}
        onClose={() => setAiSettingsOpen(false)}
      />

      <ConnectionDistanceSettingsPopup
        isOpen={connectionDistanceOpen}
        onClose={() => setConnectionDistanceOpen(false)}
      />

      <EthernetSettingsPopup
        isOpen={ethernetSettingsOpen}
        onClose={() => setEthernetSettingsOpen(false)}
      />

      <WifiPopup
        isOpen={wifiPopupOpen}
        onClose={() => {
          setWifiPopupOpen(false);
          setWifiError(null);
        }}
        isEnabled={wifiStatus.data?.enabled ?? false}
        isToggling={toggleWifiMutation.isPending}
        onToggle={handleWifiToggle}
        networks={wifiNetworks.data}
        isLoadingNetworks={wifiNetworks.isLoading || wifiNetworks.isFetching}
        onRefresh={async () => {
          await wifiNetworks.refetch();
        }}
        onConnect={handleWifiConnect}
        connectionError={wifiError}
        isConnecting={connectWifiMutation.isPending}
      />

      <BluetoothPopup
        isOpen={bluetoothPopupOpen}
        onClose={() => {
          setBluetoothPopupOpen(false);
          setBluetoothError(null);
        }}
        isEnabled={bluetoothStatus.data?.powered ?? false}
        isToggling={toggleBluetoothMutation.isPending}
        onToggle={handleBluetoothToggle}
        devices={bluetoothDevices.data}
        isLoadingDevices={bluetoothDevices.isLoading || bluetoothDevices.isFetching}
        onRefresh={async () => {
          await bluetoothDevices.refetch();
        }}
      />

      <VirtualKeyboardSettingsPopup
        isOpen={virtualKeyboardOpen}
        onClose={() => setVirtualKeyboardOpen(false)}
      />

      <DisplaySettingsPopup
        isOpen={displaySettingsOpen}
        onClose={() => setDisplaySettingsOpen(false)}
      />
    </>
  );
};

export default GeneralSettingsPopup;