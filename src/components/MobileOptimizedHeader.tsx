import React from 'react';
import { UserCircle2, Network, Wifi, Bluetooth, Settings2 } from 'lucide-react';
import ViewToggle, { ViewMode } from './ViewToggle';

interface MobileOptimizedHeaderProps {
  currentTime: Date;
  avatarUrl: string | null;
  accountMenuOpen: boolean;
  onAccountToggle: (e: React.MouseEvent) => void;
  onNetworkClick: () => void;
  wifiEnabled: boolean;
  onWifiToggle: (e: React.MouseEvent) => void;
  bluetoothEnabled: boolean;
  onBluetoothToggle: (e: React.MouseEvent) => void;
  onGeneralSettingsToggle: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showAll: boolean;
  onShowAllChange: (show: boolean) => void;
}

const MobileOptimizedHeader: React.FC<MobileOptimizedHeaderProps> = ({
  currentTime,
  avatarUrl,
  accountMenuOpen,
  onAccountToggle,
  onNetworkClick,
  wifiEnabled,
  onWifiToggle,
  bluetoothEnabled,
  onBluetoothToggle,
  onGeneralSettingsToggle,
  viewMode,
  onViewModeChange,
  showAll,
  onShowAllChange
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={onAccountToggle}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-400/20 hover:bg-cyan-400/30 transition-colors flex items-center justify-center overflow-hidden touch-manipulation"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              )}
            </button>

            {accountMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                <button className="w-full px-4 py-3 text-left text-white hover:bg-[#141e2a] transition-colors text-sm touch-manipulation">
                  Changer de compte
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-[#141e2a] transition-colors text-sm touch-manipulation">
                  Se connecter
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#141e2a] transition-colors text-sm touch-manipulation">
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 sm:flex-none">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-cyan-400 tracking-tight">Novaecosystem</h1>
          </div>
        </div>

        {/* Zone de contrôles mobile-first */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
          {/* Date et heure pour mobile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <span className="text-cyan-400 text-xs sm:text-sm lg:text-base order-2 sm:order-1">{formatDate(currentTime)}</span>
            <span className="text-cyan-400 text-sm sm:text-base lg:text-lg font-mono order-1 sm:order-2">{formatTime(currentTime)}</span>
          </div>

          {/* Icônes de contrôle optimisées pour mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onNetworkClick}
              className="p-2 sm:p-2.5 rounded-md hover:bg-[#1c2936]/60 transition-colors text-gray-600 touch-manipulation"
            >
              <Network className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={onWifiToggle}
              className={`p-2 sm:p-2.5 rounded-md hover:bg-[#1c2936]/60 transition-colors touch-manipulation ${wifiEnabled ? 'text-cyan-400' : 'text-gray-600'}`}
            >
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={onBluetoothToggle}
              className={`p-2 sm:p-2.5 rounded-md hover:bg-[#1c2936]/60 transition-colors touch-manipulation ${bluetoothEnabled ? 'text-cyan-400' : 'text-gray-600'}`}
            >
              <Bluetooth className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={onGeneralSettingsToggle}
              className="p-2 sm:p-2.5 rounded-md hover:bg-[#1c2936]/60 transition-colors text-cyan-400 touch-manipulation"
            >
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contrôles de vue */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          showAll={showAll}
          onShowAllChange={onShowAllChange}
        />
      </div>
    </>
  );
};

export default MobileOptimizedHeader;