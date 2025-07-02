import React from 'react';
import { Wifi } from 'lucide-react';

interface WifiNetwork {
  id: string;
  name: string;
  strength: number;
  secured: boolean;
}

interface WifiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: () => void;
}

const mockNetworks: WifiNetwork[] = [
  { id: '1', name: 'Home Network', strength: 90, secured: true },
  { id: '2', name: 'Guest Network', strength: 75, secured: true },
  { id: '3', name: 'Public WiFi', strength: 60, secured: false },
];

const WifiPopup: React.FC<WifiPopupProps> = ({ isOpen, onClose, isEnabled, onToggle }) => {
  if (!isOpen) return null;

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 xs:w-72 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-cyan-400 font-semibold">WiFi</span>
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-cyan-400' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {isEnabled && (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {mockNetworks.map((network) => (
              <button
                key={network.id}
                className="w-full p-2.5 rounded-md hover:bg-[#141e2a] transition-colors flex items-center justify-between touch-none select-none"
              >
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white text-sm truncate">{network.name}</span>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStrengthColor(network.strength)}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WifiPopup;