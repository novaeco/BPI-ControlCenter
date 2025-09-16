import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface DragDropContextType {
  draggedItem: number | null;
  draggedOverItem: number | null;
  isDragging: boolean;
  startDrag: (id: number) => void;
  endDrag: () => void;
  dragOver: (id: number) => void;
  dragLeave: () => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: React.ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (id: number) => {
    setDraggedItem(id);
    setIsDragging(true);
  };

  const endDrag = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
    setIsDragging(false);
  };

  const dragOver = (id: number) => {
    if (draggedItem !== id) {
      setDraggedOverItem(id);
    }
  };

  const dragLeave = () => {
    setDraggedOverItem(null);
  };

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        draggedOverItem,
        isDragging,
        startDrag,
        endDrag,
        dragOver,
        dragLeave
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};