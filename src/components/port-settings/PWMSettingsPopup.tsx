import React, { useState } from 'react';
import { X, Save, AudioWaveform as Waveform, Activity } from 'lucide-react';

interface PWMSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PWMChannel {
  id: string;
  name: string;
  enabled: boolean;
  frequency: number;
  dutyCycle: number;
  resolution: number;
  inverted: boolean;
  mode: 'single' | 'complementary';
  deadTime?: number;
}

const PWMSettingsPopup: React.FC<PWMSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [channels, setChannels] = useState<PWMChannel[]>([
    {
      id: 'pwm0',
      name: 'PWM Channel 0',
      enabled: true,
      frequency: 1000,
      dutyCycle: 50,
      resolution: 8,
      inverted: false,
      mode: 'single'
    },
    {
      id: 'pwm1',
      name: 'PWM Channel 1',
      enabled: false,
      frequency: 20000,
      dutyCycle: 75,
      resolution: 10,
      inverted: false,
      mode: 'complementary',
      deadTime: 100
    },
    {
      id: 'pwm2',
      name: 'PWM Channel 2',
      enabled: false,
      frequency: 50,
      dutyCycle: 25,
      resolution: 12,
      inverted: true,
      mode: 'single'
    }
  ]);

  if (!isOpen) return null;

  const handleChannelChange = (channelId: string, field: keyof PWMChannel, value: string | number | boolean) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          [field]: value
        };
      }
      return channel;
    }));
  };

  const handleSave = () => {
    console.log('Saving PWM configuration:', channels);
    onClose();
  };

  const getMaxDutyCycle = (resolution: number) => {
    return Math.pow(2, resolution) - 1;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-[90rem] rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Waveform className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">PWM Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map(channel => (
              <div
                key={channel.id}
                className="bg-[#141e2a] rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={channel.name}
                    onChange={(e) => handleChannelChange(channel.id, 'name', e.target.value)}
                    className="bg-transparent text-white font-medium border-b border-transparent hover:border-gray-700 focus:border-cyan-400 outline-none"
                  />
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Frequency (Hz)
                    </label>
                    <input
                      type="number"
                      value={channel.frequency}
                      onChange={(e) => handleChannelChange(channel.id, 'frequency', parseInt(e.target.value))}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      min="1"
                      max="1000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Resolution (bits)
                    </label>
                    <select
                      value={channel.resolution}
                      onChange={(e) => handleChannelChange(channel.id, 'resolution', parseInt(e.target.value))}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value={8}>8-bit (256 levels)</option>
                      <option value={10}>10-bit (1024 levels)</option>
                      <option value={12}>12-bit (4096 levels)</option>
                      <option value={16}>16-bit (65536 levels)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-400">
                        Duty Cycle
                      </label>
                      <span className="text-sm text-cyan-400">{channel.dutyCycle}%</span>
                    </div>
                    <input
                      type="range"
                      value={channel.dutyCycle}
                      onChange={(e) => handleChannelChange(channel.id, 'dutyCycle', parseInt(e.target.value))}
                      className="w-full"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Mode
                    </label>
                    <select
                      value={channel.mode}
                      onChange={(e) => handleChannelChange(channel.id, 'mode', e.target.value as 'single' | 'complementary')}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="single">Single-ended</option>
                      <option value="complementary">Complementary</option>
                    </select>
                  </div>

                  {channel.mode === 'complementary' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Dead Time (ns)
                      </label>
                      <input
                        type="number"
                        value={channel.deadTime}
                        onChange={(e) => handleChannelChange(channel.id, 'deadTime', parseInt(e.target.value))}
                        className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                        min="0"
                        max="1000"
                        step="10"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Invert Output</span>
                    <button
                      onClick={() => handleChannelChange(channel.id, 'inverted', !channel.inverted)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        channel.inverted ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          channel.inverted ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Max Resolution</span>
                      <span className="text-white">{getMaxDutyCycle(channel.resolution)} levels</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">Period</span>
                      <span className="text-white">{(1 / channel.frequency * 1000000).toFixed(2)} µs</span>
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

export default PWMSettingsPopup;