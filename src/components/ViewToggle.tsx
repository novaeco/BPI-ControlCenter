import React from 'react';
import { Grid3X3, List, Eye, EyeOff } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showAll: boolean;
  onShowAllChange: (show: boolean) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  showAll,
  onShowAllChange
}) => {
  return (
    <div className="flex items-center gap-2 bg-[#1c2936]/60 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid'
            ? 'bg-cyan-400/20 text-cyan-400'
            : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
        }`}
        title="Vue en grille"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-cyan-400/20 text-cyan-400'
            : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
        }`}
        title="Vue en liste"
      >
        <List className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-700 mx-1" />
      <button
        onClick={() => onShowAllChange(!showAll)}
        className={`p-2 rounded-md transition-colors ${
          showAll
            ? 'bg-cyan-400/20 text-cyan-400'
            : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
        }`}
        title={showAll ? 'Masquer les inactifs' : 'Afficher tous'}
      >
        {showAll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ViewToggle;