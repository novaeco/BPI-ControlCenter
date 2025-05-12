import React, { useState } from 'react';
import { X, Save, MemoryStick as Memory } from 'lucide-react';

interface LPDDR5SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LPDDR5Config {
  enabled: boolean;
  channels: {
    id: string;
    enabled: boolean;
    moduleType: string;
    capacity: string;
    speed: string;
    voltage: string;
    ecc: boolean;
    manufacturer: string;
    partNumber: string;
    serialNumber: string;
    rank: '1' | '2' | '4';
    timing: {
      cas: string;
      rcd: string;
      rp: string;
      ras: string;
    };
    temperature: {
      monitoring: boolean;
      threshold: string;
      throttling: boolean;
    };
  }[];
  powerSaving: boolean;
  refreshRate: string;
  bankGrouping: boolean;
  commandRate: '1T' | '2T';
  gearDownMode: boolean;
  powerDownMode: boolean;
  training: {
    enabled: boolean;
    mode: 'auto' | 'manual';
    interval: string;
  };
}

const LPDDR5SettingsPopup: React.FC<LPDDR5SettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<LPDDR5Config>({
    enabled: true,
    channels: [
      {
        id: 'slot1',
        enabled: true,
        moduleType: 'DDR4',
        capacity: '16',
        speed: '3200',
        voltage: '1.2',
        ecc: true,
        manufacturer: 'Samsung',
        partNumber: 'M471A2K43DB1-CWE',
        serialNumber: '12345678',
        rank: '2',
        timing: {
          cas: '22',
          rcd: '22',
          rp: '22',
          ras: '52'
        },
        temperature: {
          monitoring: true,
          threshold: '85',
          throttling: true
        }
      },
      {
        id: 'slot2',
        enabled: true,
        moduleType: 'DDR4',
        capacity: '16',
        speed: '3200',
        voltage: '1.2',
        ecc: true,
        manufacturer: 'Samsung',
        partNumber: 'M471A2K43DB1-CWE',
        serialNumber: '87654321',
        rank: '2',
        timing: {
          cas: '22',
          rcd: '22',
          rp: '22',
          ras: '52'
        },
        temperature: {
          monitoring: true,
          threshold: '85',
          throttling: true
        }
      }
    ],
    powerSaving: true,
    refreshRate: '7.8',
    bankGrouping: true,
    commandRate: '1T',
    gearDownMode: false,
    powerDownMode: true,
    training: {
      enabled: true,
      mode: 'auto',
      interval: '24'
    }
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof LPDDR5Config, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelChange = (
    channelId: string,
    field: keyof LPDDR5Config['channels'][0],
    value: string | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      channels: prev.channels.map(channel => {
        if (channel.id === channelId) {
          return {
            ...channel,
            [field]: value
          };
        }
        return channel;
      })
    }));
  };

  const handleTimingChange = (
    channelId: string,
    field: keyof LPDDR5Config['channels'][0]['timing'],
    value: string
  ) => {
    setConfig(prev => ({
      ...prev,
      channels: prev.channels.map(channel => {
        if (channel.id === channelId) {
          return {
            ...channel,
            timing: {
              ...channel.timing,
              [field]: value
            }
          };
        }
        return channel;
      })
    }));
  };

  const handleTemperatureChange = (
    channelId: string,
    field: keyof LPDDR5Config['channels'][0]['temperature'],
    value: string | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      channels: prev.channels.map(channel => {
        if (channel.id === channelId) {
          return {
            ...channel,
            temperature: {
              ...channel.temperature,
              [field]: value
            }
          };
        }
        return channel;
      })
    }));
  };

  const handleTrainingChange = (field: keyof LPDDR5Config['training'], value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      training: {
        ...prev.training,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving LPDDR5 configuration:', config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-[90rem] rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Memory className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">LPDDR5 Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Basic Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable LPDDR5</span>
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

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Command Rate
                  </label>
                  <select
                    value={config.commandRate}
                    onChange={(e) => handleChange('commandRate', e.target.value as '1T' | '2T')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1T">1T</option>
                    <option value="2T">2T</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Refresh Rate (μs)
                  </label>
                  <input
                    type="number"
                    value={config.refreshRate}
                    onChange={(e) => handleChange('refreshRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Power Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Power Saving Mode</span>
                  <button
                    onClick={() => handleChange('powerSaving', !config.powerSaving)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.powerSaving ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.powerSaving ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Power Down Mode</span>
                  <button
                    onClick={() => handleChange('powerDownMode', !config.powerDownMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.powerDownMode ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.powerDownMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bank Group Architecture</span>
                  <button
                    onClick={() => handleChange('bankGrouping', !config.bankGrouping)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.bankGrouping ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.bankGrouping ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Gear Down Mode</span>
                  <button
                    onClick={() => handleChange('gearDownMode', !config.gearDownMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.gearDownMode ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.gearDownMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Memory Training</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable Training</span>
                  <button
                    onClick={() => handleTrainingChange('enabled', !config.training.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.training.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.training.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Training Mode
                  </label>
                  <select
                    value={config.training.mode}
                    onChange={(e) => handleTrainingChange('mode', e.target.value as 'auto' | 'manual')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={!config.training.enabled}
                  >
                    <option value="auto">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Training Interval (hours)
                  </label>
                  <input
                    type="number"
                    value={config.training.interval}
                    onChange={(e) => handleTrainingChange('interval', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={!config.training.enabled || config.training.mode === 'manual'}
                  />
                </div>
              </div>
            </div>

            {config.channels.map((channel, index) => (
              <div key={channel.id} className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Channel {index + 1}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable Channel</span>
                    <button
                      onClick={() => handleChannelChange(channel.id, 'enabled', !channel.enabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        channel.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          channel.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Module Type
                    </label>
                    <select
                      value={channel.moduleType}
                      onChange={(e) => handleChannelChange(channel.id, 'moduleType', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="DDR4">DDR4 SODIMM</option>
                      <option value="DDR5">DDR5 SODIMM</option>
                      <option value="LPDDR4">LPDDR4</option>
                      <option value="LPDDR5">LPDDR5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Capacity (GB)
                    </label>
                    <select
                      value={channel.capacity}
                      onChange={(e) => handleChannelChange(channel.id, 'capacity', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="4">4 GB</option>
                      <option value="8">8 GB</option>
                      <option value="16">16 GB</option>
                      <option value="32">32 GB</option>
                      <option value="64">64 GB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Speed (MHz)
                    </label>
                    <select
                      value={channel.speed}
                      onChange={(e) => handleChannelChange(channel.id, 'speed', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="2400">2400 MHz</option>
                      <option value="2666">2666 MHz</option>
                      <option value="3200">3200 MHz</option>
                      <option value="3600">3600 MHz</option>
                      <option value="4000">4000 MHz</option>
                      <option value="4800">4800 MHz</option>
                      <option value="5200">5200 MHz</option>
                      <option value="5600">5600 MHz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Operating Voltage (V)
                    </label>
                    <select
                      value={channel.voltage}
                      onChange={(e) => handleChannelChange(channel.id, 'voltage', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="1.1">1.1V</option>
                      <option value="1.2">1.2V</option>
                      <option value="1.35">1.35V</option>
                      <option value="1.5">1.5V</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Rank Configuration
                    </label>
                    <select
                      value={channel.rank}
                      onChange={(e) => handleChannelChange(channel.id, 'rank', e.target.value as '1' | '2' | '4')}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="1">Single Rank</option>
                      <option value="2">Dual Rank</option>
                      <option value="4">Quad Rank</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">ECC Support</span>
                    <button
                      onClick={() => handleChannelChange(channel.id, 'ecc', !channel.ecc)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        channel.ecc ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          channel.ecc ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-white text-sm font-medium mb-3">Timing Parameters</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          CAS Latency
                        </label>
                        <input
                          type="number"
                          value={channel.timing.cas}
                          onChange={(e) => handleTimingChange(channel.id, 'cas', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          RCD
                        </label>
                        <input
                          type="number"
                          value={channel.timing.rcd}
                          onChange={(e) => handleTimingChange(channel.id, 'rcd', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          RP
                        </label>
                        <input
                          type="number"
                          value={channel.timing.rp}
                          onChange={(e) => handleTimingChange(channel.id, 'rp', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          RAS
                        </label>
                        <input
                          type="number"
                          value={channel.timing.ras}
                          onChange={(e) => handleTimingChange(channel.id, 'ras', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white text-sm font-medium mb-3">Temperature Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Temperature Monitoring</span>
                        <button
                          onClick={() => handleTemperatureChange(channel.id, 'monitoring', !channel.temperature.monitoring)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            channel.temperature.monitoring ? 'bg-cyan-400' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              channel.temperature.monitoring ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Temperature Threshold (°C)
                        </label>
                        <input
                          type="number"
                          value={channel.temperature.threshold}
                          onChange={(e) => handleTemperatureChange(channel.id, 'threshold', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Thermal Throttling</span>
                        <button
                          onClick={() => handleTemperatureChange(channel.id, 'throttling', !channel.temperature.throttling)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            channel.temperature.throttling ? 'bg-cyan-400' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              channel.temperature.throttling ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white text-sm font-medium mb-3">Module Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          value={channel.manufacturer}
                          onChange={(e) => handleChannelChange(channel.id, 'manufacturer', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Part Number
                        </label>
                        <input
                          type="text"
                          value={channel.partNumber}
                          onChange={(e) => handleChannelChange(channel.id, 'partNumber', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Serial Number
                        </label>
                        <input
                          type="text"
                          value={channel.serialNumber}
                          onChange={(e) => handleChannelChange(channel.id, 'serialNumber', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

export default LPDDR5SettingsPopup;