import React, { useState } from 'react';
import { X, Save, Monitor } from 'lucide-react';

interface HDMISettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HDMIConfig {
  enabled: boolean;
  resolution: string;
  refreshRate: string;
  colorDepth: string;
  hdcp: boolean;
  audioEnabled: boolean;
  audioFormat: string;
  edid: string;
  hotplugDetect: boolean;
  cec: boolean;
  hdr: boolean;
}

const HDMISettingsPopup: React.FC<HDMISettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<HDMIConfig>({
    enabled: true,
    resolution: '1920x1080',
    refreshRate: '60',
    colorDepth: '24',
    hdcp: true,
    audioEnabled: true,
    audioFormat: 'auto',
    edid: 'default',
    hotplugDetect: true,
    cec: true,
    hdr: false
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof HDMIConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving HDMI configuration:', config);
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
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">HDMI Configuration</h2>
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
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Enable HDMI</span>
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
                Resolution
              </label>
              <select
                value={config.resolution}
                onChange={(e) => handleChange('resolution', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="3840x2160">4K (3840x2160)</option>
                <option value="2560x1440">2K (2560x1440)</option>
                <option value="1920x1080">Full HD (1920x1080)</option>
                <option value="1280x720">HD (1280x720)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Refresh Rate (Hz)
              </label>
              <select
                value={config.refreshRate}
                onChange={(e) => handleChange('refreshRate', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="30">30 Hz</option>
                <option value="50">50 Hz</option>
                <option value="60">60 Hz</option>
                <option value="75">75 Hz</option>
                <option value="120">120 Hz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Color Depth
              </label>
              <select
                value={config.colorDepth}
                onChange={(e) => handleChange('colorDepth', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="24">24-bit (8-bit per channel)</option>
                <option value="30">30-bit (10-bit per channel)</option>
                <option value="36">36-bit (12-bit per channel)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Audio Format
              </label>
              <select
                value={config.audioFormat}
                onChange={(e) => handleChange('audioFormat', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                disabled={!config.audioEnabled}
              >
                <option value="auto">Auto Detect</option>
                <option value="pcm">PCM</option>
                <option value="dolby">Dolby Digital</option>
                <option value="dts">DTS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                EDID Mode
              </label>
              <select
                value={config.edid}
                onChange={(e) => handleChange('edid', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="default">Default</option>
                <option value="custom">Custom</option>
                <option value="passthrough">Passthrough</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">HDCP</span>
                <button
                  onClick={() => handleChange('hdcp', !config.hdcp)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.hdcp ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.hdcp ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Audio</span>
                <button
                  onClick={() => handleChange('audioEnabled', !config.audioEnabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.audioEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.audioEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Hot-plug Detect</span>
                <button
                  onClick={() => handleChange('hotplugDetect', !config.hotplugDetect)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.hotplugDetect ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.hotplugDetect ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">CEC</span>
                <button
                  onClick={() => handleChange('cec', !config.cec)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.cec ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.cec ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">HDR</span>
                <button
                  onClick={() => handleChange('hdr', !config.hdr)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.hdr ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.hdr ? 'translate-x-5' : 'translate-x-1'
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

export default HDMISettingsPopup;