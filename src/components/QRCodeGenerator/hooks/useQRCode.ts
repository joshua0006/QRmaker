/**
 * Custom hook to manage QR code instance and updates
 * Handles initialization, updates, and cleanup of the QR code
 */
import { useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QROptions } from '../../../types/qr';

export function useQRCode(
  qrRef: React.RefObject<HTMLDivElement>,
  options: QROptions,
  url: string,
  logoUrl: string,
  uniqueId: string
) {
  const qrCode = useRef<QRCodeStyling>();

  // Initialize QR code instance
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        ...options,
        data: url || 'https://', // Static preview of the actual URL
        image: logoUrl || undefined
      });
    }
  }, []);

  // Append QR code to container when ref is available
  useEffect(() => {
    if (qrCode.current && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [qrRef]);

  // Update QR code when options, url, or logo changes
  useEffect(() => {
    if (qrCode.current) {
      const updateQRCode = async () => {
        try {
          qrCode.current?.update({
            ...options,
            data: url || 'https://', // Static preview of the actual URL
            image: logoUrl || undefined
          });
        } catch (error) {
          console.error('Failed to update QR code:', error);
        }
      };
      updateQRCode();
    }
  }, [options, url, logoUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, []);

  return qrCode.current;
}