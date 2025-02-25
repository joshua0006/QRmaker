/**
 * QRDisplay component for rendering the QR code with border styling
 */
import React from 'react';

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
  return (
    <div 
      ref={qrRef}
      style={{
        border: borderWidth ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
        borderRadius: borderRadius ? `${borderRadius}px` : '0',
        padding: borderWidth ? '16px' : '0',
        backgroundColor: 'white'
      }}
    />
  );
}