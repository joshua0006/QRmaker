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
  colorPickerRef: React.RefObject<HTMLDivElement>;
  startOpacity?: number;
  endOpacity?: number;
  onStartOpacityChange?: (opacity: number) => void;
  onEndOpacityChange?: (opacity: number) => void;
}

export default function GradientColorPicker({
  startColor,
  endColor,
  onStartColorChange,
  onEndColorChange,
  activeColorPicker,
  setActiveColorPicker,
  colorPickerRef,
  startOpacity = 1,
  endOpacity = 1,
  onStartOpacityChange,
  onEndOpacityChange
}: GradientColorPickerProps) {
  // Create separate refs for start and end pickers
  const startPickerRef = React.useRef<HTMLDivElement>(null);
  const endPickerRef = React.useRef<HTMLDivElement>(null);

  // Use click outside detection for both pickers
  useClickOutside(startPickerRef, () => {
    if (activeColorPicker === 'start') {
      setActiveColorPicker(null);
    }
  });

  useClickOutside(endPickerRef, () => {
    if (activeColorPicker === 'end') {
      setActiveColorPicker(null);
    }
  });

  const handleStartOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onStartOpacityChange) {
      onStartOpacityChange(parseFloat(e.target.value));
    }
  };

  const handleEndOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onEndOpacityChange) {
      onEndOpacityChange(parseFloat(e.target.value));
    }
  };

  const handlePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-4 h-10">
      <div className="flex items-center">
        <span className="text-xs text-gray-600 mr-2">From:</span>
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveColorPicker(activeColorPicker === 'start' ? null : 'start');
            }}
            className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-shadow hover:shadow-md"
            style={{ backgroundColor: startColor }}
            title="Start color"
          >
            <Palette 
              size={14} 
              className={`text-white opacity-50 hover:opacity-100 transition-opacity ${startColor === '#ffffff' ? 'text-gray-400' : ''}`}
            />
          </button>
          {activeColorPicker === 'start' && (
            <div 
              className="absolute left-full top-0 ml-2 z-10" 
              ref={startPickerRef}
              onClick={handlePickerClick}
            >
              <div 
                className="p-3 bg-white rounded-lg shadow-xl border border-gray-200"
                onClick={handlePickerClick}
              >
                <div onClick={handlePickerClick}>
                  <HexColorPicker color={startColor} onChange={onStartColorChange} />
                </div>
                <div className="mt-2" onClick={handlePickerClick}>
                  <input
                    type="text"
                    value={startColor}
                    onChange={(e) => onStartColorChange(e.target.value)}
                    onClick={handlePickerClick}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  
                  {onStartOpacityChange && (
                    <div 
                      className="flex items-center gap-2 mt-2"
                      onClick={handlePickerClick}
                    >
                      <label className="text-xs text-gray-600">Opacity:</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={startOpacity} 
                        onChange={handleStartOpacityChange}
                        onClick={handlePickerClick}
                        className="w-24"
                      />
                      <span className="text-xs text-gray-600 w-8">{Math.round(startOpacity * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <span className="text-gray-400">→</span>

      <div className="flex items-center">
        <span className="text-xs text-gray-600 mr-2">To:</span>
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveColorPicker(activeColorPicker === 'end' ? null : 'end');
            }}
            className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-shadow hover:shadow-md"
            style={{ backgroundColor: endColor }}
            title="End color"
          >
            <Palette 
              size={14} 
              className={`text-white opacity-50 hover:opacity-100 transition-opacity ${endColor === '#ffffff' ? 'text-gray-400' : ''}`}
            />
          </button>
          {activeColorPicker === 'end' && (
            <div 
              className="absolute left-full top-0 ml-2 z-10" 
              ref={endPickerRef}
              onClick={handlePickerClick}
            >
              <div 
                className="p-3 bg-white rounded-lg shadow-xl border border-gray-200"
                onClick={handlePickerClick}
              >
                <div onClick={handlePickerClick}>
                  <HexColorPicker color={endColor} onChange={onEndColorChange} />
                </div>
                <div className="mt-2" onClick={handlePickerClick}>
                  <input
                    type="text"
                    value={endColor}
                    onChange={(e) => onEndColorChange(e.target.value)}
                    onClick={handlePickerClick}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  
                  {onEndOpacityChange && (
                    <div 
                      className="flex items-center gap-2 mt-2"
                      onClick={handlePickerClick}
                    >
                      <label className="text-xs text-gray-600">Opacity:</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={endOpacity} 
                        onChange={handleEndOpacityChange}
                        onClick={handlePickerClick}
                        className="w-24"
                      />
                      <span className="text-xs text-gray-600 w-8">{Math.round(endOpacity * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="ml-2 w-16 h-6 rounded border border-gray-200" 
        style={{
          background: (() => {
            try {
              // Parse start color
              let startRgb = '';
              if (startColor.startsWith('#')) {
                if (startColor.length >= 7) {
                  startRgb = `${parseInt(startColor.slice(1,3), 16)}, ${parseInt(startColor.slice(3,5), 16)}, ${parseInt(startColor.slice(5,7), 16)}`;
                } else if (startColor.length >= 4) {
                  startRgb = `${parseInt(startColor.slice(1,2), 16) * 17}, ${parseInt(startColor.slice(2,3), 16) * 17}, ${parseInt(startColor.slice(3,4), 16) * 17}`;
                }
              } else if (startColor.startsWith('rgb')) {
                startRgb = startColor.replace(/rgba?\(|\)/g, '').split(',').slice(0,3).join(',');
              } else {
                return `linear-gradient(to right, ${startColor}, ${endColor})`;
              }
              
              // Parse end color
              let endRgb = '';
              if (endColor.startsWith('#')) {
                if (endColor.length >= 7) {
                  endRgb = `${parseInt(endColor.slice(1,3), 16)}, ${parseInt(endColor.slice(3,5), 16)}, ${parseInt(endColor.slice(5,7), 16)}`;
                } else if (endColor.length >= 4) {
                  endRgb = `${parseInt(endColor.slice(1,2), 16) * 17}, ${parseInt(endColor.slice(2,3), 16) * 17}, ${parseInt(endColor.slice(3,4), 16) * 17}`;
                }
              } else if (endColor.startsWith('rgb')) {
                endRgb = endColor.replace(/rgba?\(|\)/g, '').split(',').slice(0,3).join(',');
              } else {
                return `linear-gradient(to right, ${startColor}, ${endColor})`;
              }
              
              return `linear-gradient(to right, rgba(${startRgb}, ${startOpacity}), rgba(${endRgb}, ${endOpacity}))`;
            } catch (e) {
              // Fallback to original colors if there's an error
              return `linear-gradient(to right, ${startColor}, ${endColor})`;
            }
          })()
        }}
        title="Gradient preview"
      />
    </div>
  );
}