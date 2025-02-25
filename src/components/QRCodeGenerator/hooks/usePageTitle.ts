/**
 * Custom hook to update page title based on QR code type
 */
import { useEffect } from 'react';
import { QRCodeType } from '../../../types/qr';
import { qrTypes } from '../../../data/qrTypes';

export function usePageTitle(type: QRCodeType) {
  useEffect(() => {
    const typeConfig = qrTypes.find(t => t.type === type)!;
    document.title = `Create ${typeConfig.label} QR Code - Free QR Code Generator`;
  }, [type]);
}