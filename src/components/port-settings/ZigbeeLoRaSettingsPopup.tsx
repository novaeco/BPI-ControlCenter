import React, { useState } from 'react';
import { X, Save, Wifi } from 'lucide-react';

interface ZigbeeLoRaSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ZigbeeConfig {
  enabled: boolean;
  channel: string;
  panId: string;
  extendedPanId: string;
  networkKey: string;
  txPower: string;
  role: 'coordinator' | 'router' | 'end-device';
  securityEnabled: boolean;
  permitJoining: boolean;
  routingEnabled: boolean;
  autoFormNetwork: boolean;
}

interface LoRaConfig {
  enabled: boolean;
  frequency: string;
  spreadingFactor: string;
  bandwidth: string;
  codingRate: string;
  txPower: string;
  syncWord: string;
  preambleLength: string;
  explicitHeader: boolean;
  crc: boolean;
  lowDataRateOptimize: boolean;
  agcAuto: boolean;
}

const ZigbeeLoRaSettingsPopup: React.FC<ZigbeeLoRaSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'zigbee' | 'lora'>('zigbee');
  const [zigbeeConfig, setZigbeeConfig] = useState<ZigbeeConfig>({
    enabled: true,
    channel: '11',
    panId: '0x1234',
    extendedPanId: '0xDEADBEEF12345678',
    networkKey: '01234567890123456789012345678901',
    txPower: '8',
    role: 'coordinator',
    securityEnabled: true,
    permitJoining: false,
    routingEnabled: true,
    autoFormNetwork: true
  });

  const [loraConfig, setLoraConfig] = useState<LoRaConfig>({
    enabled: true,
    frequency: '915',
    spreadingFactor: '7',
    bandwidth: '125',
    codingRate: '5',
    txPower: '17',
    syncWord: '0x34',
    preambleLength: '8',
    explicitHeader: true,
    crc: true,
    lowDataRateOptimize: false,
    agcAuto: true
  });

  if (!isOpen) return null;

  const handleZigbeeChange = (field: keyof ZigbeeConfig, value: string | boolean) => {
    setZigbeeConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoRaChange = (field: keyof LoRaConfig, value: string | boolean) => {
    setLoraConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving Zigbee/LoRa configuration:', { zigbee: zigbeeConfig, lora: loraConfig });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-2xl rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Zigbee/LoRa Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('zigbee')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'zigbee'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            Zigbee Settings
          </button>
          <button
            onClick={() => setActiveTab('lora')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'lora'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            LoRa Settings
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'zigbee' ? (
            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Zigbee Basic Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable Zigbee</span>
                    <button
                      onClick={() => handleZigbeeChange('enabled', !zigbeeConfig.enabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        zigbeeConfig.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          zigbeeConfig.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Channel
                    </label>
                    <select
                      value={zigbeeConfig.channel}
                      onChange={(e) => handleZigbeeChange('channel', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map(channel => (
                        <option key={channel} value={channel}>{channel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      PAN ID
                    </label>
                    <input
                      type="text"
                      value={zigbeeConfig.panId}
                      onChange={(e) => handleZigbeeChange('panId', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      placeholder="0x1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Extended PAN ID
                    </label>
                    <input
                      type="text"
                      value={zigbeeConfig.extendedPanId}
                      onChange={(e) => handleZigbeeChange('extendedPanId', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      placeholder="0xDEADBEEF12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Network Key
                    </label>
                    <input
                      type="password"
                      value={zigbeeConfig.networkKey}
                      onChange={(e) => handleZigbeeChange('networkKey', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      TX Power (dBm)
                    </label>
                    <select
                      value={zigbeeConfig.txPower}
                      onChange={(e) => handleZigbeeChange('txPower', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      {[-20, -16, -12, -8, -4, 0, 4, 8].map(power => (
                        <option key={power} value={power}>{power} dBm</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Device Role
                    </label>
                    <select
                      value={zigbeeConfig.role}
                      onChange={(e) => handleZigbeeChange('role', e.target.value as 'coordinator' | 'router' | 'end-device')}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="coordinator">Coordinator</option>
                      <option value="router">Router</option>
                      <option value="end-device">End Device</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Network Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Security Enabled</span>
                    <button
                      onClick={() => handleZigbeeChange('securityEnabled', !zigbeeConfig.securityEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        zigbeeConfig.securityEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          zigbeeConfig.securityEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Permit Joining</span>
                    <button
                      onClick={() => handleZigbeeChange('permitJoining', !zigbeeConfig.permitJoining)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        zigbeeConfig.permitJoining ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          zigbeeConfig.permitJoining ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Routing Enabled</span>
                    <button
                      onClick={() => handleZigbeeChange('routingEnabled', !zigbeeConfig.routingEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        zigbeeConfig.routingEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          zigbeeConfig.routingEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Auto-form Network</span>
                    <button
                      onClick={() => handleZigbeeChange('autoFormNetwork', !zigbeeConfig.autoFormNetwork)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        zigbeeConfig.autoFormNetwork ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          zigbeeConfig.autoFormNetwork ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">LoRa Basic Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable LoRa</span>
                    <button
                      onClick={() => handleLoRaChange('enabled', !loraConfig.enabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loraConfig.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loraConfig.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Frequency (MHz)
                    </label>
                    <select
                      value={loraConfig.frequency}
                      onChange={(e) => handleLoRaChange('frequency', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="433">433 MHz</option>
                      <option value="868">868 MHz</option>
                      <option value="915">915 MHz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Spreading Factor
                    </label>
                    <select
                      value={loraConfig.spreadingFactor}
                      onChange={(e) => handleLoRaChange('spreadingFactor', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      {[7, 8, 9, 10, 11, 12].map(sf => (
                        <option key={sf} value={sf}>SF{sf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Bandwidth (kHz)
                    </label>
                    <select
                      value={loraConfig.bandwidth}
                      onChange={(e) => handleLoRaChange('bandwidth', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="125">125 kHz</option>
                      <option value="250">250 kHz</option>
                      <option value="500">500 kHz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Coding Rate
                    </label>
                    <select
                      value={loraConfig.codingRate}
                      onChange={(e) => handleLoRaChange('codingRate', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="5">4/5</option>
                      <option value="6">4/6</option>
                      <option value="7">4/7</option>
                      <option value="8">4/8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      TX Power (dBm)
                    </label>
                    <select
                      value={loraConfig.txPower}
                      onChange={(e) => handleLoRaChange('txPower', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      {[2, 5, 8, 11, 14, 17, 20].map(power => (
                        <option key={power} value={power}>{power} dBm</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Advanced Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Sync Word
                    </label>
                    <input
                      type="text"
                      value={loraConfig.syncWord}
                      onChange={(e) => handleLoRaChange('syncWord', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      placeholder="0x34"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Preamble Length
                    </label>
                    <input
                      type="number"
                      value={loraConfig.preambleLength}
                      onChange={(e) => handleLoRaChange('preambleLength', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      min="6"
                      max="65535"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Explicit Header</span>
                    <button
                      onClick={() => handleLoRaChange('explicitHeader', !loraConfig.explicitHeader)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loraConfig.explicitHeader ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loraConfig.explicitHeader ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">CRC</span>
                    <button
                      onClick={() => handleLoRaChange('crc', !loraConfig.crc)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loraConfig.crc ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loraConfig.crc ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Low Data Rate Optimize</span>
                    <button
                      onClick={() => handleLoRaChange('lowDataRateOptimize', !loraConfig.lowDataRateOptimize)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loraConfig.lowDataRateOptimize ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loraConfig.lowDataRateOptimize ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">AGC Auto</span>
                    <button
                      onClick={() => handleLoRaChange('agcAuto', !loraConfig.agcAuto)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loraConfig.agcAuto ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loraConfig.agcAuto ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default ZigbeeLoRaSettingsPopup;