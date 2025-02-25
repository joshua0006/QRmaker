/**
 * Custom hook to manage color picker state and click outside behavior
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useColorPicker() {
  const [activeColorPicker, setActiveColorPicker] = useState<'dots' | 'cornerDots' | 'border' | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Only process if there's an active picker
    if (!activeColorPicker) return;

    // Check if click target is outside the color picker
    const isOutside = colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node);
    
    if (isOutside) {
      setActiveColorPicker(null);
    }
  }, [activeColorPicker]);

  useEffect(() => {
    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside, true);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [activeColorPicker, handleClickOutside]);

  return { activeColorPicker, setActiveColorPicker, colorPickerRef };
}