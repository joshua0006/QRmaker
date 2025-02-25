/**
 * AdvancedSettings component for additional QR code customization options
 */
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { QROptions } from '../../../../types/qr';
import QRCodeSettings from './QRCodeSettings';
import CornerStyles from './CornerStyles';
import BannerControls from './BannerControls';

interface AdvancedSettingsProps {
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  setBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  borderColor: string;
  setBorderColor: (color: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  activeColorPicker: 'dots' | 'cornerDots' | 'border' | null;
  setActiveColorPicker: (picker: 'dots' | 'cornerDots' | 'border' | null) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  bannerPosition: 'none' | 'top' | 'bottom';
  setBannerPosition: (position: 'none' | 'top' | 'bottom') => void;
  bannerText: string;
  setBannerText: (text: string) => void;
  bannerColor: string;
  setBannerColor: (color: string) => void;
  bannerTextColor: string;
  setBannerTextColor: (color: string) => void;
  bannerWidth: number;
  setBannerWidth: (width: number) => void;
  bannerFontSize: number;
  setBannerFontSize: (size: number) => void;
  bannerFontFamily: string;
  setBannerFontFamily: (font: string) => void;
  bannerBold: boolean;
  setBannerBold: (bold: boolean) => void;
  bannerItalic: boolean;
  setBannerItalic: (italic: boolean) => void;
}

export default function AdvancedSettings(props: AdvancedSettingsProps) {
  return (
    <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Style & Settings</h2>
        <button
          onClick={() => props.setOptions(prev => ({ ...prev }))}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Reset to Default
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">QR Code Pattern</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Correction
                </label>
                <select
                  value={props.options.qrOptions.errorCorrectionLevel}
                  onChange={(e) => props.setOptions(prev => ({
                    ...prev,
                    qrOptions: {
                      ...prev.qrOptions,
                      errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="L">Basic (7% recovery)</option>
                  <option value="M">Standard (15% recovery)</option>
                  <option value="Q">High (25% recovery)</option>
                  <option value="H">Maximum (30% recovery)</option>
                </select>
                <p className="mt-1.5 text-sm text-gray-500">
                  Higher levels make the QR code more resistant to damage but increase pattern density
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern Style
                </label>
                <select
                  value={props.options.dotsOptions.type}
                  onChange={(e) => props.setOptions(prev => ({
                    ...prev,
                    dotsOptions: {
                      ...prev.dotsOptions,
                      type: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="square">Square (Classic)</option>
                  <option value="dots">Dots (Modern)</option>
                  <option value="rounded">Rounded (Soft)</option>
                  <option value="classy">Classy (Elegant)</option>
                  <option value="classy-rounded">Classy Rounded (Smooth)</option>
                  <option value="extra-rounded">Extra Rounded (Fluid)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Corner Square Style
                </label>
                <select
                  value={props.options.cornersSquareOptions?.type || 'square'}
                  onChange={(e) => props.setOptions(prev => ({
                    ...prev,
                    cornersSquareOptions: {
                      ...prev.cornersSquareOptions,
                      type: e.target.value as 'dot' | 'square' | 'extra-rounded'
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="square">Square (Default)</option>
                  <option value="dot">Dot (Circular)</option>
                  <option value="extra-rounded">Extra Rounded (Smooth)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Frame & Spacing</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outer Margin
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={props.options.margin}
                  onChange={(e) => props.setOptions(prev => ({
                    ...prev,
                    margin: Number(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>None</span>
                  <span>{props.options.margin}px</span>
                  <span>Maximum</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Width
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={props.borderWidth}
                  onChange={(e) => props.setBorderWidth(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>None</span>
                  <span>{props.borderWidth}px</span>
                  <span>Thick</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={props.borderRadius}
                  onChange={(e) => props.setBorderRadius(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Square</span>
                  <span>{props.borderRadius}px</span>
                  <span>Round</span>
                </div>
              </div>

              {props.borderWidth > 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Style
                    </label>
                    <select
                      value={props.borderStyle}
                      onChange={(e) => props.setBorderStyle(e.target.value as 'solid' | 'dashed' | 'dotted')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="solid">Solid Line</option>
                      <option value="dashed">Dashed Line</option>
                      <option value="dotted">Dotted Line</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                        style={{ backgroundColor: props.borderColor }}
                        onClick={() => props.setActiveColorPicker(props.activeColorPicker === 'border' ? null : 'border')}
                      />
                      {props.activeColorPicker === 'border' && (
                        <div className="absolute z-10 mt-2" ref={props.colorPickerRef}>
                          <div className="p-2 bg-white rounded-lg shadow-xl border border-gray-200">
                            <HexColorPicker color={props.borderColor} onChange={props.setBorderColor} />
                            <input
                              type="text"
                              value={props.borderColor}
                              onChange={(e) => props.setBorderColor(e.target.value)}
                              className="mt-2 w-full px-2 py-1 text-sm border border-gray-200 rounded-md"
                            />
                          </div>
                        </div>
                      )}
                      <input
                        type="text"
                        value={props.borderColor}
                        onChange={(e) => props.setBorderColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <BannerControls
          bannerPosition={props.bannerPosition}
          setBannerPosition={props.setBannerPosition}
          bannerText={props.bannerText}
          setBannerText={props.setBannerText}
          bannerColor={props.bannerColor}
          setBannerColor={props.setBannerColor}
          bannerTextColor={props.bannerTextColor}
          setBannerTextColor={props.setBannerTextColor}
          bannerWidth={props.bannerWidth}
          setBannerWidth={props.setBannerWidth}
          bannerFontSize={props.bannerFontSize}
          setBannerFontSize={props.setBannerFontSize}
          bannerFontFamily={props.bannerFontFamily}
          setBannerFontFamily={props.setBannerFontFamily}
          bannerBold={props.bannerBold}
          setBannerBold={props.setBannerBold}
          bannerItalic={props.bannerItalic}
          setBannerItalic={props.setBannerItalic}
          activeColorPicker={props.activeColorPicker}
          setActiveColorPicker={props.setActiveColorPicker}
          colorPickerRef={props.colorPickerRef}
        />
      </div>
    </div>
  );
}