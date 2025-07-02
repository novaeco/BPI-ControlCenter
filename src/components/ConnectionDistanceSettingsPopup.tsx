import React, { useState } from 'react';
import { X, Save, Ruler, Signal } from 'lucide-react';

interface ConnectionDistanceSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConnectionRange {
  id: string;
  type: string;
  semiConnection: {
    enabled: boolean;
    range: number;
  };
  totalConnection: {
    enabled: boolean;
    range: number;
  };
}

const ConnectionDistanceSettingsPopup: React.FC<ConnectionDistanceSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [ranges, setRanges] = useState<ConnectionRange[]>([
    {
      id: 'general',
      type: 'Connection Range',
      semiConnection: {
        enabled: true,
        range: 75
      },
      totalConnection: {
        enabled: true,
        range: 50
      }
    }
  ]);

  if (!isOpen) return null;

  const handleRangeChange = (
    rangeId: string, 
    connectionType: 'semiConnection' | 'totalConnection',
    field: 'range' | 'enabled',
    value: number | boolean
  ) => {
    setRanges(prev => prev.map(range => {
      if (range.id === rangeId) {
        return {
          ...range,
          [connectionType]: {
            ...range[connectionType],
            [field]: value
          }
        };
      }
      return range;
    }));
  };

  const handleSave = () => {
    console.log('Saving connection distance settings:', ranges);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-2xl rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Connection Distance Settings</h2>
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
            {ranges.map(range => (
              <div
                key={range.id}
                className="bg-[#141e2a] rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Signal className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">{range.type}</span>
                </div>

                <div className="space-y-6">
                  {/* Semi Connection Settings */}
                  <div className={`bg-[#1c2936]/50 rounded-lg p-4 border border-gray-700 transition-opacity duration-200 ${!range.semiConnection.enabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Semi Connection</h3>
                      <button
                        onClick={() => handleRangeChange(range.id, 'semiConnection', 'enabled', !range.semiConnection.enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          range.semiConnection.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            range.semiConnection.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Semi connection allows a technician to connect to your livestock management system with limited access. This mode is ideal for routine maintenance and basic monitoring tasks while maintaining system security.
                    </p>
                  </div>

                  {/* Total Connection Settings */}
                  <div className={`bg-[#1c2936]/50 rounded-lg p-4 border border-gray-700 transition-opacity duration-200 ${!range.totalConnection.enabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Total Connection</h3>
                      <button
                        onClick={() => handleRangeChange(range.id, 'totalConnection', 'enabled', !range.totalConnection.enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          range.totalConnection.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            range.totalConnection.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Total connection provides complete access to your livestock management system. This mode enables full system control and configuration capabilities, recommended only for authorized administrators and system owners.
                    </p>
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

export default ConnectionDistanceSettingsPopup;