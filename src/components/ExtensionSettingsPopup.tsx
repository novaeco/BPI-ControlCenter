import React, { useState } from 'react';
import { X, Save, Puzzle, Trash2, Settings2, Download, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  status: 'active' | 'disabled' | 'error';
  configurable: boolean;
  enabled: boolean;
}

interface ExtensionSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockExtensions: Extension[] = [
  {
    id: 'weather-monitor',
    name: 'Weather Monitor',
    version: '1.2.0',
    author: 'EcoTech',
    description: 'Real-time weather monitoring and forecasting',
    status: 'active',
    configurable: true,
    enabled: true
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    version: '2.1.0',
    author: 'DataSys',
    description: 'Advanced data analysis and visualization',
    status: 'active',
    configurable: true,
    enabled: true
  },
  {
    id: 'backup-manager',
    name: 'Backup Manager',
    version: '1.0.5',
    author: 'BackupTech',
    description: 'Automated backup and recovery system',
    status: 'disabled',
    configurable: true,
    enabled: false
  },
  {
    id: 'notification-center',
    name: 'Notification Center',
    version: '1.1.0',
    author: 'NotifyCo',
    description: 'Centralized notification management',
    status: 'error',
    configurable: true,
    enabled: true
  }
];

const ExtensionSettingsPopup: React.FC<ExtensionSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [extensions, setExtensions] = useState<Extension[]>(mockExtensions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'disabled':
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleExtensionToggle = async (extensionId: string) => {
    setIsInstalling(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setExtensions(prev => prev.map(extension => {
      if (extension.id === extensionId) {
        const newEnabled = !extension.enabled;
        return {
          ...extension,
          enabled: newEnabled,
          status: newEnabled ? 'active' : 'disabled'
        };
      }
      return extension;
    }));
    
    setIsInstalling(false);
  };

  const handleDelete = (extensionId: string) => {
    if (window.confirm('Are you sure you want to delete this extension? This action cannot be undone.')) {
      setExtensions(prev => prev.filter(extension => extension.id !== extensionId));
    }
  };

  const filteredExtensions = extensions.filter(extension =>
    extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    extension.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Extension Management</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search extensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
            />
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Install New Extension
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExtensions.map((extension) => (
              <div
                key={extension.id}
                className={`bg-[#141e2a] rounded-lg p-4 border border-gray-700 transition-opacity duration-200 ${
                  !extension.enabled ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      {extension.name}
                      <span className="text-xs text-gray-400">v{extension.version}</span>
                    </h3>
                    <p className="text-gray-400 text-sm">{extension.description}</p>
                  </div>
                  {getStatusIcon(extension.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Author</span>
                    <span className="text-white">{extension.author}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExtensionToggle(extension.id)}
                    disabled={isInstalling}
                    className={`
                      flex-1 py-2 px-4 rounded-md text-sm transition-colors
                      flex items-center justify-center gap-2
                      ${extension.enabled
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }
                      ${isInstalling ? 'cursor-wait opacity-70' : ''}
                    `}
                  >
                    {isInstalling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {extension.enabled ? 'Disabling...' : 'Enabling...'}
                      </>
                    ) : (
                      extension.enabled ? 'Disable' : 'Enable'
                    )}
                  </button>
                  {extension.configurable && (
                    <button 
                      className={`
                        py-2 px-4 rounded-md text-sm
                        flex items-center justify-center gap-2
                        ${extension.enabled
                          ? 'bg-[#1c2936] hover:bg-[#1c2936]/70 text-cyan-400'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        }
                      `}
                      disabled={!extension.enabled}
                      onClick={() => setSelectedExtension(extension)}
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(extension.id)}
                    className="py-2 px-4 rounded-md text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            Close
          </button>
          <button
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

export default ExtensionSettingsPopup;