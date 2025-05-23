import React, { useState } from 'react';
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
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div 
          className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-cyan-400">General Settings</h2>
            <button
              onClick={onClose}
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

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setWifiPopupOpen(!wifiPopupOpen);
                      setBluetoothPopupOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">WiFi Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setBluetoothPopupOpen(!bluetoothPopupOpen);
                      setWifiPopupOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-[#141e2a] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Bluetooth className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Bluetooth Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>

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
        onClose={() => setWifiPopupOpen(false)}
        isEnabled={wifiEnabled}
        onToggle={() => setWifiEnabled(!wifiEnabled)}
      />

      <BluetoothPopup
        isOpen={bluetoothPopupOpen}
        onClose={() => setBluetoothPopupOpen(false)}
        isEnabled={bluetoothEnabled}
        onToggle={() => setBluetoothEnabled(!bluetoothEnabled)}
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