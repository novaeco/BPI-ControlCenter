import React from 'react';
import { Bluetooth, Loader2, RefreshCcw } from 'lucide-react';
import type { BluetoothDevicesResponse } from '../api/controlCenter';

interface BluetoothPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  isToggling: boolean;
  onToggle: () => Promise<void>;
  devices: BluetoothDevicesResponse | undefined;
  isLoadingDevices: boolean;
  onRefresh: () => Promise<void> | void;
}

const BluetoothPopup: React.FC<BluetoothPopupProps> = ({
  isOpen,
  onClose,
  isEnabled,
  isToggling,
  onToggle,
  devices,
  isLoadingDevices,
  onRefresh
}) => {
  if (!isOpen) {
    return null;
  }

  const disableInteractions = isToggling;
  const discovered = devices?.discovered ?? [];
  const paired = devices?.paired ?? [];

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 z-50">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-semibold">Bluetooth</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                void onRefresh();
              }}
              disabled={isLoadingDevices || !isEnabled}
              className="p-1.5 rounded-md border border-transparent text-sm text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Rafraîchir les appareils"
            >
              {isLoadingDevices ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            </button>
            <button
              onClick={async () => {
                try {
                  await onToggle();
                } catch (error) {
                  console.debug('Toggle Bluetooth failed', error);
                }
              }}
              disabled={disableInteractions}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-cyan-400' : 'bg-gray-600'
              } ${disableInteractions ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-label="Fermer le panneau Bluetooth"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        {!isEnabled ? (
          <p className="text-xs text-gray-400">Activez le Bluetooth pour rechercher des appareils.</p>
        ) : (
          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Appareils appairés</p>
              <div className="space-y-2">
                {paired.length === 0 && <p className="text-sm text-gray-400">Aucun appareil appairé.</p>}
                {paired.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-2.5 rounded-md border border-transparent hover:border-cyan-500/40 hover:bg-[#141e2a] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bluetooth className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-sm text-white truncate">{device.name}</p>
                        <p className="text-[11px] text-gray-400">{device.id}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400">Appairé</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Appareils détectés</p>
              <div className="space-y-2">
                {discovered.length === 0 && <p className="text-sm text-gray-400">Aucun appareil détecté.</p>}
                {discovered.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-2.5 rounded-md border border-transparent hover:border-cyan-500/40 hover:bg-[#141e2a] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bluetooth className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-sm text-white truncate">{device.name}</p>
                        <p className="text-[11px] text-gray-400">{device.id}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] ${device.paired ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {device.paired ? 'Appairé' : 'Découvert'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {isLoadingDevices && (
              <p className="text-sm text-gray-400 text-center py-4 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Recherche d'appareils…
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BluetoothPopup;
