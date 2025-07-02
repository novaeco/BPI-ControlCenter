import React, { useState } from 'react';
import { X, Save, Monitor, Sun, Moon, Sliders, Eye, Palette } from 'lucide-react';

interface DisplaySettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisplaySettingsPopup: React.FC<DisplaySettingsPopupProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    brightness: '100',
    contrast: '100',
    saturation: '100',
    sharpness: '100',
    gamma: '100',
    colorTemp: '6500',
    nightLight: false,
    nightLightIntensity: '50',
    autoNightLight: true,
    nightLightSchedule: {
      start: '20:00',
      end: '06:00'
    },
    dataMode: false,
    motionBlur: true,
    animations: true,
    reducedMotion: false,
    resolution: '1920x1080',
    refreshRate: '60',
    scaling: '100',
    hdrEnabled: true
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof settings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (field: keyof typeof settings.nightLightSchedule, value: string) => {
    setSettings(prev => ({
      ...prev,
      nightLightSchedule: {
        ...prev.nightLightSchedule,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving display settings:', settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-xl rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Display Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-cyan-400" />
                Theme & Colors
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.brightness}
                    onChange={(e) => handleChange('brightness', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Contrast
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.contrast}
                    onChange={(e) => handleChange('contrast', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Color Temperature (K)
                  </label>
                  <select
                    value={settings.colorTemp}
                    onChange={(e) => handleChange('colorTemp', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="5000">5000K (Warm)</option>
                    <option value="6500">6500K (Neutral)</option>
                    <option value="7500">7500K (Cool)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-cyan-400" />
                Night Light
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Night Light</span>
                  <button
                    onClick={() => handleChange('nightLight', !settings.nightLight)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.nightLight ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.nightLight ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Intensity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.nightLightIntensity}
                    onChange={(e) => handleChange('nightLightIntensity', e.target.value)}
                    className="w-full"
                    disabled={!settings.nightLight}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Auto Schedule</span>
                  <button
                    onClick={() => handleChange('autoNightLight', !settings.autoNightLight)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.autoNightLight ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.autoNightLight ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.nightLightSchedule.start}
                      onChange={(e) => handleScheduleChange('start', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      disabled={!settings.nightLight || !settings.autoNightLight}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={settings.nightLightSchedule.end}
                      onChange={(e) => handleScheduleChange('end', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      disabled={!settings.nightLight || !settings.autoNightLight}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-cyan-400" />
                Visual Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Data Mode</span>
                  <button
                    onClick={() => handleChange('dataMode', !settings.dataMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.dataMode ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.dataMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Motion Blur</span>
                  <button
                    onClick={() => handleChange('motionBlur', !settings.motionBlur)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.motionBlur ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.motionBlur ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Animations</span>
                  <button
                    onClick={() => handleChange('animations', !settings.animations)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.animations ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.animations ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Reduced Motion</span>
                  <button
                    onClick={() => handleChange('reducedMotion', !settings.reducedMotion)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Resolution
                  </label>
                  <select
                    value={settings.resolution}
                    onChange={(e) => handleChange('resolution', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1920x1080">1920x1080 (Full HD)</option>
                    <option value="2560x1440">2560x1440 (2K)</option>
                    <option value="3840x2160">3840x2160 (4K)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Refresh Rate (Hz)
                  </label>
                  <select
                    value={settings.refreshRate}
                    onChange={(e) => handleChange('refreshRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="60">60 Hz</option>
                    <option value="75">75 Hz</option>
                    <option value="120">120 Hz</option>
                    <option value="144">144 Hz</option>
                    <option value="165">165 Hz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Display Scaling (%)
                  </label>
                  <select
                    value={settings.scaling}
                    onChange={(e) => handleChange('scaling', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="100">100%</option>
                    <option value="125">125%</option>
                    <option value="150">150%</option>
                    <option value="175">175%</option>
                    <option value="200">200%</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">HDR</span>
                  <button
                    onClick={() => handleChange('hdrEnabled', !settings.hdrEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.hdrEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.hdrEnabled ? 'translate-x-5' : 'translate-x-1'
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

export default DisplaySettingsPopup;