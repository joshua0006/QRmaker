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
  activeColorPicker: 'dots' | 'cornerDots' | 'border' | 'background' | null;
  setActiveColorPicker: (picker: 'dots' | 'cornerDots' | 'border' | 'background' | null) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

// Helper function to handle opacity
const hexToRgba = (hex: string, opacity: number): string => {
  // Extract RGB components from any color format
  let r = 0, g = 0, b = 0;
  
  if (hex.startsWith('rgba')) {
    // Extract RGB from rgba format
    const match = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
    }
  } else if (hex.startsWith('rgb')) {
    // Extract RGB from rgb format
    const match = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
    }
  } else if (hex.startsWith('#')) {
    // Extract RGB from hex format
    let hexColor = hex;
    
    // Remove alpha component if it exists
    if (hex.length === 9) {
      hexColor = hex.substring(0, 7);
    } else if (hex.length === 5) {
      hexColor = hex.substring(0, 4);
    }
    
    if (hexColor.length === 7) {
      r = parseInt(hexColor.substring(1, 3), 16);
      g = parseInt(hexColor.substring(3, 5), 16);
      b = parseInt(hexColor.substring(5, 7), 16);
    } else if (hexColor.length === 4) {
      r = parseInt(hexColor.substring(1, 2), 16) * 17;
      g = parseInt(hexColor.substring(2, 3), 16) * 17;
      b = parseInt(hexColor.substring(3, 4), 16) * 17;
    }
  }
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Extract the base color (no opacity) from a color string
const extractBaseColor = (color: string): string => {
  // Handle rgba format
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      return `rgb(${r}, ${g}, ${b})`;
    }
  } 
  // Handle rgb format
  else if (color.startsWith('rgb(')) {
    return color;
  }
  // Handle hex format with alpha
  else if (color.startsWith('#') && (color.length === 9 || color.length === 5)) {
    return color.substring(0, 7);
  }
  
  return color; // Return original if it's a standard hex or other format
};

// Extract opacity from color value
const getOpacityFromColor = (color: string): number => {
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    return match ? parseFloat(match[4]) : 1;
  }
  return 1; // Default opacity
};

