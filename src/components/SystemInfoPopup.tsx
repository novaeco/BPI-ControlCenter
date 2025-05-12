import React from 'react';
import { X, Download, RefreshCw, CheckCircle2, Server } from 'lucide-react';

interface SystemInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemInfoPopup: React.FC<SystemInfoPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const systemInfo = {
    version: '1.2.3',
    lastUpdate: '2024-02-20',
    uptime: '45 days',
    newVersion: '1.2.4',
    updateAvailable: true,
    systemHealth: 'Good',
    memoryUsage: '45%',
    storageUsage: '32%',
    temperature: '35°C'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-md rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">System Information</h2>
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
              <h3 className="text-white font-medium mb-3">Version Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Version</span>
                  <span className="text-white">{systemInfo.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Update</span>
                  <span className="text-white">{systemInfo.lastUpdate}</span>
                </div>
                {systemInfo.updateAvailable && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-sm">Update Available: v{systemInfo.newVersion}</span>
                    </div>
                    <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Install Update
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">System Health</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-white">{systemInfo.systemHealth}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">{systemInfo.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">{systemInfo.memoryUsage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage Usage</span>
                  <span className="text-white">{systemInfo.storageUsage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">System Temperature</span>
                  <span className="text-white">{systemInfo.temperature}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-[#141e2a] text-cyan-400 rounded-md hover:bg-[#141e2a]/70 transition-colors text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Status
              </button>
              <button className="px-4 py-2 bg-[#141e2a] text-cyan-400 rounded-md hover:bg-[#141e2a]/70 transition-colors text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                System Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoPopup;