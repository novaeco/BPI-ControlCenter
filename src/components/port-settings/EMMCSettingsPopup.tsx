import React, { useState } from 'react';
import { X, Save, HardDrive } from 'lucide-react';

interface EMMCSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EMMCConfig {
  enabled: boolean;
  version: string;
  capacity: string;
  busWidth: '1' | '4' | '8';
  speed: {
    mode: 'hs200' | 'hs400' | 'legacy';
    clockRate: string;
  };
  partition: {
    enabled: boolean;
    count: string;
    table: 'gpt' | 'mbr';
  };
  performance: {
    readCacheEnabled: boolean;
    writeCacheEnabled: boolean;
    trimEnabled: boolean;
    sanitizeEnabled: boolean;
  };
  reliability: {
    errorCorrection: boolean;
    badBlockManagement: boolean;
    wearLeveling: boolean;
    powerLossProtection: boolean;
  };
  security: {
    secureErase: boolean;
    passwordProtection: boolean;
    hardwareEncryption: boolean;
  };
}

const EMMCSettingsPopup: React.FC<EMMCSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<EMMCConfig>({
    enabled: true,
    version: '5.1',
    capacity: '64',
    busWidth: '8',
    speed: {
      mode: 'hs400',
      clockRate: '200'
    },
    partition: {
      enabled: true,
      count: '2',
      table: 'gpt'
    },
    performance: {
      readCacheEnabled: true,
      writeCacheEnabled: true,
      trimEnabled: true,
      sanitizeEnabled: true
    },
    reliability: {
      errorCorrection: true,
      badBlockManagement: true,
      wearLeveling: true,
      powerLossProtection: true
    },
    security: {
      secureErase: true,
      passwordProtection: false,
      hardwareEncryption: true
    }
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof EMMCConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpeedChange = (field: keyof EMMCConfig['speed'], value: string) => {
    setConfig(prev => ({
      ...prev,
      speed: {
        ...prev.speed,
        [field]: value
      }
    }));
  };

  const handlePartitionChange = (field: keyof EMMCConfig['partition'], value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      partition: {
        ...prev.partition,
        [field]: value
      }
    }));
  };

  const handlePerformanceChange = (field: keyof EMMCConfig['performance'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        [field]: value
      }
    }));
  };

  const handleReliabilityChange = (field: keyof EMMCConfig['reliability'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      reliability: {
        ...prev.reliability,
        [field]: value
      }
    }));
  };

  const handleSecurityChange = (field: keyof EMMCConfig['security'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving eMMC configuration:', config);
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
            <h2 className="text-xl font-bold text-cyan-400">eMMC Configuration</h2>
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
                  <span className="text-white text-sm">Enable eMMC</span>
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
                    eMMC Version
                  </label>
                  <select
                    value={config.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="4.5">eMMC v4.5</option>
                    <option value="5.0">eMMC v5.0</option>
                    <option value="5.1">eMMC v5.1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Capacity (GB)
                  </label>
                  <select
                    value={config.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bus Width
                  </label>
                  <select
                    value={config.busWidth}
                    onChange={(e) => handleChange('busWidth', e.target.value as '1' | '4' | '8')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">1-bit</option>
                    <option value="4">4-bit</option>
                    <option value="8">8-bit</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Speed Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Speed Mode
                  </label>
                  <select
                    value={config.speed.mode}
                    onChange={(e) => handleSpeedChange('mode', e.target.value as 'hs200' | 'hs400' | 'legacy')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="legacy">Legacy</option>
                    <option value="hs200">HS200</option>
                    <option value="hs400">HS400</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Clock Rate (MHz)
                  </label>
                  <select
                    value={config.speed.clockRate}
                    onChange={(e) => handleSpeedChange('clockRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="26">26 MHz</option>
                    <option value="52">52 MHz</option>
                    <option value="100">100 MHz</option>
                    <option value="200">200 MHz</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Partition Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable Partitioning</span>
                  <button
                    onClick={() => handlePartitionChange('enabled', !config.partition.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.partition.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.partition.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Number of Partitions
                  </label>
                  <select
                    value={config.partition.count}
                    onChange={(e) => handlePartitionChange('count', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={!config.partition.enabled}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Partition Table
                  </label>
                  <select
                    value={config.partition.table}
                    onChange={(e) => handlePartitionChange('table', e.target.value as 'gpt' | 'mbr')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    disabled={!config.partition.enabled}
                  >
                    <option value="gpt">GPT</option>
                    <option value="mbr">MBR</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Performance Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Read Cache</span>
                  <button
                    onClick={() => handlePerformanceChange('readCacheEnabled', !config.performance.readCacheEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.performance.readCacheEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.performance.readCacheEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Write Cache</span>
                  <button
                    onClick={() => handlePerformanceChange('writeCacheEnabled', !config.performance.writeCacheEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.performance.writeCacheEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.performance.writeCacheEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">TRIM Support</span>
                  <button
                    onClick={() => handlePerformanceChange('trimEnabled', !config.performance.trimEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.performance.trimEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.performance.trimEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Sanitize</span>
                  <button
                    onClick={() => handlePerformanceChange('sanitizeEnabled', !config.performance.sanitizeEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.performance.sanitizeEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.performance.sanitizeEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Reliability Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Error Correction</span>
                  <button
                    onClick={() => handleReliabilityChange('errorCorrection', !config.reliability.errorCorrection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.reliability.errorCorrection ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.reliability.errorCorrection ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bad Block Management</span>
                  <button
                    onClick={() => handleReliabilityChange('badBlockManagement', !config.reliability.badBlockManagement)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.reliability.badBlockManagement ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.reliability.badBlockManagement ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Wear Leveling</span>
                  <button
                    onClick={() => handleReliabilityChange('wearLeveling', !config.reliability.wearLeveling)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.reliability.wearLeveling ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.reliability.wearLeveling ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Power Loss Protection</span>
                  <button
                    onClick={() => handleReliabilityChange('powerLossProtection', !config.reliability.powerLossProtection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.reliability.powerLossProtection ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.reliability.powerLossProtection ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Secure Erase</span>
                  <button
                    onClick={() => handleSecurityChange('secureErase', !config.security.secureErase)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.secureErase ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.secureErase ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Password Protection</span>
                  <button
                    onClick={() => handleSecurityChange('passwordProtection', !config.security.passwordProtection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.passwordProtection ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.passwordProtection ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Hardware Encryption</span>
                  <button
                    onClick={() => handleSecurityChange('hardwareEncryption', !config.security.hardwareEncryption)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.security.hardwareEncryption ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.security.hardwareEncryption ? 'translate-x-5' : 'translate-x-1'
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

export default EMMCSettingsPopup;