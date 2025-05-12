import React, { useState } from 'react';
import { X, Save, Camera } from 'lucide-react';

interface MIPICSISettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MIPICSIConfig {
  enabled: boolean;
  lanes: '1' | '2' | '4';
  clockRate: string;
  dataFormat: string;
  resolution: string;
  frameRate: string;
  continuousMode: boolean;
  embeddedData: boolean;
  virtualChannels: string;
  dPhyTiming: {
    clockLpx: string;
    clockHs: string;
    dataLpx: string;
    dataHs: string;
  };
  powerMode: 'normal' | 'lowPower' | 'ultraLowPower';
  errorDetection: boolean;
  ecc: boolean;
  crc: boolean;
}

const MIPICSISettingsPopup: React.FC<MIPICSISettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<MIPICSIConfig>({
    enabled: true,
    lanes: '4',
    clockRate: '1000',
    dataFormat: 'RAW10',
    resolution: '1920x1080',
    frameRate: '60',
    continuousMode: true,
    embeddedData: false,
    virtualChannels: '1',
    dPhyTiming: {
      clockLpx: '50',
      clockHs: '100',
      dataLpx: '50',
      dataHs: '100'
    },
    powerMode: 'normal',
    errorDetection: true,
    ecc: true,
    crc: true
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof MIPICSIConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDPhyChange = (field: keyof MIPICSIConfig['dPhyTiming'], value: string) => {
    setConfig(prev => ({
      ...prev,
      dPhyTiming: {
        ...prev.dPhyTiming,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving MIPI CSI configuration:', config);
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
            <Camera className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">MIPI CSI Configuration</h2>
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
                  <span className="text-white text-sm">Enable MIPI CSI</span>
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
                    Number of Lanes
                  </label>
                  <select
                    value={config.lanes}
                    onChange={(e) => handleChange('lanes', e.target.value as '1' | '2' | '4')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">1 Lane</option>
                    <option value="2">2 Lanes</option>
                    <option value="4">4 Lanes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Clock Rate (MHz)
                  </label>
                  <select
                    value={config.clockRate}
                    onChange={(e) => handleChange('clockRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="500">500 MHz</option>
                    <option value="750">750 MHz</option>
                    <option value="1000">1000 MHz</option>
                    <option value="1500">1500 MHz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Virtual Channels
                  </label>
                  <select
                    value={config.virtualChannels}
                    onChange={(e) => handleChange('virtualChannels', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">1 Channel</option>
                    <option value="2">2 Channels</option>
                    <option value="4">4 Channels</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Image Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data Format
                  </label>
                  <select
                    value={config.dataFormat}
                    onChange={(e) => handleChange('dataFormat', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="RAW8">RAW8</option>
                    <option value="RAW10">RAW10</option>
                    <option value="RAW12">RAW12</option>
                    <option value="RAW14">RAW14</option>
                    <option value="RAW16">RAW16</option>
                    <option value="YUV422">YUV422</option>
                    <option value="RGB888">RGB888</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Resolution
                  </label>
                  <select
                    value={config.resolution}
                    onChange={(e) => handleChange('resolution', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="640x480">640x480</option>
                    <option value="1280x720">1280x720</option>
                    <option value="1920x1080">1920x1080</option>
                    <option value="2560x1440">2560x1440</option>
                    <option value="3840x2160">3840x2160</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Frame Rate (fps)
                  </label>
                  <select
                    value={config.frameRate}
                    onChange={(e) => handleChange('frameRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="15">15 fps</option>
                    <option value="30">30 fps</option>
                    <option value="60">60 fps</option>
                    <option value="120">120 fps</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">D-PHY Timing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Clock LPX (ns)
                  </label>
                  <input
                    type="number"
                    value={config.dPhyTiming.clockLpx}
                    onChange={(e) => handleDPhyChange('clockLpx', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Clock HS (ns)
                  </label>
                  <input
                    type="number"
                    value={config.dPhyTiming.clockHs}
                    onChange={(e) => handleDPhyChange('clockHs', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data LPX (ns)
                  </label>
                  <input
                    type="number"
                    value={config.dPhyTiming.dataLpx}
                    onChange={(e) => handleDPhyChange('dataLpx', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data HS (ns)
                  </label>
                  <input
                    type="number"
                    value={config.dPhyTiming.dataHs}
                    onChange={(e) => handleDPhyChange('dataHs', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Advanced Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Power Mode
                  </label>
                  <select
                    value={config.powerMode}
                    onChange={(e) => handleChange('powerMode', e.target.value as 'normal' | 'lowPower' | 'ultraLowPower')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="normal">Normal</option>
                    <option value="lowPower">Low Power</option>
                    <option value="ultraLowPower">Ultra Low Power</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Continuous Mode</span>
                  <button
                    onClick={() => handleChange('continuousMode', !config.continuousMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.continuousMode ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.continuousMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Embedded Data</span>
                  <button
                    onClick={() => handleChange('embeddedData', !config.embeddedData)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.embeddedData ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.embeddedData ? 'translate-x-5' : 'translate-x-1'
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
                  <span className="text-white text-sm">ECC</span>
                  <button
                    onClick={() => handleChange('ecc', !config.ecc)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.ecc ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.ecc ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">CRC</span>
                  <button
                    onClick={() => handleChange('crc', !config.crc)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.crc ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.crc ? 'translate-x-5' : 'translate-x-1'
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

export default MIPICSISettingsPopup;