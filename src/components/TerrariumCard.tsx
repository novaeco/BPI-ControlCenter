import React from 'react';
import { Settings, Power, Info, Thermometer, Droplet, Sun, Leaf, Gauge, FlaskRound as Flask, Zap, GripVertical } from 'lucide-react';
import { AquariumType } from '../types';
import { useDragDrop } from './DragDropProvider';
import { ViewMode } from './ViewToggle';

interface TerrariumCardProps {
  terrarium: AquariumType;
  viewMode: ViewMode;
  onSettingsClick: (e: React.MouseEvent, terrarium: AquariumType) => void;
  onToggle: (e: React.MouseEvent, id: number) => void;
  onInfoClick: (e: React.MouseEvent, id: number) => void;
  selectedTerrarium: AquariumType | null;
  infoPopupOpen: number | null;
  onReorder: (fromIndex: number, toIndex: number) => void;
  index: number;
}

const TerrariumCard: React.FC<TerrariumCardProps> = ({
  terrarium,
  viewMode,
  onSettingsClick,
  onToggle,
  onInfoClick,
  selectedTerrarium,
  infoPopupOpen,
  onReorder,
  index
}) => {
  const { draggedItem, draggedOverItem, isDragging, startDrag, endDrag, dragOver, dragLeave } = useDragDrop();
  const isDraggedOver = draggedOverItem === terrarium.id;
  const isBeingDragged = draggedItem === terrarium.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    startDrag(terrarium.id);
  };

  const handleDragEnd = () => {
    endDrag();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem !== terrarium.id) {
      dragOver(terrarium.id);
    }
  };

  const handleDragLeave = () => {
    dragLeave();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== terrarium.id) {
      // Find indices for reordering
      const fromIndex = index;
      const toIndex = index; // This would need to be calculated based on actual layout
      onReorder(fromIndex, toIndex);
    }
    endDrag();
  };

  if (viewMode === 'list') {
    return (
      <div
        key={terrarium.id}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          bg-[#141e2a]/60 rounded-xl overflow-hidden transition-all duration-300 cursor-move
          ${isBeingDragged ? 'opacity-50 scale-95' : ''}
          ${isDraggedOver ? 'ring-2 ring-cyan-400 scale-105' : ''}
          ${!terrarium.isActive ? 'opacity-70' : ''}
        `}
      >
        <div className="flex items-center p-4 gap-4">
          <div className="flex-shrink-0">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-shrink-0">
            <img 
              src={terrarium.image} 
              alt={terrarium.name}
              className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg transition-all duration-300 ${!terrarium.isActive ? 'grayscale brightness-50' : ''}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-cyan-400 truncate">{terrarium.name}</h3>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-white">{terrarium.temperature}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-white">{terrarium.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-white">{terrarium.lightLevel}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-white">72%</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <button 
              onClick={(e) => onSettingsClick(e, terrarium)}
              className={`p-2 bg-[#1c2936]/80 backdrop-blur-sm rounded-md hover:bg-[#1c2936]/60 transition-colors ${selectedTerrarium?.id === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <Settings className="w-4 h-4 text-cyan-400" />
            </button>
            <button 
              onClick={(e) => onToggle(e, terrarium.id)}
              className={`p-2 bg-[#1c2936]/80 backdrop-blur-sm rounded-md hover:bg-[#1c2936]/60 transition-colors ${terrarium.isActive ? 'ring-2 ring-green-400' : ''}`}
            >
              <Power className={`w-4 h-4 ${terrarium.isActive ? 'text-green-400' : 'text-gray-400'}`} />
            </button>
            <button 
              onClick={(e) => onInfoClick(e, terrarium.id)}
              className={`p-2 bg-[#1c2936]/80 backdrop-blur-sm rounded-md hover:bg-[#1c2936]/60 transition-colors ${infoPopupOpen === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <Info className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={terrarium.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        bg-[#141e2a]/60 rounded-2xl overflow-hidden transition-all duration-300 cursor-move
        ${isBeingDragged ? 'opacity-50 scale-95' : ''}
        ${isDraggedOver ? 'ring-2 ring-cyan-400 scale-105' : ''}
        ${!terrarium.isActive ? 'opacity-70' : ''}
      `}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          <GripVertical className="w-4 h-4 text-white/50" />
        </div>
        <img 
          src={terrarium.image} 
          alt={terrarium.name}
          className={`w-full aspect-[4/5] xs:aspect-[3/4] sm:aspect-square lg:aspect-[4/5] object-cover transition-all duration-300 ${!terrarium.isActive ? 'grayscale brightness-50' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141e2a]/95" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400 mb-3 sm:mb-4 lg:mb-6 line-clamp-2 text-balance">{terrarium.name}</h2>
          
          {/* Actions mobiles améliorées */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3 mb-2 sm:mb-3">
            <button 
              onClick={(e) => onSettingsClick(e, terrarium)}
              className={`bg-[#1c2936]/80 backdrop-blur-sm h-8 sm:h-9 lg:h-10 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center touch-manipulation ${selectedTerrarium?.id === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </button>
            <button 
              onClick={(e) => onToggle(e, terrarium.id)}
              className={`bg-[#1c2936]/80 backdrop-blur-sm h-8 sm:h-9 lg:h-10 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center touch-manipulation ${terrarium.isActive ? 'ring-2 ring-green-400' : ''}`}
            >
              <Power className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${terrarium.isActive ? 'text-green-400' : 'text-gray-400'}`} />
            </button>
            <button 
              onClick={(e) => onInfoClick(e, terrarium.id)}
              className={`bg-[#1c2936]/80 backdrop-blur-sm h-8 sm:h-9 lg:h-10 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center touch-manipulation ${infoPopupOpen === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </button>
          </div>

          {/* Métriques environnementales améliorées pour mobile */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 lg:gap-3 mb-1 sm:mb-2">
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">{terrarium.temperature}°</span>
            </div>
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Droplet className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">{terrarium.humidity}%</span>
            </div>
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">{terrarium.lightLevel}%</span>
            </div>
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">72%</span>
            </div>
          </div>

          {/* Métriques supplémentaires pour mobile */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-3 mb-1 sm:mb-1">
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">85%</span>
            </div>
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Flask className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">92%</span>
            </div>
            <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-8 lg:h-9 rounded-md flex items-center justify-center gap-0.5 sm:gap-1">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-medium">6.8</span>
            </div>
          </div>

          {/* Labels des métriques optimisées pour mobile */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 lg:gap-3 mb-1">
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Temp</div>
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Humid</div>
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Light</div>
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Soil</div>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-3">
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Air</div>
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">Water</div>
            <div className="text-center text-[8px] sm:text-[9px] lg:text-xs text-gray-400">EC</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrariumCard;