import React from 'react';
import { Bluetooth } from 'lucide-react';

interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

interface BluetoothPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: () => void;
}

const mockDevices: BluetoothDevice[] = [
  { id: '1', name: 'AirPods Pro', type: 'Audio', connected: true },
  { id: '2', name: 'Smart Watch', type: 'Wearable', connected: false },
  { id: '3', name: 'Wireless Speaker', type: 'Audio', connected: false },
];

const BluetoothPopup: React.FC<BluetoothPopupProps> = ({ isOpen, onClose, isEnabled, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 xs:w-72 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-cyan-400 font-semibold">Bluetooth</span>
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
            {mockDevices.map((device) => (
              <button
                key={device.id}
                className="w-full p-2.5 rounded-md hover:bg-[#141e2a] transition-colors flex items-center justify-between touch-none select-none"
              >
                <div className="flex items-center gap-2.5">
                  <Bluetooth className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-white text-sm truncate">{device.name}</div>
                    <div className="text-gray-400 text-xs truncate">{device.type}</div>
                  </div>
                </div>
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${device.connected ? 'bg-cyan-400' : 'bg-gray-600'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BluetoothPopup;