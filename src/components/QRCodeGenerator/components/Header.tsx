/**
 * Header component with title and description
 */
import React from 'react';

export default function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Create Beautiful QR Codes
      </h1>
      <p className="text-lg text-gray-600">
        Generate custom QR codes with your brand colors and logo
      </p>
    </div>
  );
}