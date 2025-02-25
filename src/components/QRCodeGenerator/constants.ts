/**
 * Default configuration for the QR code generator
 */
import { QROptions } from '../../types/qr';

export const defaultOptions: QROptions = {
  width: 550,
  height: 550,
  type: 'svg',
  data: 'https://example.com',
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    crossOrigin: 'anonymous'
  },
  dotsOptions: {
    color: '#000000',
    type: 'square'
  },
  backgroundOptions: {
    color: '#ffffff'
  }
};