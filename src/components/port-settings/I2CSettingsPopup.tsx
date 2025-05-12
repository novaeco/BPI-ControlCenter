import React, { useState } from 'react';
import { X, Save, BrainCircuit } from 'lucide-react';

interface I2CSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface I2CConfig {
  bus: string;
  address: string;
  speed: string;
  pullUp: boolean;
  tenBit: boolean;
}

const I2CSettingsPopup: React.FC<I2CSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<I2CConfig>({
    bus: '/dev/i2c-1',
    address: '0x48',
    speed: '100000',
    pullUp: true,
    tenBit: false
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof I2CConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving I2C configuration:', config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-md rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">I2C Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                I2C Bus
              </label>
              <input
                type="text"
                value={config.bus}
                onChange={(e) => handleChange('bus', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Device Address
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                placeholder="0x48"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bus Speed (Hz)
              </label>
              <select
                value={config.speed}
                onChange={(e) => handleChange('speed', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="100000">100 kHz (Standard Mode)</option>
                <option value="400000">400 kHz (Fast Mode)</option>
                <option value="1000000">1 MHz (Fast Mode Plus)</option>
                <option value="3400000">3.4 MHz (High Speed Mode)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Internal Pull-up Resistors</span>
              <button
                onClick={() => handleChange('pullUp', !config.pullUp)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  config.pullUp ? 'bg-cyan-400' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    config.pullUp ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">10-bit Addressing Mode</span>
              <button
                onClick={() => handleChange('tenBit', !config.tenBit)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  config.tenBit ? 'bg-cyan-400' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    config.tenBit ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
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

export default I2CSettingsPopup;