export type QRCodeType = 'url' | 'email' | 'phone' | 'sms';

export interface QRTypeConfig {
  type: QRCodeType;
  label: string;
  prefix: string;
  placeholder: string;
  validate: (value: string) => boolean;
  format: (value: string) => string;
}

export interface QRCodeDocument {
  uniqueId: string;
  targetUrl: string;
  redirectUrl: string;
  scanCount: number;
  owner: string;
  createdAt: Date;
  name?: string;
  categoryId?: string;
  lastScanned?: Date;
  options?: Partial<QROptions>;
}

export interface QROptions {
  uniqueId?: string;
  width: number;
  height: number;
  type: 'svg' | 'canvas';
  data: string;
  margin: number;
  qrOptions: {
    typeNumber: number;
    mode: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin?: string;
  };
  dotsOptions: {
    color: string;
    type: string;
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: Array<{
        offset: number;
        color: string;
      }>;
    };
  };
  backgroundOptions: {
    color: string;
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: Array<{
        offset: number;
        color: string;
      }>;
    };
  };
  cornersSquareOptions?: {
    type?: 'dot' | 'square' | 'extra-rounded';
    color?: string;
  };
  cornersDotOptions?: {
    type?: 'dot' | 'square' | 'extra-rounded';
    color?: string;
  };
  image?: string;
  download?: {
    name: string;
    extension: string;
  };
  qrData?: QRCodeDocument;
  
}

export type PresetType = 'simple' | 'gradient' | 'rounded' | 'dots' | 'elegant' | 'custom';

export interface Preset {
  name: string;
  type: PresetType;
  options: Partial<QROptions>;
}