// Track original base colors (without opacity)
const initialBaseColors = {
  dots: '#000000',
  cornerDots: '#000000',
  background: '#ffffff'
};

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
  // Store base colors (without opacity)
  const [dotsBaseColor, setDotsBaseColor] = useState(extractBaseColor(options.dotsOptions.color) || initialBaseColors.dots);
  const [cornerDotsBaseColor, setCornerDotsBaseColor] = useState(
    options.cornersDotOptions?.color
      ? extractBaseColor(options.cornersDotOptions.color)
      : extractBaseColor(options.dotsOptions.color) || initialBaseColors.cornerDots
  );
  const [backgroundBaseColor, setBackgroundBaseColor] = useState(
    extractBaseColor(options.backgroundOptions.color) || initialBaseColors.background
  );
  
  // Create references for all color pickers
  const dotsColorPickerRef = React.useRef<HTMLDivElement>(null);
  const cornerDotsColorPickerRef = React.useRef<HTMLDivElement>(null);
  const backgroundColorPickerRef = React.useRef<HTMLDivElement>(null);
  
  // Extract opacities or set defaults
  const [dotsOpacity, setDotsOpacity] = useState(getOpacityFromColor(options.dotsOptions.color));
  const [cornerDotsOpacity, setCornerDotsOpacity] = useState(
    options.cornersDotOptions?.color 
      ? getOpacityFromColor(options.cornersDotOptions.color)
      : getOpacityFromColor(options.dotsOptions.color)
  );
  const [backgroundOpacity, setBackgroundOpacity] = useState(getOpacityFromColor(options.backgroundOptions.color));

  // Handle clicks outside of color pickers
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Skip if click was inside a color picker
      if (
        (dotsColorPickerRef.current && dotsColorPickerRef.current.contains(e.target as Node)) ||
        (cornerDotsColorPickerRef.current && cornerDotsColorPickerRef.current.contains(e.target as Node)) ||
        (backgroundColorPickerRef.current && backgroundColorPickerRef.current.contains(e.target as Node)) ||
        (colorPickerRef.current && colorPickerRef.current.contains(e.target as Node))
      ) {
        return;
      }
      
      // Close any open color picker
      if (activeColorPicker) {
        setActiveColorPicker(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick, true);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick, true);
    };
  }, [activeColorPicker, setActiveColorPicker, colorPickerRef]);

  // Prevent closing color picker when clicking inside
  useEffect(() => {
    const handleClickInside = (e: MouseEvent) => {
      if (colorPickerRef.current && colorPickerRef.current.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleClickInside, true);
    return () => {
      document.removeEventListener('click', handleClickInside, true);
    };
  }, [colorPickerRef]);

  // Handle color change for dots
  const handleDotsColorChange = (color: string) => {
    setDotsBaseColor(color);
    const newColor = hexToRgba(color, dotsOpacity);
    setOptions((prev) => ({
      ...prev,
      dotsOptions: { ...prev.dotsOptions, color: newColor }
    }));
  };

  // Handle color change for corner dots
  const handleCornerDotsColorChange = (color: string) => {
    setCornerDotsBaseColor(color);
    const newColor = hexToRgba(color, cornerDotsOpacity);
    setOptions((prev) => ({
      ...prev,
      cornersDotOptions: { ...prev.cornersDotOptions, color: newColor }
    }));
  };

  // Handle color change for background
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundBaseColor(color);
    const newColor = hexToRgba(color, backgroundOpacity);
    setOptions((prev) => ({
      ...prev,
      backgroundOptions: { ...prev.backgroundOptions, color: newColor }
    }));
  };

  // Handle opacity change for dots
  const handleDotsOpacityChange = (opacity: number) => {
    setDotsOpacity(opacity);
    const newColor = hexToRgba(dotsBaseColor, opacity);
    setOptions((prev) => ({
      ...prev,
      dotsOptions: { ...prev.dotsOptions, color: newColor }
    }));
  };

  // Handle opacity change for corner dots
  const handleCornerDotsOpacityChange = (opacity: number) => {
    setCornerDotsOpacity(opacity);
    const newColor = hexToRgba(cornerDotsBaseColor, opacity);
    setOptions((prev) => ({
      ...prev,
      cornersDotOptions: { ...prev.cornersDotOptions, color: newColor }
    }));
  };

  // Handle opacity change for background
  const handleBackgroundOpacityChange = (opacity: number) => {
    setBackgroundOpacity(opacity);
    const newColor = hexToRgba(backgroundBaseColor, opacity);
    setOptions((prev) => ({
      ...prev,
      backgroundOptions: { ...prev.backgroundOptions, color: newColor }
    }));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">QR Code Colors</h2>
      <p className="text-sm text-gray-500 mb-6">Customize the colors of your QR code components.</p>
      
      <div className="space-y-4 divide-y divide-gray-100">
        <ColorRow
          label="QR Dots"
          color={dotsBaseColor} 
          onChange={handleDotsColorChange}
          isActive={activeColorPicker === 'dots'}
          onToggle={() => setActiveColorPicker(activeColorPicker === 'dots' ? null : 'dots')}
          useGradient={useDotsGradient}
          onGradientToggle={setUseDotsGradient}
          options={options}
          setOptions={setOptions}
          optionsKey="dotsOptions"
          colorPickerRef={dotsColorPickerRef}
          opacity={dotsOpacity}
          onOpacityChange={handleDotsOpacityChange}
        />
        
        <ColorRow
          label="Corner Dots"
          color={cornerDotsBaseColor} 
          onChange={handleCornerDotsColorChange}
          isActive={activeColorPicker === 'cornerDots'}
          onToggle={() => setActiveColorPicker(activeColorPicker === 'cornerDots' ? null : 'cornerDots')}
          useGradient={false}
          onGradientToggle={() => {}}
          options={options}
          setOptions={setOptions}
          colorPickerRef={cornerDotsColorPickerRef}
          opacity={cornerDotsOpacity}
          onOpacityChange={handleCornerDotsOpacityChange}
        />
        
        <ColorRow
          label="Background"
          color={backgroundBaseColor} 
          onChange={handleBackgroundColorChange}
          isActive={activeColorPicker === 'background'}
          onToggle={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
          useGradient={useBackgroundGradient}
          onGradientToggle={setUseBackgroundGradient}
          options={options}
          setOptions={setOptions}
          optionsKey="backgroundOptions"
          colorPickerRef={backgroundColorPickerRef}
          opacity={backgroundOpacity}
          onOpacityChange={handleBackgroundOpacityChange}
        />
      </div>
    </div>
  );
}