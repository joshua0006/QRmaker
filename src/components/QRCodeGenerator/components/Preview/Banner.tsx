/**
 * Banner component for displaying text above or below the QR code
 */
import React from 'react';

interface BannerProps {
  text: string;
  color: string;
  textColor: string;
  width: number;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
}

export default function Banner({
  text,
  color,
  textColor,
  width,
  fontSize,
  fontFamily,
  bold,
  italic
}: BannerProps) {
  const bannerHeight = 60;

  return (
    <div
      className="rounded-lg font-medium mx-auto"
      style={{
        backgroundColor: color,
        width: `${width}%`,
        height: `${bannerHeight}px`,
        overflow: 'hidden'
      }}
    >
      <svg
        width="100%"
        height={bannerHeight}
        viewBox={`0 0 ${width} ${bannerHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: `${fontFamily}, system-ui, -apple-system, sans-serif`,
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal'
          }}
        >
          {text || 'Banner Text'}
        </text>
      </svg>
    </div>
  );
}