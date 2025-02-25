/**
 * ColorControls component that manages all color and gradient related controls
 */
import React from 'react';
import { QROptions } from '../../../../types/qr';
import ColorPicker from './ColorPicker';
import GradientControls from './GradientControls';

interface ColorControlsProps {
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
  useDotsGradient: boolean;
  setUseDotsGradient: (use: boolean) => void;
  useBackgroundGradient: boolean;
  setUseBackgroundGradient: (use: boolean) => void;
  activeColorPicker: 'dots' | 'cornerDots' | 'border' | null;
  setActiveColorPicker: (picker: 'dots' | 'cornerDots' | 'border' | null) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function ColorControls({
  options,
  setOptions,
  useDotsGradient,
  setUseDotsGradient,
  useBackgroundGradient,
  setUseBackgroundGradient,
  activeColorPicker,
  setActiveColorPicker,
  colorPickerRef
}: ColorControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        {/* Color Pickers */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          QR Code Colors
        </label>
        <div className="flex flex-wrap gap-4">
          <ColorPicker
            label="Dots"
            color={options.dotsOptions.color}
            onChange={(color) =>
              setOptions((prev) => ({
                ...prev,
                dotsOptions: { ...prev.dotsOptions, color }
              }))
            }
            isActive={activeColorPicker === 'dots'}
            onToggle={() => setActiveColorPicker(activeColorPicker === 'dots' ? null : 'dots')}
            colorPickerRef={colorPickerRef}
          />
          <ColorPicker
            label="Corner Dots"
            color={options.cornersDotOptions?.color || options.dotsOptions.color}
            onChange={(color) =>
              setOptions((prev) => ({
                ...prev,
                cornersDotOptions: { ...prev.cornersDotOptions, color }
              }))
            }
            isActive={activeColorPicker === 'cornerDots'}
            onToggle={() => setActiveColorPicker(activeColorPicker === 'cornerDots' ? null : 'cornerDots')}
            colorPickerRef={colorPickerRef}
          />
          <ColorPicker
            label="Background"
            color={options.backgroundOptions.color}
            onChange={(color) =>
              setOptions((prev) => ({
                ...prev,
                backgroundOptions: { ...prev.backgroundOptions, color }
              }))
            }
            isActive={activeColorPicker === 'background'}
            onToggle={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
            colorPickerRef={colorPickerRef}
          />
        </div>
      </div>

      {/* Gradient Controls */}
      <GradientControls
        label="Dots"
        useGradient={useDotsGradient}
        setUseGradient={setUseDotsGradient}
        options={options}
        setOptions={setOptions}
        optionsKey="dotsOptions"
        defaultSecondColor="#4338ca"
      />

      <GradientControls
        label="Background"
        useGradient={useBackgroundGradient}
        setUseGradient={setUseBackgroundGradient}
        options={options}
        setOptions={setOptions}
        optionsKey="backgroundOptions"
        defaultSecondColor="#f0f9ff"
      />
    </div>
  );
}