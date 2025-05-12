import React, { useState } from 'react';
import { X, Save, Terminal } from 'lucide-react';

interface SSHSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SSHConfig {
  host: string;
  port: string;
  username: string;
  authMethod: 'password' | 'key';
  keyPath: string;
  keepAlive: boolean;
  compression: boolean;
  forwardX11: boolean;
  timeout: string;
}

const SSHSettingsPopup: React.FC<SSHSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SSHConfig>({
    host: 'localhost',
    port: '22',
    username: 'root',
    authMethod: 'key',
    keyPath: '~/.ssh/id_rsa',
    keepAlive: true,
    compression: false,
    forwardX11: false,
    timeout: '30'
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof SSHConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving SSH configuration:', config);
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
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">SSH Configuration</h2>
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
                Host
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => handleChange('host', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

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
                Username
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Authentication Method
              </label>
              <select
                value={config.authMethod}
                onChange={(e) => handleChange('authMethod', e.target.value as 'password' | 'key')}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="password">Password</option>
                <option value="key">SSH Key</option>
              </select>
            </div>

            {config.authMethod === 'key' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Private Key Path
                </label>
                <input
                  type="text"
                  value={config.keyPath}
                  onChange={(e) => handleChange('keyPath', e.target.value)}
                  className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Connection Timeout (seconds)
              </label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => handleChange('timeout', e.target.value)}
                className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Keep Alive</span>
                <button
                  onClick={() => handleChange('keepAlive', !config.keepAlive)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.keepAlive ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.keepAlive ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Compression</span>
                <button
                  onClick={() => handleChange('compression', !config.compression)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.compression ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.compression ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">X11 Forwarding</span>
                <button
                  onClick={() => handleChange('forwardX11', !config.forwardX11)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.forwardX11 ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.forwardX11 ? 'translate-x-5' : 'translate-x-1'
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

export default SSHSettingsPopup;