/**
 * Reusable color picker input component that replaces duplicate color picker implementations
 */
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface ColorPickerInputProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  className?: string;
  presets?: Array<{ color: string; label: string }>;
}

export default function ColorPickerInput({ 
  label, 
  color, 
  onChange, 
  className,
  presets 
}: ColorPickerInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const popover = React.useRef<HTMLDivElement>(null);

  // Ensure color is always a string
  const safeColor = color || '#000000';

  useClickOutside(popover, () => setIsOpen(false));

  // Prevent clicks inside the color picker from closing it
  const handlePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {presets && (
          <div className="flex items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.color}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(preset.color || '#000000');
                }}
                className="w-6 h-6 rounded-md border border-gray-200 transition-shadow hover:shadow-sm relative group"
                style={{ backgroundColor: preset.color }}
                title={preset.label}
              >
                {safeColor === preset.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 ring-1 ring-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        
        <div
          className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: safeColor }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Palette 
            size={14} 
            className={`text-white opacity-50 hover:opacity-100 transition-opacity ${
              safeColor === '#ffffff' ? 'text-gray-400' : ''
            }`}
          />
        </div>
        
        {isOpen && (
          <div 
            className="absolute z-10 mt-2" 
            ref={popover}
            onClick={handlePickerClick}
          >
            <div 
              className="p-2 bg-white rounded-md shadow-lg border border-gray-200"
              onClick={handlePickerClick}
            >
              <div onClick={handlePickerClick}>
                <HexColorPicker color={safeColor} onChange={onChange} />
              </div>
              <input
                type="text"
                value={safeColor}
                onChange={(e) => onChange(e.target.value)}
                onClick={handlePickerClick}
                className="mt-2 w-full px-2 py-1 text-xs border border-gray-200 rounded-sm"
              />
            </div>
          </div>
        )}
        
        <input
          type="text"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}