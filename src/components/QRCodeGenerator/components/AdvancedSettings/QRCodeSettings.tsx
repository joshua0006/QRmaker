/**
 * QRCodeSettings component for error correction and dot style options
 */
import React from 'react';
import { QROptions } from '../../../../types/qr';

interface QRCodeSettingsProps {
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
}

export default function QRCodeSettings({ options, setOptions }: QRCodeSettingsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">QR Code Settings</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Error Correction Level
        </label>
        <select
          value={options.qrOptions.errorCorrectionLevel}
          onChange={(e) => setOptions(prev => ({
            ...prev,
            qrOptions: {
              ...prev.qrOptions,
              errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
            }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Higher levels allow for more data recovery if the code is damaged
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dot Style
        </label>
        <select
          value={options.dotsOptions.type}
          onChange={(e) => setOptions(prev => ({
            ...prev,
            dotsOptions: {
              ...prev.dotsOptions,
              type: e.target.value
            }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Margin Size
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={options.margin}
          onChange={(e) => setOptions(prev => ({
            ...prev,
            margin: Number(e.target.value)
          }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>{options.margin}</span>
          <span>50</span>
        </div>
      </div>
    </div>
  );
}