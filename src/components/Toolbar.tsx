import React from 'react';
import { ZoomIn, ZoomOut, MousePointer2 } from 'lucide-react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export default function Toolbar({ onZoomIn, onZoomOut, onFit }: ToolbarProps) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 flex space-x-2">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button
        onClick={onFit}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Fit View"
      >
        <MousePointer2 className="w-5 h-5" />
      </button>
    </div>
  );
}