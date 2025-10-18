import React, { useCallback, useState } from 'react';
import {
  X,
  Save,
  Server,
  Globe,
  Lock,
  Database,
  Network,
  Cpu,
  HardDrive,
  Shield,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { usePersistedSetting } from '../hooks/usePersistedSetting';

interface ServerConfig {
  host: string;
  port: string;
  protocol: 'http' | 'https';
  sslEnabled: boolean;
  certificatePath: string;
  privateKeyPath: string;
  databaseHost: string;
  databasePort: string;
  databaseName: string;
  databaseUser: string;
  maxConnections: string;
  timeout: string;
  backupEnabled: boolean;
  backupInterval: string;
  backupPath: string;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  autoRestart: boolean;
  restartInterval: string;
}

interface ServerSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServerSettingsPopup: React.FC<ServerSettingsPopupProps> = ({ isOpen, onClose }) => {
  const {
    state: config,
    setState,
    save,
    isSaving,
    saveError,
    loadError,
    settingsQuery
  } = usePersistedSetting<ServerConfig>({
    key: 'server.config',
    defaultValue: {
      host: 'localhost',
      port: '3000',
      protocol: 'https',
      sslEnabled: true,
      certificatePath: '/etc/ssl/certs/server.crt',
      privateKeyPath: '/etc/ssl/private/server.key',
      databaseHost: 'localhost',
      databasePort: '5432',
      databaseName: 'novaecosystem',
      databaseUser: 'admin',
      maxConnections: '100',
      timeout: '30',
      backupEnabled: true,
      backupInterval: '24',
      backupPath: '/var/backups/novaecosystem',
      loggingLevel: 'info',
      autoRestart: true,
      restartInterval: '168'
    },
    enabled: isOpen
  });

  const [isRestarting, setIsRestarting] = useState(false);

  const handleChange = useCallback(
    (field: keyof ServerConfig, value: string | boolean) => {
      setState((previous) => ({
        ...previous,
        [field]: value
      }));
    },
    [setState]
  );

  const handleSave = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      await save();
      onClose();
    },
    [onClose, save]
  );

  const handleRestart = useCallback(async () => {
    setIsRestarting(true);
    try {
      await save();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRestarting(false);
    }
  }, [save]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Server Configuration</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="server-settings-form" className="p-6 overflow-y-auto" onSubmit={handleSave}>
          {settingsQuery.isLoading && (
            <p className="text-sm text-gray-400 mb-4">Chargement des paramètres…</p>
          )}
          {(loadError || saveError) && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{loadError ?? saveError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Network Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Host</label>
                    <input
                      type="text"
                      value={config.host}
                      onChange={(event) => handleChange('host', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Port</label>
                    <input
                      type="text"
                      value={config.port}
                      onChange={(event) => handleChange('port', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Protocol</label>
                    <select
                      value={config.protocol}
                      onChange={(event) => handleChange('protocol', event.target.value as 'http' | 'https')}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="http">HTTP</option>
                      <option value="https">HTTPS</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  SSL Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable SSL</span>
                    <button
                      type="button"
                      onClick={() => handleChange('sslEnabled', !config.sslEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.sslEnabled ? 'bg-cyan-400' : 'bg-gray-600'}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.sslEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Certificate Path</label>
                    <input
                      type="text"
                      value={config.certificatePath}
                      onChange={(event) => handleChange('certificatePath', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Private Key Path</label>
                    <input
                      type="text"
                      value={config.privateKeyPath}
                      onChange={(event) => handleChange('privateKeyPath', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Database Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Database Host</label>
                    <input
                      type="text"
                      value={config.databaseHost}
                      onChange={(event) => handleChange('databaseHost', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Database Port</label>
                    <input
                      type="text"
                      value={config.databasePort}
                      onChange={(event) => handleChange('databasePort', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Database Name</label>
                    <input
                      type="text"
                      value={config.databaseName}
                      onChange={(event) => handleChange('databaseName', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Database User</label>
                    <input
                      type="text"
                      value={config.databaseUser}
                      onChange={(event) => handleChange('databaseUser', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Network className="w-4 h-4 text-cyan-400" />
                  Performance Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Max Connections</label>
                    <input
                      type="number"
                      value={config.maxConnections}
                      onChange={(event) => handleChange('maxConnections', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Timeout (seconds)</label>
                    <input
                      type="number"
                      value={config.timeout}
                      onChange={(event) => handleChange('timeout', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  Backup Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable Automatic Backups</span>
                    <button
                      type="button"
                      onClick={() => handleChange('backupEnabled', !config.backupEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.backupEnabled ? 'bg-cyan-400' : 'bg-gray-600'}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.backupEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Backup Interval (hours)</label>
                    <input
                      type="number"
                      value={config.backupInterval}
                      onChange={(event) => handleChange('backupInterval', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Backup Path</label>
                    <input
                      type="text"
                      value={config.backupPath}
                      onChange={(event) => handleChange('backupPath', event.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-cyan-400" />
                System Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Logging Level</label>
                  <select
                    value={config.loggingLevel}
                    onChange={(event) => handleChange('loggingLevel', event.target.value as 'debug' | 'info' | 'warn' | 'error')}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Auto Restart</span>
                  <button
                    type="button"
                    onClick={() => handleChange('autoRestart', !config.autoRestart)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.autoRestart ? 'bg-cyan-400' : 'bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.autoRestart ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Restart Interval (hours)</label>
                  <input
                    type="number"
                    value={config.restartInterval}
                    onChange={(event) => handleChange('restartInterval', event.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Server Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">5 days, 2 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="text-white">23%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">1.2 GB / 4 GB</span>
                </div>
                <button
                  type="button"
                  onClick={handleRestart}
                  disabled={isRestarting || isSaving}
                  className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRestarting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Restarting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Restart Server
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="server-settings-form"
            disabled={isSaving}
            className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSettingsPopup;
