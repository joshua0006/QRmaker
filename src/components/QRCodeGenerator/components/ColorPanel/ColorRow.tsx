/**
 * ColorRow component for a single color control row with gradient toggle
 */
import React from 'react';
import ColorPickerInput from '../../../common/ColorPickerInput';
import { QROptions } from '../../../../types/qr';
import { dotColorPresets, backgroundColorPresets } from '../../../../data/colorPresets';
import GradientColorPicker from './GradientColorPicker';
import { useClickOutside } from '../../../../hooks/useClickOutside';

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
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
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
  colorPickerRef,
  opacity = 1,
  onOpacityChange
}: ColorRowProps) {
  const colorPresets = label.toLowerCase().includes('background') ? backgroundColorPresets : dotColorPresets;
  const currentGradient = optionsKey && options?.[optionsKey]?.gradient;
  const [activeGradientPicker, setActiveGradientPicker] = React.useState<'start' | 'end' | null>(null);

  // Get gradient opacities
  const startOpacity = React.useMemo(() => {
    if (!currentGradient || !currentGradient.colorStops || currentGradient.colorStops.length === 0) return 1;
    const color = currentGradient.colorStops[0].color;
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      return match ? parseFloat(match[4]) : 1;
    }
    return 1;
  }, [currentGradient]);

  const endOpacity = React.useMemo(() => {
    if (!currentGradient || !currentGradient.colorStops || currentGradient.colorStops.length < 2) return 1;
    const color = currentGradient.colorStops[1].color;
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      return match ? parseFloat(match[4]) : 1;
    }
    return 1;
  }, [currentGradient]);

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

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onOpacityChange) {
      onOpacityChange(parseFloat(e.target.value));
    }
  };

  // Handle opacity change for gradient colors
  const handleStartOpacityChange = (opacity: number) => {
    if (!setOptions || !optionsKey || !currentGradient) return;
    
    const originalColor = currentGradient.colorStops[0].color;
    let r = 0, g = 0, b = 0;
    
    if (originalColor.startsWith('rgba')) {
      const match = originalColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      }
    } else if (originalColor.startsWith('rgb')) {
      const match = originalColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      }
    } else if (originalColor.startsWith('#')) {
      // Extract RGB from hex format
      let hexColor = originalColor;
      
      // Remove alpha component if it exists
      if (originalColor.length === 9) {
        hexColor = originalColor.substring(0, 7);
      } else if (originalColor.length === 5) {
        hexColor = originalColor.substring(0, 4);
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
    
    const newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    handleGradientColorChange(0, newColor);
  };

  const handleEndOpacityChange = (opacity: number) => {
    if (!setOptions || !optionsKey || !currentGradient) return;
    
    const originalColor = currentGradient.colorStops[1].color;
    let r = 0, g = 0, b = 0;
    
    if (originalColor.startsWith('rgba')) {
      const match = originalColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      }
    } else if (originalColor.startsWith('rgb')) {
      const match = originalColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      }
    } else if (originalColor.startsWith('#')) {
      // Extract RGB from hex format
      let hexColor = originalColor;
      
      // Remove alpha component if it exists
      if (originalColor.length === 9) {
        hexColor = originalColor.substring(0, 7);
      } else if (originalColor.length === 5) {
        hexColor = originalColor.substring(0, 4);
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
    
    const newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    handleGradientColorChange(1, newColor);
  };

  // Create separate refs for each color picker
  const gradientStartRef = React.useRef<HTMLDivElement>(null);
  const gradientEndRef = React.useRef<HTMLDivElement>(null);
  
  // Create a clean dropdown for gradient type
  const [showTypeOptions, setShowTypeOptions] = React.useState(false);
  const typeDropdownRef = React.useRef<HTMLDivElement>(null);
  
  useClickOutside(typeDropdownRef, () => {
    setShowTypeOptions(false);
  });

  // Handle clicking outside of gradient pickers to close them
  useClickOutside(gradientStartRef, () => {
    if (activeGradientPicker === 'start') {
      setActiveGradientPicker(null);
    }
  });

  useClickOutside(gradientEndRef, () => {
    if (activeGradientPicker === 'end') {
      setActiveGradientPicker(null);
    }
  });

  // Create custom handlers for color picker clicks
  const handleColorPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          
          {optionsKey && (
            <button
              onClick={() => handleGradientToggle(!useGradient)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                useGradient 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {useGradient ? 'Using Gradient' : 'Use Gradient'}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6 flex-wrap pl-2 min-h-[48px]" onClick={handleColorPickerClick}>
        {!useGradient ? (
          <div className="flex items-center gap-4 flex-wrap w-full">
            <ColorPickerInput
              label=""
              color={color}
              onChange={onChange}
              presets={colorPresets}
            />
            
            {/* Opacity slider */}
            {onOpacityChange && (
              <div className="flex items-center gap-2 ml-2">
                <label className="text-xs text-gray-600">Opacity:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={opacity} 
                  onChange={handleOpacityChange}
                  className="w-24"
                />
                <span className="text-xs text-gray-600 w-8">{Math.round(opacity * 100)}%</span>
              </div>
            )}
          </div>
        ) : (
          optionsKey && currentGradient && (
            <div className="flex items-center gap-4 flex-wrap w-full">
              <GradientColorPicker
                startColor={currentGradient.colorStops[0].color}
                endColor={currentGradient.colorStops[1].color}
                onStartColorChange={(color) => handleGradientColorChange(0, color)}
                onEndColorChange={(color) => handleGradientColorChange(1, color)}
                activeColorPicker={activeGradientPicker}
                setActiveColorPicker={setActiveGradientPicker}
                colorPickerRef={colorPickerRef}
                startOpacity={startOpacity}
                endOpacity={endOpacity}
                onStartOpacityChange={handleStartOpacityChange}
                onEndOpacityChange={handleEndOpacityChange}
              />

              <div className="flex items-center gap-3 ml-2">
                <div className="relative" ref={typeDropdownRef}>
                  <button
                    onClick={() => setShowTypeOptions(!showTypeOptions)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>{currentGradient.type === 'linear' ? 'Linear' : 'Radial'}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {showTypeOptions && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-100 rounded-md shadow-lg z-10">
                      <button
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${currentGradient.type === 'linear' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        onClick={() => {
                          handleGradientTypeChange('linear');
                          setShowTypeOptions(false);
                        }}
                      >
                        Linear
                      </button>
                      <button
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${currentGradient.type === 'radial' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        onClick={() => {
                          handleGradientTypeChange('radial');
                          setShowTypeOptions(false);
                        }}
                      >
                        Radial
                      </button>
                    </div>
                  )}
                </div>
                
                {currentGradient.type === 'linear' && (
                  <div className="flex items-center gap-2 ml-2">
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
                
                {/* Opacity controls for gradient */}
                <div className="flex items-center gap-3 ml-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">From:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={startOpacity} 
                      onChange={(e) => handleStartOpacityChange(parseFloat(e.target.value))}
                      className="w-16"
                    />
                    <span className="text-xs text-gray-600 w-8">{Math.round(startOpacity * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">To:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={endOpacity} 
                      onChange={(e) => handleEndOpacityChange(parseFloat(e.target.value))}
                      className="w-16"
                    />
                    <span className="text-xs text-gray-600 w-8">{Math.round(endOpacity * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}