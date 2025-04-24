/**
 * PresetSelector component for choosing predefined QR code styles
 */
import React from 'react';
import { QrCode } from 'lucide-react';
import clsx from 'clsx';
import { presets } from '../../../../data/presets';
import { PresetType, QROptions } from '../../../../types/qr';

interface PresetSelectorProps {
  activePreset: PresetType;
  setActivePreset: (preset: PresetType) => void;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
}

export default function PresetSelector({
  activePreset,
  setActivePreset,
  setOptions
}: PresetSelectorProps) {
  const handlePresetChange = (type: PresetType) => {
    const preset = presets.find(p => p.type === type);
    if (preset) {
      setActivePreset(type);
      setOptions(prev => ({
        ...prev,
        ...preset.options
      }));
    } else {
      console.warn(`Preset type "${type}" not found in presets.`);
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Style Presets
      </label>
      <div className="grid grid-cols-2 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.type}
            onClick={() => handlePresetChange(preset.type)}
            className={clsx(
              'p-4 rounded-lg border-2 transition-all',
              activePreset === preset.type
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            )}
          >
            <QrCode
              size={24}
              className={clsx(
                'mx-auto mb-2',
                activePreset === preset.type ? 'text-indigo-500' : 'text-gray-400'
              )}
            />
            <span className="text-sm font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}