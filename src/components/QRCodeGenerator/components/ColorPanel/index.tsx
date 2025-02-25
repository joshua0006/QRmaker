/**
 * ColorPanel component for managing QR code colors
 */
import React, { useState, useEffect } from 'react';
import { QROptions } from '../../../../types/qr';
import ColorRow from './ColorRow';
import GradientControls from '../CustomizePanel/ColorControls/GradientControls';

interface ColorPanelProps {
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

export default function ColorPanel({
  options,
  setOptions,
  useDotsGradient,
  setUseDotsGradient,
  useBackgroundGradient,
  setUseBackgroundGradient,
  activeColorPicker,
  setActiveColorPicker,
  colorPickerRef
}: ColorPanelProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-6">QR Code Colors</h2>
      
      <div className="divide-y divide-gray-100">
        <ColorRow
          label="QR Dots"
          color={options.dotsOptions.color} 
          onChange={(color) =>
            setOptions((prev) => ({
              ...prev,
              dotsOptions: { ...prev.dotsOptions, color }
            }))
          }
          isActive={activeColorPicker === 'dots'}
          onToggle={() => setActiveColorPicker(activeColorPicker === 'dots' ? null : 'dots')}
          useGradient={useDotsGradient}
          onGradientToggle={setUseDotsGradient}
          options={options}
          setOptions={setOptions}
          optionsKey="dotsOptions"
          colorPickerRef={colorPickerRef}
        />
        
        <ColorRow
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
          useGradient={false}
          onGradientToggle={() => {}}
          options={options}
          setOptions={setOptions}
          colorPickerRef={colorPickerRef}
        />
        
        <ColorRow
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
          useGradient={useBackgroundGradient}
          onGradientToggle={setUseBackgroundGradient}
          options={options}
          setOptions={setOptions}
          optionsKey="backgroundOptions"
          colorPickerRef={colorPickerRef}
        />
      </div>
    </div>
  );
}