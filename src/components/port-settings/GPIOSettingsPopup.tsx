import React, { useState } from 'react';
import { X, Save, Radio, ArrowDown, ArrowUp } from 'lucide-react';

interface GPIOSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GPIOPin {
  pin: number;
  mode: 'input' | 'output' | 'disabled';
  value: boolean;
  pullUp: boolean;
  label: string;
}

const GPIOSettingsPopup: React.FC<GPIOSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [pins, setPins] = useState<GPIOPin[]>(
    Array.from({ length: 52 }, (_, i) => ({
      pin: i + 1,
      mode: 'disabled',
      value: false,
      pullUp: false,
      label: `GPIO${i + 1}`
    }))
  );

  if (!isOpen) return null;

  const handlePinChange = (pin: number, field: keyof GPIOPin, value: string | boolean) => {
    setPins(prev => prev.map(p => {
      if (p.pin === pin) {
        return {
          ...p,
          [field]: value
        };
      }
      return p;
    }));
  };

  const handleSave = () => {
    console.log('Saving GPIO configuration:', pins);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-[90rem] rounded-lg shadow-xl border border-gray-700 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">GPIO Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {pins.map(pin => (
              <div
                key={pin.pin}
                className="bg-[#141e2a] rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${pin.value ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-white font-medium">{pin.label}</span>
                  </div>
                  <span className="text-gray-400 text-sm">Pin {pin.pin}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Mode
                    </label>
                    <select
                      value={pin.mode}
                      onChange={(e) => handlePinChange(pin.pin, 'mode', e.target.value as 'input' | 'output' | 'disabled')}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="disabled">Disabled</option>
                      <option value="input">Input</option>
                      <option value="output">Output</option>
                    </select>
                  </div>

                  {pin.mode !== 'disabled' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Pull-up Resistor</span>
                        <button
                          onClick={() => handlePinChange(pin.pin, 'pullUp', !pin.pullUp)}
                          disabled={pin.mode === 'disabled'}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            pin.pullUp ? 'bg-cyan-400' : 'bg-gray-600'
                          } ${pin.mode === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              pin.pullUp ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {pin.mode === 'output' && (
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm">Output Value</span>
                          <button
                            onClick={() => handlePinChange(pin.pin, 'value', !pin.value)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                              pin.value
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {pin.value ? (
                              <>
                                <ArrowUp className="w-4 h-4" />
                                HIGH
                              </>
                            ) : (
                              <>
                                <ArrowDown className="w-4 h-4" />
                                LOW
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={pin.label}
                      onChange={(e) => handlePinChange(pin.pin, 'label', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
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

export default GPIOSettingsPopup;