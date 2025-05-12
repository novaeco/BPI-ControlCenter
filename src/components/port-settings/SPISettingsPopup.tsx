import React, { useState } from 'react';
import { X, Save, Cpu } from 'lucide-react';

interface SPISettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SPIConfig {
  device: string;
  mode: string;
  speed: string;
  bitsPerWord: string;
  chipSelect: string;
  lsbFirst: boolean;
  threeWire: boolean;
  loopback: boolean;
}

const SPISettingsPopup: React.FC<SPISettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SPIConfig>({
    device: '/dev/spidev0.0',
    mode: '0',
    speed: '1000000',
    bitsPerWord: '8',
    chipSelect: '0',
    lsbFirst: false,
    threeWire: false,
    loopback: false
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof SPIConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving SPI configuration:', config);
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
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">SPI Configuration</h2>
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
                SPI Device
              </label>
              <input
                type="text"
                value={config.device}
                onChange={(e) => handleChange('device', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Mode
              </label>
              <select
                value={config.mode}
                onChange={(e) => handleChange('mode', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="0">Mode 0 (CPOL=0, CPHA=0)</option>
                <option value="1">Mode 1 (CPOL=0, CPHA=1)</option>
                <option value="2">Mode 2 (CPOL=1, CPHA=0)</option>
                <option value="3">Mode 3 (CPOL=1, CPHA=1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Speed (Hz)
              </label>
              <select
                value={config.speed}
                onChange={(e) => handleChange('speed', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="500000">500 kHz</option>
                <option value="1000000">1 MHz</option>
                <option value="2000000">2 MHz</option>
                <option value="4000000">4 MHz</option>
                <option value="8000000">8 MHz</option>
                <option value="16000000">16 MHz</option>
                <option value="32000000">32 MHz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bits per Word
              </label>
              <select
                value={config.bitsPerWord}
                onChange={(e) => handleChange('bitsPerWord', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="8">8 bits</option>
                <option value="16">16 bits</option>
                <option value="32">32 bits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Chip Select
              </label>
              <select
                value={config.chipSelect}
                onChange={(e) => handleChange('chipSelect', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="0">CS0</option>
                <option value="1">CS1</option>
                <option value="2">CS2</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">LSB First</span>
                <button
                  onClick={() => handleChange('lsbFirst', !config.lsbFirst)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.lsbFirst ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.lsbFirst ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">3-Wire Mode</span>
                <button
                  onClick={() => handleChange('threeWire', !config.threeWire)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.threeWire ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.threeWire ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Loopback Mode</span>
                <button
                  onClick={() => handleChange('loopback', !config.loopback)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.loopback ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.loopback ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
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

export default SPISettingsPopup;