/**
 * BannerControls component for customizing the QR code banner
 */
import React from 'react';
import ColorPickerInput from '../../../common/ColorPickerInput';

interface BannerControlsProps {
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
  activeColorPicker: 'banner' | 'bannerText' | null;
  setActiveColorPicker: (picker: 'banner' | 'bannerText' | null) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function BannerControls({
  bannerPosition,
  setBannerPosition,
  bannerText,
  setBannerText,
  bannerColor,
  setBannerColor,
  bannerTextColor,
  setBannerTextColor,
  bannerWidth,
  setBannerWidth,
  bannerFontSize,
  setBannerFontSize,
  bannerFontFamily,
  setBannerFontFamily,
  bannerBold,
  setBannerBold,
  bannerItalic,
  setBannerItalic,
  activeColorPicker,
  setActiveColorPicker,
  colorPickerRef
}: BannerControlsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Banner</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Position
          </label>
          <select
            value={bannerPosition}
            onChange={(e) => setBannerPosition(e.target.value as 'none' | 'top' | 'bottom')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">No Banner</option>
            <option value="top">Above QR Code</option>
            <option value="bottom">Below QR Code</option>
          </select>
        </div>

        {bannerPosition !== 'none' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Width
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={bannerWidth}
                onChange={(e) => setBannerWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>50%</span>
                <span>{bannerWidth}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="32"
                value={bannerFontSize}
                onChange={(e) => setBannerFontSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>12px</span>
                <span>{bannerFontSize}px</span>
                <span>32px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={bannerFontFamily}
                onChange={(e) => setBannerFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="system-ui">System Default</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
              </select>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bannerBold}
                  onChange={(e) => setBannerBold(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Bold</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bannerItalic}
                  onChange={(e) => setBannerItalic(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Italic</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Text
              </label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter banner text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <ColorPickerInput
              label="Banner Color"
              color={bannerColor}
              onChange={setBannerColor}
            />

            <ColorPickerInput
              label="Text Color"
              color={bannerTextColor}
              onChange={setBannerTextColor}
            />
          </>
        )}
      </div>
    </div>
  );
}