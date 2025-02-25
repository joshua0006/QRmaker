/**
 * Main QR Code Generator component that orchestrates all the sub-components
 * and manages the shared state between them.
 */
import React, { useRef, useState } from 'react';
import { PresetType, QROptions, QRCodeType } from '../../types/qr';
import { defaultOptions } from './constants';
import { qrTypes } from '../../data/qrTypes';
import Header from './components/Header';
import Preview from './components/Preview/index';
import CustomizePanel from './components/CustomizePanel';
import ColorPanel from './components/ColorPanel';
import SaveSection from './components/SaveSection';
import AdvancedSettings from './components/AdvancedSettings';
import { useQRCode } from './hooks/useQRCode';
import { useColorPicker } from './hooks/useColorPicker';
import { usePageTitle } from './hooks/usePageTitle';
import { nanoid } from 'nanoid';

export default function QRCodeGenerator() {
  // Core state
  const [type, setType] = useState<QRCodeType>('url');
  usePageTitle(type);
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [activePreset, setActivePreset] = useState<PresetType>('simple');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Border state
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [borderRadius, setBorderRadius] = useState(0);
  
  // Banner state
  const [bannerPosition, setBannerPosition] = useState<'none' | 'top' | 'bottom'>('none');
  const [bannerText, setBannerText] = useState('');
  const [bannerColor, setBannerColor] = useState('#000000');
  const [bannerTextColor, setBannerTextColor] = useState('#FFFFFF');
  const [bannerWidth, setBannerWidth] = useState(80);
  const [bannerFontSize, setBannerFontSize] = useState(16);
  const [bannerFontFamily, setBannerFontFamily] = useState('system-ui');
  const [bannerBold, setBannerBold] = useState(false);
  const [bannerItalic, setBannerItalic] = useState(false);
  
  // Gradient states
  const [useDotsGradient, setUseDotsGradient] = useState(false);
  const [useBackgroundGradient, setUseBackgroundGradient] = useState(false);
  
  // Refs and custom hooks
  const qrRef = useRef<HTMLDivElement>(null);
  const { activeColorPicker, colorPickerRef, setActiveColorPicker } = useColorPicker();
  const [uniqueId, setUniqueId] = useState(() => nanoid(8));
  const qrCode = useQRCode(qrRef, options, url, logoUrl, uniqueId);

  // Format URL based on type when generating QR code
  const getFormattedData = () => {
    const typeConfig = qrTypes.find(t => t.type === type)!;
    return typeConfig.format(url);
  };

  return (
    <div className="p-8">
      <div className="max-w-[84rem] mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <CustomizePanel
            type={type}
            setType={setType}
            url={url}
            setUrl={setUrl}
            options={options}
            setOptions={setOptions}
            activePreset={activePreset}
            setActivePreset={setActivePreset}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            setBorderColor={setBorderColor}
            setBannerColor={setBannerColor}
            setBannerTextColor={setBannerTextColor}
            setUseDotsGradient={setUseDotsGradient}
            useDotsGradient={useDotsGradient}
          />

          <Preview
            qrRef={qrRef}
            borderWidth={borderWidth}
            borderStyle={borderStyle}
            borderColor={borderColor}
            borderRadius={borderRadius}
            qrCode={qrCode}
            bannerPosition={bannerPosition}
            bannerText={bannerText}
            bannerColor={bannerColor}
            bannerTextColor={bannerTextColor}
            bannerWidth={bannerWidth}
            bannerFontSize={bannerFontSize}
            bannerFontFamily={bannerFontFamily}
            bannerBold={bannerBold}
            bannerItalic={bannerItalic}
          />
        </div>

        <ColorPanel
          options={options}
          setOptions={setOptions}
          useDotsGradient={useDotsGradient}
          setUseDotsGradient={setUseDotsGradient}
          useBackgroundGradient={useBackgroundGradient}
          setUseBackgroundGradient={setUseBackgroundGradient}
          activeColorPicker={activeColorPicker}
          setActiveColorPicker={setActiveColorPicker}
          colorPickerRef={colorPickerRef}
        />
        <AdvancedSettings
          options={options}
          setOptions={setOptions}
          borderWidth={borderWidth}
          setBorderWidth={setBorderWidth}
          borderStyle={borderStyle}
          setBorderStyle={setBorderStyle}
          borderColor={borderColor}
          setBorderColor={setBorderColor}
          borderRadius={borderRadius}
          setBorderRadius={setBorderRadius}
          activeColorPicker={activeColorPicker}
          setActiveColorPicker={setActiveColorPicker}
          colorPickerRef={colorPickerRef}
          bannerPosition={bannerPosition}
          setBannerPosition={setBannerPosition}
          bannerText={bannerText}
          setBannerText={setBannerText}
          bannerColor={bannerColor}
          setBannerColor={setBannerColor}
          bannerTextColor={bannerTextColor}
          setBannerTextColor={setBannerTextColor}
          bannerWidth={bannerWidth}
          setBannerWidth={setBannerWidth}
          bannerFontSize={bannerFontSize}
          setBannerFontSize={setBannerFontSize}
          bannerFontFamily={bannerFontFamily}
          setBannerFontFamily={setBannerFontFamily}
          bannerBold={bannerBold}
          setBannerBold={setBannerBold}
          bannerItalic={bannerItalic}
          setBannerItalic={setBannerItalic}
          qrCode={qrCode}
          url={url}
          logoUrl={logoUrl}
        />

        <SaveSection
          qrCode={qrCode}
          uniqueId={uniqueId}
          setUniqueId={setUniqueId}
          options={options}
          url={url}
          logoUrl={logoUrl}
          borderWidth={borderWidth}
          borderStyle={borderStyle}
          borderColor={borderColor}
          borderRadius={borderRadius}
          bannerPosition={bannerPosition}
          bannerText={bannerText}
          bannerColor={bannerColor}
          bannerTextColor={bannerTextColor}
          bannerWidth={bannerWidth}
          bannerFontSize={bannerFontSize}
          bannerFontFamily={bannerFontFamily}
          bannerBold={bannerBold}
          bannerItalic={bannerItalic}
        />
      </div>
    </div>
  );
}