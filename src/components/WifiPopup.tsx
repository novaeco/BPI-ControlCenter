import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCcw, Wifi } from 'lucide-react';
import type { WifiNetwork } from '../api/controlCenter';

interface WifiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  isToggling: boolean;
  onToggle: () => Promise<void>;
  networks: WifiNetwork[] | undefined;
  isLoadingNetworks: boolean;
  onRefresh: () => Promise<void> | void;
  onConnect: (ssid: string, password?: string) => Promise<void>;
  connectionError: string | null;
  isConnecting: boolean;
}

const signalColor = (strength: number): string => {
  if (strength >= 80) return 'bg-green-500';
  if (strength >= 60) return 'bg-yellow-500';
  if (strength >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const WifiPopup: React.FC<WifiPopupProps> = ({
  isOpen,
  onClose,
  isEnabled,
  isToggling,
  onToggle,
  networks,
  isLoadingNetworks,
  onRefresh,
  onConnect,
  connectionError,
  isConnecting
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (connectionError) {
      setFeedback(null);
    }
  }, [connectionError]);

  const sortedNetworks = useMemo(() => {
    if (!networks) {
      return [] as WifiNetwork[];
    }
    return [...networks].sort((a, b) => b.signal - a.signal);
  }, [networks]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (network: WifiNetwork) => {
    setFeedback(null);
    setSelectedNetwork(network);
    setPassword('');
    if (!network.secure) {
      onConnect(network.ssid)
        .then(() => {
          setFeedback(`Connecté à ${network.ssid}`);
          setSelectedNetwork(null);
        })
        .catch(() => {
          setFeedback(null);
        });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNetwork) {
      return;
    }
    try {
      await onConnect(selectedNetwork.ssid, password);
      setFeedback(`Connecté à ${selectedNetwork.ssid}`);
      setSelectedNetwork(null);
      setPassword('');
    } catch {
      setFeedback(null);
    }
  };

  const disableInteractions = isToggling || isConnecting;

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 z-50">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-semibold">Wi-Fi</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                void onRefresh();
              }}
              disabled={isLoadingNetworks || !isEnabled}
              className="p-1.5 rounded-md border border-transparent text-sm text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Rafraîchir les réseaux"
            >
              {isLoadingNetworks ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            </button>
            <button
              onClick={async () => {
                try {
                  await onToggle();
                } catch (error) {
                  console.debug('Toggle Wi-Fi failed', error);
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
              aria-label="Fermer le panneau Wi-Fi"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        {!isEnabled ? (
          <p className="text-xs text-gray-400">Activez le Wi-Fi pour rechercher des réseaux disponibles.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sortedNetworks.map((network) => (
              <button
                key={`${network.ssid}-${network.signal}`}
                onClick={() => handleSelect(network)}
                disabled={disableInteractions}
                className={`w-full p-2.5 rounded-md border transition-all flex items-center justify-between text-left ${
                  selectedNetwork?.ssid === network.ssid ? 'border-cyan-500 bg-[#142031]' : 'border-transparent hover:bg-[#141e2a]'
                } ${disableInteractions ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-white truncate">{network.ssid || 'SSID non diffusé'}</p>
                    <p className="text-[11px] text-gray-400">{network.secure ? 'Sécurisé' : 'Ouvert'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${signalColor(network.signal)}`} />
              </button>
            ))}
            {sortedNetworks.length === 0 && !isLoadingNetworks && (
              <p className="text-sm text-gray-400 text-center py-4">Aucun réseau détecté.</p>
            )}
            {isLoadingNetworks && (
              <p className="text-sm text-gray-400 text-center py-4 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyse des réseaux…
              </p>
            )}
          </div>
        )}

        {selectedNetwork?.secure && (
          <form onSubmit={handleSubmit} className="space-y-2 border-t border-gray-700 pt-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Mot de passe pour {selectedNetwork.ssid}</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-[#121c27] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={disableInteractions || password.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />} Se connecter
            </button>
          </form>
        )}

        {connectionError && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-md px-2 py-1">{connectionError}</p>
        )}
        {feedback && !connectionError && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-md px-2 py-1">{feedback}</p>
        )}
      </div>
    </div>
  );
};

export default WifiPopup;
