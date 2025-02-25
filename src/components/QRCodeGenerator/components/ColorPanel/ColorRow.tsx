/**
 * ColorRow component for a single color control row with gradient toggle
 */
import React from 'react';
import ColorPickerInput from '../../../common/ColorPickerInput';
import { QROptions } from '../../../../types/qr';
import { dotColorPresets, backgroundColorPresets } from '../../../../data/colorPresets';
import GradientColorPicker from './GradientColorPicker';

interface ColorRowProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  isActive: boolean;
  onToggle: () => void;
  useGradient: boolean;
  onGradientToggle: (enabled: boolean) => void;
  options?: QROptions;
  setOptions?: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
  optionsKey?: 'dotsOptions' | 'backgroundOptions';
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function ColorRow({
  label,
  color,
  onChange,
  isActive,
  onToggle,
  useGradient,
  onGradientToggle,
  options,
  setOptions,
  optionsKey,
  colorPickerRef
}: ColorRowProps) {
  const colorPresets = label.toLowerCase().includes('background') ? backgroundColorPresets : dotColorPresets;
  const currentGradient = optionsKey && options?.[optionsKey]?.gradient;
  const [activeGradientPicker, setActiveGradientPicker] = React.useState<'start' | 'end' | null>(null);

  const handleGradientToggle = (enabled: boolean) => {
    if (!setOptions || !optionsKey) return;
    
    onGradientToggle(enabled);
    if (enabled) {
      setOptions(prev => ({
        ...prev,
        [optionsKey]: {
          ...prev[optionsKey],
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: color },
              { offset: 1, color: optionsKey === 'dotsOptions' ? '#4338ca' : '#f0f9ff' }
            ]
          }
        }
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        [optionsKey]: {
          ...prev[optionsKey],
          gradient: undefined
        }
      }));
    }
  };

  const handleGradientTypeChange = (type: 'linear' | 'radial') => {
    if (!setOptions || !optionsKey) return;
    setOptions(prev => ({
      ...prev,
      [optionsKey]: {
        ...prev[optionsKey],
        gradient: {
          ...prev[optionsKey].gradient!,
          type
        }
      }
    }));
  };

  const handleRotationChange = (rotation: number) => {
    if (!setOptions || !optionsKey) return;
    setOptions(prev => ({
      ...prev,
      [optionsKey]: {
        ...prev[optionsKey],
        gradient: {
          ...prev[optionsKey].gradient!,
          rotation: rotation * (Math.PI / 180)
        }
      }
    }));
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!setOptions || !optionsKey || !currentGradient) return;
    setOptions(prev => ({
      ...prev,
      [optionsKey]: {
        ...prev[optionsKey],
        gradient: {
          ...prev[optionsKey].gradient!,
          colorStops: prev[optionsKey].gradient!.colorStops.map((stop, i) =>
            i === index ? { ...stop, color } : stop
          )
        }
      }
    }));
  };

  return (
    <div className="flex items-center gap-6 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <label className="text-sm font-medium text-gray-700 min-w-[100px]">{label}</label>
      <div className="flex items-center gap-6">
        <ColorPickerInput
          label=""
          color={color}
          onChange={onChange}
          presets={colorPresets}
        />
        {optionsKey && (
          <>
            <button
              onClick={() => handleGradientToggle(!useGradient)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                useGradient 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Gradient
            </button>
            
            {useGradient && currentGradient && (
              <div className="flex items-center gap-4">
                <GradientColorPicker
                  startColor={currentGradient.colorStops[0].color}
                  endColor={currentGradient.colorStops[1].color}
                  onStartColorChange={(color) => handleGradientColorChange(0, color)}
                  onEndColorChange={(color) => handleGradientColorChange(1, color)}
                  activeColorPicker={activeGradientPicker}
                  setActiveColorPicker={setActiveGradientPicker}
                  colorPickerRef={colorPickerRef}
                />

                <select
                  value={currentGradient.type}
                  onChange={(e) => handleGradientTypeChange(e.target.value as 'linear' | 'radial')}
                  className="px-2 py-1 text-sm border border-gray-200 rounded-md"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                
                {currentGradient.type === 'linear' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={currentGradient.rotation * (180 / Math.PI)}
                      onChange={(e) => handleRotationChange(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">
                      {Math.round(currentGradient.rotation * (180 / Math.PI))}°
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}