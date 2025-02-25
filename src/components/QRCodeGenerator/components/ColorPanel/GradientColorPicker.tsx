/**
 * GradientColorPicker component for customizing gradient colors
 */
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette } from 'lucide-react';
import { useClickOutside } from '../../../../hooks/useClickOutside';

interface GradientColorPickerProps {
  startColor: string;
  endColor: string;
  onStartColorChange: (color: string) => void;
  onEndColorChange: (color: string) => void;
  activeColorPicker: 'start' | 'end' | null;
  setActiveColorPicker: (picker: 'start' | 'end' | null) => void;
}

export default function GradientColorPicker({
  startColor,
  endColor,
  onStartColorChange,
  onEndColorChange,
  activeColorPicker,
  setActiveColorPicker,
}: GradientColorPickerProps) {
  const pickerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(pickerRef, () => {
    setActiveColorPicker(null);
  });

  return (
    <div className="flex items-center gap-4 ml-4">
      <div className="relative inline-block">
        <button
          onClick={() => setActiveColorPicker(activeColorPicker === 'start' ? null : 'start')}
          className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-shadow hover:shadow-md"
          style={{ backgroundColor: startColor }}
        >
          <Palette 
            size={14} 
            className={`text-white opacity-50 hover:opacity-100 transition-opacity ${startColor === '#ffffff' ? 'text-gray-400' : ''}`}
          />
        </button>
        {activeColorPicker === 'start' && (
          <div className="absolute left-full top-0 ml-2 z-10" ref={pickerRef}>
            <div className="p-2 bg-white rounded-lg shadow-xl border border-gray-200">
              <HexColorPicker color={startColor} onChange={onStartColorChange} />
              <input
                type="text"
                value={startColor}
                onChange={(e) => onStartColorChange(e.target.value)}
                className="mt-2 w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      <span className="text-gray-400">→</span>

      <div className="relative inline-block">
        <button
          onClick={() => setActiveColorPicker(activeColorPicker === 'end' ? null : 'end')}
          className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-shadow hover:shadow-md"
          style={{ backgroundColor: endColor }}
        >
          <Palette 
            size={14} 
            className={`text-white opacity-50 hover:opacity-100 transition-opacity ${endColor === '#ffffff' ? 'text-gray-400' : ''}`}
          />
        </button>
        {activeColorPicker === 'end' && (
          <div className="absolute left-full top-0 ml-2 z-10" ref={pickerRef}>
            <div className="p-2 bg-white rounded-lg shadow-xl border border-gray-200">
              <HexColorPicker color={endColor} onChange={onEndColorChange} />
              <input
                type="text"
                value={endColor}
                onChange={(e) => onEndColorChange(e.target.value)}
                className="mt-2 w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}