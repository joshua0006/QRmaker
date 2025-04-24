/**
 * QRDisplay component for rendering the QR code with border styling
 */
import React, { useEffect } from 'react';

interface QRDisplayProps {
  qrRef: React.RefObject<HTMLDivElement>;
  borderWidth: number;
  borderStyle: string;
  borderColor: string;
  borderRadius: number;
}

export default function QRDisplay({
  qrRef,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius
}: QRDisplayProps) {
  // Make sure the QR container is always visible and has minimum dimensions
  useEffect(() => {
    if (qrRef.current) {
      // Force a layout recalculation by triggering a reflow
      qrRef.current.style.display = 'block';
      qrRef.current.getBoundingClientRect();
    }
  }, [qrRef]);

  return (
    <div 
      ref={qrRef}
      style={{
        border: borderWidth ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
        borderRadius: borderRadius ? `${borderRadius}px` : '0',
        padding: borderWidth ? '16px' : '0',
        backgroundColor: 'white',
        minWidth: '256px',
        minHeight: '256px',
        display: 'block',
        position: 'relative'
      }}
    />
  );
}