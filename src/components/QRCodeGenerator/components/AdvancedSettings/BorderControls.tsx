/**
 * BorderControls component for customizing the QR code border
 */
import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface BorderControlsProps {
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  setBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  borderColor: string;
  setBorderColor: (color: string) => void;
  activeColorPicker: 'dots' | 'cornerDots' | 'border' | null;
  setActiveColorPicker: (picker: 'dots' | 'cornerDots' | 'border' | null) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function BorderControls({
  borderWidth,
  setBorderWidth,
  borderStyle,
  setBorderStyle,
  borderColor,
  setBorderColor,
  activeColorPicker,
  setActiveColorPicker,
  colorPickerRef
}: BorderControlsProps) {
  return (
    <div className="space-y-4 mt-8">
      <h4 className="text-sm font-medium text-gray-700">Border Settings</h4>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Border Width
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={borderWidth}
          onChange={(e) => setBorderWidth(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0px</span>
          <span>{borderWidth}px</span>
          <span>20px</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Border Style
        </label>
        <select
          value={borderStyle}
          onChange={(e) => setBorderStyle(e.target.value as 'solid' | 'dashed' | 'dotted')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Border Color
        </label>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
            style={{ backgroundColor: borderColor }}
            onClick={() => setActiveColorPicker(activeColorPicker === 'border' ? null : 'border')}
          />
          {activeColorPicker === 'border' && (
            <div className="absolute z-10 mt-2" ref={colorPickerRef}>
              <HexColorPicker
                color={borderColor}
                onChange={setBorderColor}
              />
            </div>
          )}
          <input
            type="text"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}