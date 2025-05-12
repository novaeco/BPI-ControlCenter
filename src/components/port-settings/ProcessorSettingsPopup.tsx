import React, { useState } from 'react';
import { X, Save, Cpu, Activity } from 'lucide-react';

interface ProcessorSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProcessorConfig {
  enabled: boolean;
  model: string;
  architecture: string;
  cores: string;
  threads: string;
  baseFrequency: string;
  boostFrequency: string;
  cache: {
    l1: string;
    l2: string;
    l3: string;
  };
  tdp: string;
  voltage: {
    core: string;
    memory: string;
  };
  powerState: 'performance' | 'balanced' | 'powersave';
  features: {
    virtualization: boolean;
    hyperthreading: boolean;
    turboBoost: boolean;
    ecc: boolean;
  };
  thermals: {
    monitoring: boolean;
    maxTemp: string;
    fanControl: boolean;
    throttling: boolean;
  };
  memory: {
    type: string;
    maxFrequency: string;
    channels: string;
    maxCapacity: string;
  };
  security: {
    secureBootEnabled: boolean;
    tpmEnabled: boolean;
    debuggingEnabled: boolean;
  };
}

const ProcessorSettingsPopup: React.FC<ProcessorSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<ProcessorConfig>({
    enabled: true,
    model: 'ARM Cortex-A72',
    architecture: 'ARMv8-A',
    cores: '4',
    threads: '8',
    baseFrequency: '1800',
    boostFrequency: '2400',
    cache: {
      l1: '32',
      l2: '256',
      l3: '2048'
    },
    tdp: '15',
    voltage: {
      core: '1.2',
      memory: '1.1'
    },
    powerState: 'balanced',
    features: {
      virtualization: true,
      hyperthreading: true,
      turboBoost: true,
      ecc: true
    },
    thermals: {
      monitoring: true,
      maxTemp: '85',
      fanControl: true,
      throttling: true
    },
    memory: {
      type: 'LPDDR5',
      maxFrequency: '6400',
      channels: '4',
      maxCapacity: '32'
    },
    security: {
      secureBootEnabled: true,
      tpmEnabled: true,
      debuggingEnabled: false
    }
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof ProcessorConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCacheChange = (field: keyof ProcessorConfig['cache'], value: string) => {
    setConfig(prev => ({
      ...prev,
      cache: {
        ...prev.cache,
        [field]: value
      }
    }));
  };

  const handleVoltageChange = (field: keyof ProcessorConfig['voltage'], value: string) => {
    setConfig(prev => ({
      ...prev,
      voltage: {
        ...prev.voltage,
        [field]: value
      }
    }));
  };

  const handleFeatureChange = (field: keyof ProcessorConfig['features'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
  };

  const handleThermalChange = (field: keyof ProcessorConfig['thermals'], value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      thermals: {
        ...prev.thermals,
        [field]: value
      }
    }));
  };

  const handleMemoryChange = (field: keyof ProcessorConfig['memory'], value: string) => {
    setConfig(prev => ({
      ...prev,
      memory: {
        ...prev.memory,
        [field]: value
      }
    }));
  };

  const handleSecurityChange = (field: keyof ProcessorConfig['security'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving processor configuration:', config);
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
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Processor Configuration</h2>
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
                  <span className="text-white text-sm">Enable Processor</span>
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
                    Processor Model
                  </label>
                  <select
                    value={config.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ARM Cortex-A72">ARM Cortex-A72</option>
                    <option value="ARM Cortex-A76">ARM Cortex-A76</option>
                    <option value="ARM Cortex-A78">ARM Cortex-A78</option>
                    <option value="ARM Cortex-X1">ARM Cortex-X1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Architecture
                  </label>
                  <select
                    value={config.architecture}
                    onChange={(e) => handleChange('architecture', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ARMv8-A">ARMv8-A</option>
                    <option value="ARMv8.2-A">ARMv8.2-A</option>
                    <option value="ARMv8.4-A">ARMv8.4-A</option>
                    <option value="ARMv9-A">ARMv9-A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Number of Cores
                  </label>
                  <select
                    value={config.cores}
                    onChange={(e) => handleChange('cores', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="2">2 Cores</option>
                    <option value="4">4 Cores</option>
                    <option value="6">6 Cores</option>
                    <option value="8">8 Cores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Number of Threads
                  </label>
                  <select
                    value={config.threads}
                    onChange={(e) => handleChange('threads', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="2">2 Threads</option>
                    <option value="4">4 Threads</option>
                    <option value="8">8 Threads</option>
                    <option value="16">16 Threads</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Performance Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Base Frequency (MHz)
                  </label>
                  <input
                    type="number"
                    value={config.baseFrequency}
                    onChange={(e) => handleChange('baseFrequency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Boost Frequency (MHz)
                  </label>
                  <input
                    type="number"
                    value={config.boostFrequency}
                    onChange={(e) => handleChange('boostFrequency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Power State
                  </label>
                  <select
                    value={config.powerState}
                    onChange={(e) => handleChange('powerState', e.target.value as 'performance' | 'balanced' | 'powersave')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="performance">Performance</option>
                    <option value="balanced">Balanced</option>
                    <option value="powersave">Power Save</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    TDP (W)
                  </label>
                  <input
                    type="number"
                    value={config.tdp}
                    onChange={(e) => handleChange('tdp', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Cache Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    L1 Cache (KB)
                  </label>
                  <input
                    type="number"
                    value={config.cache.l1}
                    onChange={(e) => handleCacheChange('l1', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    L2 Cache (KB)
                  </label>
                  <input
                    type="number"
                    value={config.cache.l2}
                    onChange={(e) => handleCacheChange('l2', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    L3 Cache (KB)
                  </label>
                  <input
                    type="number"
                    value={config.cache.l3}
                    onChange={(e) => handleCacheChange('l3', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Voltage Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Core Voltage (V)
                  </label>
                  <input
                    type="number"
                    value={config.voltage.core}
                    onChange={(e) => handleVoltageChange('core', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Memory Controller Voltage (V)
                  </label>
                  <input
                    type="number"
                    value={config.voltage.memory}
                    onChange={(e) => handleVoltageChange('memory', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Memory Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Memory Type
                  </label>
                  <select
                    value={config.memory.type}
                    onChange={(e) => handleMemoryChange('type', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="DDR4">DDR4</option>
                    <option value="LPDDR4X">LPDDR4X</option>
                    <option value="LPDDR5">LPDDR5</option>
                    <option value="LPDDR5X">LPDDR5X</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Memory Frequency (MHz)
                  </label>
                  <input
                    type="number"
                    value={config.memory.maxFrequency}
                    onChange={(e) => handleMemoryChange('maxFrequency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Memory Channels
                  </label>
                  <select
                    value={config.memory.channels}
                    onChange={(e) => handleMemoryChange('channels', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">Single Channel</option>
                    <option value="2">Dual Channel</option>
                    <option value="4">Quad Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Memory Capacity (GB)
                  </label>
                  <input
                    type="number"
                    value={config.memory.maxCapacity}
                    onChange={(e) => handleMemoryChange('maxCapacity', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Virtualization</span>
                  <button
                    onClick={() => handleFeatureChange('virtualization', !config.features.virtualization)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.features.virtualization ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.features.virtualization ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Hyper-Threading</span>
                  <button
                    onClick={() => handleFeatureChange('hyperthreading', !config.features.hyperthreading)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.features.hyperthreading ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.features.hyperthreading ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Turbo Boost</span>
                  <button
                    onClick={() => handleFeatureChange('turboBoost', !config.features.turboBoost)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.features.turboBoost ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.features.turboBoost ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">ECC Support</span>
                  <button
                    onClick={() => handleFeatureChange('ecc', !config.features.ecc)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.features.ecc ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.features.ecc ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Thermal Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Temperature Monitoring</span>
                  <button
                    onClick={() => handleThermalChange('monitoring', !config.thermals.monitoring)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.thermals.monitoring ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.thermals.monitoring ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={config.thermals.maxTemp}
                    onChange={(e) => handleThermalChange('maxTemp', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Fan Control</span>
                  <button
                    onClick={() => handleThermalChange('fanControl', !config.thermals.fanControl)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.thermals.fanControl ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.thermals.fanControl ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Thermal Throttling</span>
                  <button
                    onClick={() => handleThermalChange('throttling', !config.thermals.throttling)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.thermals.throttling ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.thermals.throttling ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Security Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Secure Boot</span>
                  <button
                    onClick={() => handleSecurityChange('secureBootEnabled', !config.security.secureBootEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.secureBootEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.secureBootEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">TPM</span>
                  <button
                    onClick={() => handleSecurityChange('tpmEnabled', !config.security.tpmEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.tpmEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.tpmEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Debug Mode</span>
                  <button
                    onClick={() => handleSecurityChange('debuggingEnabled', !config.security.debuggingEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.debuggingEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.debuggingEnabled ? 'translate-x-5' : 'translate-x-1'
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

export default ProcessorSettingsPopup;