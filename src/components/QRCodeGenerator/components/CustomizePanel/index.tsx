/**
 * CustomizePanel component that contains all QR code customization controls
 */
import React from 'react';
import { PresetType, QROptions, QRCodeType } from '../../../../types/qr';
import QRTypeSelector from './QRTypeSelector';
import URLInput from './URLInput';
import PresetSelector from './PresetSelector';
import LogoUploader from './LogoUploader';

interface CustomizePanelProps {
  type: QRCodeType;
  setType: (type: QRCodeType) => void;
  url: string;
  setUrl: (url: string) => void;
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
  activePreset: PresetType;
  setActivePreset: (preset: PresetType) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  setBorderColor: (color: string) => void;
  setBannerColor: (color: string) => void;
  setBannerTextColor: (color: string) => void;
}

export default function CustomizePanel(props: CustomizePanelProps) {
  return (
    <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Customize</h2>
      
      <QRTypeSelector
        selectedType={props.type}
        onTypeChange={props.setType}
      />
      <URLInput
        type={props.type}
        url={props.url}
        setUrl={props.setUrl}
      />
      <PresetSelector
        activePreset={props.activePreset}
        setActivePreset={props.setActivePreset}
        setOptions={props.setOptions}
      />
      <LogoUploader
        logoUrl={props.logoUrl}
        setLogoUrl={props.setLogoUrl}
        setBorderColor={props.setBorderColor}
        setBannerColor={props.setBannerColor}
        setBannerTextColor={props.setBannerTextColor}
        options={props.options}
        setOptions={props.setOptions}
      />
    </div>
  );
}