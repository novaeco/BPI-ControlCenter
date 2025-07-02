import React, { useState } from 'react';
import { X, Save, HardDrive, Activity } from 'lucide-react';

interface NVMePCIeSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NVMePCIeConfig {
  enabled: boolean;
  pcieLanes: '1' | '2' | '4' | '8' | '16';
  pcieGeneration: '3.0' | '4.0' | '5.0';
  maxSpeed: string;
  powerState: 'active' | 'idle' | 'sleep';
  maxQueueDepth: string;
  maxTransferSize: string;
  msi: boolean;
  msix: boolean;
  smartMonitoring: boolean;
  trimEnabled: boolean;
  namespaces: string;
  asyncMode: boolean;
  thermalThrottling: boolean;
  errorRecovery: boolean;
  performance: {
    readSpeed: string;
    writeSpeed: string;
    iops: string;
    latency: string;
  };
}

const NVMePCIeSettingsPopup: React.FC<NVMePCIeSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<NVMePCIeConfig>({
    enabled: true,
    pcieLanes: '4',
    pcieGeneration: '4.0',
    maxSpeed: '64.0',
    powerState: 'active',
    maxQueueDepth: '1024',
    maxTransferSize: '512',
    msi: true,
    msix: true,
    smartMonitoring: true,
    trimEnabled: true,
    namespaces: '1',
    asyncMode: true,
    thermalThrottling: true,
    errorRecovery: true,
    performance: {
      readSpeed: '7000',
      writeSpeed: '5000',
      iops: '1000000',
      latency: '10'
    }
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof NVMePCIeConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePerformanceChange = (field: keyof NVMePCIeConfig['performance'], value: string) => {
    setConfig(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving NVMe PCIe configuration:', config);
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
            <HardDrive className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">NVMe/PCIe Configuration</h2>
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
                  <span className="text-white text-sm">Enable NVMe/PCIe</span>
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
                    PCIe Lanes
                  </label>
                  <select
                    value={config.pcieLanes}
                    onChange={(e) => handleChange('pcieLanes', e.target.value as '1' | '2' | '4' | '8' | '16')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">x1</option>
                    <option value="2">x2</option>
                    <option value="4">x4</option>
                    <option value="8">x8</option>
                    <option value="16">x16</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    PCIe Generation
                  </label>
                  <select
                    value={config.pcieGeneration}
                    onChange={(e) => handleChange('pcieGeneration', e.target.value as '3.0' | '4.0' | '5.0')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="3.0">Gen 3.0 (8.0 GT/s)</option>
                    <option value="4.0">Gen 4.0 (16.0 GT/s)</option>
                    <option value="5.0">Gen 5.0 (32.0 GT/s)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Speed (GB/s)
                  </label>
                  <input
                    type="number"
                    value={config.maxSpeed}
                    onChange={(e) => handleChange('maxSpeed', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Queue Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Queue Depth
                  </label>
                  <input
                    type="number"
                    value={config.maxQueueDepth}
                    onChange={(e) => handleChange('maxQueueDepth', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Max Transfer Size (KB)
                  </label>
                  <input
                    type="number"
                    value={config.maxTransferSize}
                    onChange={(e) => handleChange('maxTransferSize', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Namespaces
                  </label>
                  <input
                    type="number"
                    value={config.namespaces}
                    onChange={(e) => handleChange('namespaces', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Read Speed (MB/s)
                  </label>
                  <input
                    type="number"
                    value={config.performance.readSpeed}
                    onChange={(e) => handlePerformanceChange('readSpeed', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Write Speed (MB/s)
                  </label>
                  <input
                    type="number"
                    value={config.performance.writeSpeed}
                    onChange={(e) => handlePerformanceChange('writeSpeed', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    IOPS
                  </label>
                  <input
                    type="number"
                    value={config.performance.iops}
                    onChange={(e) => handlePerformanceChange('iops', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Latency (μs)
                  </label>
                  <input
                    type="number"
                    value={config.performance.latency}
                    onChange={(e) => handlePerformanceChange('latency', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Advanced Features</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Power State
                  </label>
                  <select
                    value={config.powerState}
                    onChange={(e) => handleChange('powerState', e.target.value as 'active' | 'idle' | 'sleep')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">MSI Support</span>
                  <button
                    onClick={() => handleChange('msi', !config.msi)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.msi ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.msi ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">MSI-X Support</span>
                  <button
                    onClick={() => handleChange('msix', !config.msix)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.msix ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.msix ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">SMART Monitoring</span>
                  <button
                    onClick={() => handleChange('smartMonitoring', !config.smartMonitoring)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.smartMonitoring ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.smartMonitoring ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">TRIM Support</span>
                  <button
                    onClick={() => handleChange('trimEnabled', !config.trimEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.trimEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.trimEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Async Mode</span>
                  <button
                    onClick={() => handleChange('asyncMode', !config.asyncMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.asyncMode ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.asyncMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Thermal Throttling</span>
                  <button
                    onClick={() => handleChange('thermalThrottling', !config.thermalThrottling)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.thermalThrottling ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.thermalThrottling ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Error Recovery</span>
                  <button
                    onClick={() => handleChange('errorRecovery', !config.errorRecovery)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorRecovery ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorRecovery ? 'translate-x-5' : 'translate-x-1'
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

export default NVMePCIeSettingsPopup;