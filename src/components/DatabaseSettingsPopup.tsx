import React, { useCallback, useState } from 'react';
import { X, Save, Database, Shield, RefreshCw, HardDrive, Activity, Clock, AlertTriangle } from 'lucide-react';
import { usePersistedSetting } from '../hooks/usePersistedSetting';

interface DatabaseConfig {
  host: string;
  port: string;
  name: string;
  user: string;
  password: string;
  maxConnections: string;
  connectionTimeout: string;
  idleTimeout: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  poolSize: string;
  statementTimeout: string;
  backupEnabled: boolean;
  backupSchedule: string;
  backupRetention: string;
  backupPath: string;
  replicationEnabled: boolean;
  replicaHost: string;
  replicaPort: string;
  replicaUser: string;
}

interface DatabaseSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DatabaseSettingsPopup: React.FC<DatabaseSettingsPopupProps> = ({ isOpen, onClose }) => {
  const {
    state: config,
    setState,
    save,
    isSaving,
    saveError,
    loadError,
    settingsQuery
  } = usePersistedSetting<DatabaseConfig>({
    key: 'database.config',
    defaultValue: {
      host: 'localhost',
      port: '5432',
      name: 'novaecosystem',
      user: 'postgres',
      password: '',
      maxConnections: '100',
      connectionTimeout: '30',
      idleTimeout: '300',
      sslMode: 'require',
      poolSize: '20',
      statementTimeout: '30000',
      backupEnabled: true,
      backupSchedule: '0 0 * * *',
      backupRetention: '30',
      backupPath: '/var/backups/db',
      replicationEnabled: false,
      replicaHost: '',
      replicaPort: '5432',
      replicaUser: ''
    },
    enabled: isOpen
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleChange = useCallback(
    (field: keyof DatabaseConfig, value: string | boolean) => {
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

  const handleTestConnection = useCallback(async () => {
    setIsTestingConnection(true);
    try {
      await save();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsTestingConnection(false);
    }
  }, [save]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Database Configuration</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 overflow-y-auto" onSubmit={handleSave}>
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
                  <Database className="w-4 h-4 text-cyan-400" />
                  Connection Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Host
                    </label>
                    <input
                      type="text"
                      value={config.host}
                      onChange={(e) => handleChange('host', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
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
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={config.user}
                      onChange={(e) => handleChange('user', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={config.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      SSL Mode
                    </label>
                    <select
                      value={config.sslMode}
                      onChange={(e) => handleChange('sslMode', e.target.value as DatabaseConfig['sslMode'])}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="disable">Disable</option>
                      <option value="require">Require</option>
                      <option value="verify-ca">Verify CA</option>
                      <option value="verify-full">Verify Full</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Performance Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Max Connections
                    </label>
                    <input
                      type="number"
                      value={config.maxConnections}
                      onChange={(e) => handleChange('maxConnections', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Connection Pool Size
                    </label>
                    <input
                      type="number"
                      value={config.poolSize}
                      onChange={(e) => handleChange('poolSize', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Statement Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={config.statementTimeout}
                      onChange={(e) => handleChange('statementTimeout', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Timeout Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Connection Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      value={config.connectionTimeout}
                      onChange={(e) => handleChange('connectionTimeout', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Idle Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      value={config.idleTimeout}
                      onChange={(e) => handleChange('idleTimeout', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  Backup Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable Automatic Backups</span>
                    <button
                      onClick={() => handleChange('backupEnabled', !config.backupEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        config.backupEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          config.backupEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Backup Schedule (cron)
                    </label>
                    <input
                      type="text"
                      value={config.backupSchedule}
                      onChange={(e) => handleChange('backupSchedule', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Backup Retention (days)
                    </label>
                    <input
                      type="number"
                      value={config.backupRetention}
                      onChange={(e) => handleChange('backupRetention', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Backup Path
                    </label>
                    <input
                      type="text"
                      value={config.backupPath}
                      onChange={(e) => handleChange('backupPath', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-700 mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection || isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-cyan-500/40 text-sm text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingConnection ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Tester la connexion
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DatabaseSettingsPopup;