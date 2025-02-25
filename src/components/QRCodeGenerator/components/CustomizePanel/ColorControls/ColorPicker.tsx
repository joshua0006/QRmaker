/**
 * ColorPicker component for selecting colors with a color picker popup
 */
import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  isActive: boolean;
  onToggle: () => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function ColorPicker({
  label,
  color,
  onChange,
  isActive,
  onToggle,
  colorPickerRef
}: ColorPickerProps) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-lg border-2 border-gray-200"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      {isActive && (
        <div className="absolute z-10 mt-2" ref={colorPickerRef}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}