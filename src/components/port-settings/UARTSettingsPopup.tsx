import React, { useState } from 'react';
import { X, Save, Cable } from 'lucide-react';

interface UARTSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UARTConfig {
  port: string;
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  flowControl: string;
}

const UARTSettingsPopup: React.FC<UARTSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<UARTConfig>({
    port: '/dev/ttyUSB0',
    baudRate: '115200',
    dataBits: '8',
    stopBits: '1',
    parity: 'none',
    flowControl: 'none'
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof UARTConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving UART configuration:', config);
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
            <Cable className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">UART Configuration</h2>
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
                Port
              </label>
              <input
                type="text"
                value={config.port}
                onChange={(e) => handleChange('port', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Baud Rate
              </label>
              <select
                value={config.baudRate}
                onChange={(e) => handleChange('baudRate', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="9600">9600</option>
                <option value="19200">19200</option>
                <option value="38400">38400</option>
                <option value="57600">57600</option>
                <option value="115200">115200</option>
                <option value="230400">230400</option>
                <option value="460800">460800</option>
                <option value="921600">921600</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Data Bits
              </label>
              <select
                value={config.dataBits}
                onChange={(e) => handleChange('dataBits', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Stop Bits
              </label>
              <select
                value={config.stopBits}
                onChange={(e) => handleChange('stopBits', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Parity
              </label>
              <select
                value={config.parity}
                onChange={(e) => handleChange('parity', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="none">None</option>
                <option value="even">Even</option>
                <option value="odd">Odd</option>
                <option value="mark">Mark</option>
                <option value="space">Space</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Flow Control
              </label>
              <select
                value={config.flowControl}
                onChange={(e) => handleChange('flowControl', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="none">None</option>
                <option value="hardware">Hardware (RTS/CTS)</option>
                <option value="software">Software (XON/XOFF)</option>
              </select>
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

export default UARTSettingsPopup;