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
    try {
      // Always create a fresh instance to avoid state conflicts
      const qrInstance = new QRCodeStyling({
        ...options,
        data: url || 'https://example.com', // Default URL with valid format
        image: logoUrl || undefined,
      });
      
      qrCode.current = qrInstance;
      
      console.log('QR code instance created with data:', url || 'https://example.com');
    } catch (error) {
      console.error('Failed to initialize QR code:', error);
    }
  }, []);

  // Append QR code to container when ref is available
  useEffect(() => {
    if (qrCode.current && qrRef.current) {
      try {
        // Clear previous content
        qrRef.current.innerHTML = '';
        
        // Append QR code to the container
        qrCode.current.append(qrRef.current);
        
        console.log('QR code appended to container');
      } catch (error) {
        console.error('Error appending QR code to container:', error);
      }
    }
  }, [qrRef]);

  // Update QR code when options, url, or logo changes
  useEffect(() => {
    if (qrCode.current) {
      const updateQRCode = async () => {
        try {
          // Update QR code with new options
          qrCode.current?.update({
            ...options,
            data: url || 'https://example.com',
            image: logoUrl || undefined,
          });
          
          console.log('QR code updated with data:', url || 'https://example.com');
          
          // Force reappend the QR code to solve potential display issues
          if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.current.append(qrRef.current);
          }
        } catch (error) {
          console.error('Failed to update QR code:', error);
        }
      };
      updateQRCode();
    }
  }, [options, url, logoUrl, uniqueId]);

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