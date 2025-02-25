/**
 * CornerStyles component for customizing corner squares and dots
 */
import React from 'react';
import { QROptions } from '../../../../types/qr';

interface CornerStylesProps {
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
}

export default function CornerStyles({ options, setOptions }: CornerStylesProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Corner Styles</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Corner Square Style
        </label>
        <select
          value={options.cornersSquareOptions?.type || 'square'}
          onChange={(e) => setOptions(prev => ({
            ...prev,
            cornersSquareOptions: {
              ...prev.cornersSquareOptions,
              type: e.target.value as 'dot' | 'square' | 'extra-rounded'
            }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="square">Square</option>
          <option value="dot">Dot</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Corner Dot Style
        </label>
        <select
          value={options.cornersDotOptions?.type || 'square'}
          onChange={(e) => setOptions(prev => ({
            ...prev,
            cornersDotOptions: {
              ...prev.cornersDotOptions,
              type: e.target.value as 'dot' | 'square' | 'extra-rounded'
            }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="square">Square</option>
          <option value="dot">Dot</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </div>
    </div>
  );
}