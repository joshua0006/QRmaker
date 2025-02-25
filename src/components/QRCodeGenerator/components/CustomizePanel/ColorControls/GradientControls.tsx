/**
 * GradientControls component for managing gradient settings
 */
import React from 'react';
import { QROptions } from '../../../../../types/qr';

interface GradientControlsProps {
  label: string;
  useGradient: boolean;
  setUseGradient: (use: boolean) => void;
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
  optionsKey: 'dotsOptions' | 'backgroundOptions';
  defaultSecondColor: string;
}

export default function GradientControls({
  label,
  useGradient,
  setUseGradient,
  options,
  setOptions,
  optionsKey,
  defaultSecondColor
}: GradientControlsProps) {
  const handleGradientToggle = (enabled: boolean) => {
    setUseGradient(enabled);
    if (!enabled) {
      setOptions(prev => ({
        ...prev,
        [optionsKey]: {
          ...prev[optionsKey],
          gradient: undefined
        }
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        [optionsKey]: {
          ...prev[optionsKey],
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: prev[optionsKey].color },
              { offset: 1, color: defaultSecondColor }
            ]
          }
        }
      }));
    }
  };

  const currentGradient = options[optionsKey].gradient;

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(e) => handleGradientToggle(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Enable {label} Gradient
        </label>
      </div>

      {useGradient && currentGradient && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} Gradient Type
          </label>
          <select
            value={currentGradient.type}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              [optionsKey]: {
                ...prev[optionsKey],
                gradient: {
                  ...prev[optionsKey].gradient!,
                  type: e.target.value as 'linear' | 'radial'
                }
              }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>

          {currentGradient.type === 'linear' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient Rotation (degrees)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={currentGradient.rotation * (180 / Math.PI)}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  [optionsKey]: {
                    ...prev[optionsKey],
                    gradient: {
                      ...prev[optionsKey].gradient!,
                      rotation: Number(e.target.value) * (Math.PI / 180)
                    }
                  }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0°</span>
                <span>{Math.round(currentGradient.rotation * (180 / Math.PI))}°</span>
                <span>360°</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}