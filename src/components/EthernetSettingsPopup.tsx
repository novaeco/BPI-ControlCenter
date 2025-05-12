import React, { useState } from 'react';
import { X, Save, Network } from 'lucide-react';

interface EthernetSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EthernetConfig {
  enabled: boolean;
  dhcp: boolean;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns1: string;
  dns2: string;
  macAddress: string;
  speed: '10' | '100' | '1000' | 'auto';
  duplex: 'half' | 'full' | 'auto';
  mtu: string;
  jumboFrames: boolean;
  flowControl: boolean;
  energyEfficient: boolean;
}

const EthernetSettingsPopup: React.FC<EthernetSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<EthernetConfig>({
    enabled: true,
    dhcp: true,
    ipAddress: '192.168.1.100',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns1: '8.8.8.8',
    dns2: '8.8.4.4',
    macAddress: '00:11:22:33:44:55',
    speed: 'auto',
    duplex: 'auto',
    mtu: '1500',
    jumboFrames: false,
    flowControl: true,
    energyEfficient: true
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof EthernetConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving Ethernet configuration:', config);
    onClose();
  };

  const isValidIPAddress = (ip: string) => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;
    return ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
  };

  const isValidMACAddress = (mac: string) => {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-2xl rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Ethernet Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Connection Status</h3>
                <button
                  onClick={() => handleChange('enabled', !config.enabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">DHCP</span>
                  <button
                    onClick={() => handleChange('dhcp', !config.dhcp)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.dhcp ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.dhcp ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={config.ipAddress}
                    onChange={(e) => handleChange('ipAddress', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={config.dhcp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Subnet Mask
                  </label>
                  <input
                    type="text"
                    value={config.subnetMask}
                    onChange={(e) => handleChange('subnetMask', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={config.dhcp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Gateway
                  </label>
                  <input
                    type="text"
                    value={config.gateway}
                    onChange={(e) => handleChange('gateway', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={config.dhcp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Primary DNS
                  </label>
                  <input
                    type="text"
                    value={config.dns1}
                    onChange={(e) => handleChange('dns1', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={config.dhcp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Secondary DNS
                  </label>
                  <input
                    type="text"
                    value={config.dns2}
                    onChange={(e) => handleChange('dns2', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={config.dhcp}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Advanced Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    MAC Address
                  </label>
                  <input
                    type="text"
                    value={config.macAddress}
                    onChange={(e) => handleChange('macAddress', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Speed
                  </label>
                  <select
                    value={config.speed}
                    onChange={(e) => handleChange('speed', e.target.value as '10' | '100' | '1000' | 'auto')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="auto">Auto-Negotiate</option>
                    <option value="10">10 Mbps</option>
                    <option value="100">100 Mbps</option>
                    <option value="1000">1000 Mbps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Duplex Mode
                  </label>
                  <select
                    value={config.duplex}
                    onChange={(e) => handleChange('duplex', e.target.value as 'half' | 'full' | 'auto')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="auto">Auto-Negotiate</option>
                    <option value="full">Full Duplex</option>
                    <option value="half">Half Duplex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    MTU Size
                  </label>
                  <input
                    type="number"
                    value={config.mtu}
                    onChange={(e) => handleChange('mtu', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="576"
                    max="9000"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Jumbo Frames</span>
                  <button
                    onClick={() => handleChange('jumboFrames', !config.jumboFrames)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.jumboFrames ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.jumboFrames ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Flow Control</span>
                  <button
                    onClick={() => handleChange('flowControl', !config.flowControl)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.flowControl ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.flowControl ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Energy Efficient Ethernet</span>
                  <button
                    onClick={() => handleChange('energyEfficient', !config.energyEfficient)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.energyEfficient ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.energyEfficient ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EthernetSettingsPopup;