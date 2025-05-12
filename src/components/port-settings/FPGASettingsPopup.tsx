import React, { useState } from 'react';
import { X, Save, Microwave as Microchip, Activity } from 'lucide-react';

interface FPGASettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FPGAConfig {
  enabled: boolean;
  deviceFamily: string;
  clockFrequency: string;
  voltage: {
    core: string;
    io: string;
    aux: string;
  };
  powerMode: 'normal' | 'lowPower' | 'standby';
  jtag: {
    enabled: boolean;
    frequency: string;
    chain: string;
  };
  configuration: {
    mode: 'master' | 'slave';
    interface: 'serial' | 'parallel';
    bitstream: string;
    compression: boolean;
    encryption: boolean;
    authentication: boolean;
  };
  resources: {
    luts: string;
    flipFlops: string;
    brams: string;
    dsps: string;
    plls: string;
  };
  thermalMonitoring: boolean;
  errorDetection: boolean;
  partialReconfiguration: boolean;
  debugEnabled: boolean;
}

const FPGASettingsPopup: React.FC<FPGASettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<FPGAConfig>({
    enabled: true,
    deviceFamily: 'Artix-7',
    clockFrequency: '100',
    voltage: {
      core: '1.0',
      io: '3.3',
      aux: '1.8'
    },
    powerMode: 'normal',
    jtag: {
      enabled: true,
      frequency: '10',
      chain: '1'
    },
    configuration: {
      mode: 'master',
      interface: 'serial',
      bitstream: 'default.bit',
      compression: true,
      encryption: false,
      authentication: true
    },
    resources: {
      luts: '53200',
      flipFlops: '106400',
      brams: '140',
      dsps: '220',
      plls: '6'
    },
    thermalMonitoring: true,
    errorDetection: true,
    partialReconfiguration: false,
    debugEnabled: true
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof FPGAConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVoltageChange = (field: keyof FPGAConfig['voltage'], value: string) => {
    setConfig(prev => ({
      ...prev,
      voltage: {
        ...prev.voltage,
        [field]: value
      }
    }));
  };

  const handleJtagChange = (field: keyof FPGAConfig['jtag'], value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      jtag: {
        ...prev.jtag,
        [field]: value
      }
    }));
  };

  const handleConfigurationChange = (field: keyof FPGAConfig['configuration'], value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [field]: value
      }
    }));
  };

  const handleResourceChange = (field: keyof FPGAConfig['resources'], value: string) => {
    setConfig(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving FPGA configuration:', config);
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
            <Microchip className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">FPGA Configuration</h2>
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
                  <span className="text-white text-sm">Enable FPGA</span>
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
                    Device Family
                  </label>
                  <select
                    value={config.deviceFamily}
                    onChange={(e) => handleChange('deviceFamily', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Artix-7">Artix-7</option>
                    <option value="Kintex-7">Kintex-7</option>
                    <option value="Virtex-7">Virtex-7</option>
                    <option value="Spartan-7">Spartan-7</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Clock Frequency (MHz)
                  </label>
                  <input
                    type="number"
                    value={config.clockFrequency}
                    onChange={(e) => handleChange('clockFrequency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Power Mode
                  </label>
                  <select
                    value={config.powerMode}
                    onChange={(e) => handleChange('powerMode', e.target.value as 'normal' | 'lowPower' | 'standby')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="normal">Normal</option>
                    <option value="lowPower">Low Power</option>
                    <option value="standby">Standby</option>
                  </select>
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
                    I/O Voltage (V)
                  </label>
                  <input
                    type="number"
                    value={config.voltage.io}
                    onChange={(e) => handleVoltageChange('io', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Auxiliary Voltage (V)
                  </label>
                  <input
                    type="number"
                    value={config.voltage.aux}
                    onChange={(e) => handleVoltageChange('aux', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">JTAG Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable JTAG</span>
                  <button
                    onClick={() => handleJtagChange('enabled', !config.jtag.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.jtag.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.jtag.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    JTAG Frequency (MHz)
                  </label>
                  <input
                    type="number"
                    value={config.jtag.frequency}
                    onChange={(e) => handleJtagChange('frequency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    JTAG Chain Position
                  </label>
                  <input
                    type="number"
                    value={config.jtag.chain}
                    onChange={(e) => handleJtagChange('chain', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Configuration Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Configuration Mode
                  </label>
                  <select
                    value={config.configuration.mode}
                    onChange={(e) => handleConfigurationChange('mode', e.target.value as 'master' | 'slave')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="master">Master</option>
                    <option value="slave">Slave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Configuration Interface
                  </label>
                  <select
                    value={config.configuration.interface}
                    onChange={(e) => handleConfigurationChange('interface', e.target.value as 'serial' | 'parallel')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="serial">Serial</option>
                    <option value="parallel">Parallel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bitstream File
                  </label>
                  <input
                    type="text"
                    value={config.configuration.bitstream}
                    onChange={(e) => handleConfigurationChange('bitstream', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bitstream Compression</span>
                  <button
                    onClick={() => handleConfigurationChange('compression', !config.configuration.compression)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.configuration.compression ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.configuration.compression ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bitstream Encryption</span>
                  <button
                    onClick={() => handleConfigurationChange('encryption', !config.configuration.encryption)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.configuration.encryption ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.configuration.encryption ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bitstream Authentication</span>
                  <button
                    onClick={() => handleConfigurationChange('authentication', !config.configuration.authentication)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.configuration.authentication ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.configuration.authentication ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Resource Utilization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    LUTs
                  </label>
                  <input
                    type="number"
                    value={config.resources.luts}
                    onChange={(e) => handleResourceChange('luts', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Flip-Flops
                  </label>
                  <input
                    type="number"
                    value={config.resources.flipFlops}
                    onChange={(e) => handleResourceChange('flipFlops', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Block RAMs
                  </label>
                  <input
                    type="number"
                    value={config.resources.brams}
                    onChange={(e) => handleResourceChange('brams', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    DSP Slices
                  </label>
                  <input
                    type="number"
                    value={config.resources.dsps}
                    onChange={(e) => handleResourceChange('dsps', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    PLLs
                  </label>
                  <input
                    type="number"
                    value={config.resources.plls}
                    onChange={(e) => handleResourceChange('plls', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Advanced Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Thermal Monitoring</span>
                  <button
                    onClick={() => handleChange('thermalMonitoring', !config.thermalMonitoring)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.thermalMonitoring ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.thermalMonitoring ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Error Detection</span>
                  <button
                    onClick={() => handleChange('errorDetection', !config.errorDetection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorDetection ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorDetection ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Partial Reconfiguration</span>
                  <button
                    onClick={() => handleChange('partialReconfiguration', !config.partialReconfiguration)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.partialReconfiguration ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.partialReconfiguration ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Debug Mode</span>
                  <button
                    onClick={() => handleChange('debugEnabled', !config.debugEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.debugEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.debugEnabled ? 'translate-x-5' : 'translate-x-1'
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

export default FPGASettingsPopup;