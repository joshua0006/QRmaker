/**
 * QRTypeSelector component for choosing the type of QR code
 */
import React from 'react';
import { Link, Mail, Phone, MessageSquare } from 'lucide-react';
import { QRCodeType } from '../../../../types/qr';
import { qrTypes } from '../../../../data/qrTypes';

interface QRTypeSelectorProps {
  selectedType: QRCodeType;
  onTypeChange: (type: QRCodeType) => void;
}

const typeLabels = {
  url: 'WWW',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS'
};

const typeIcons = {
  url: Link,
  email: Mail,
  phone: Phone,
  sms: MessageSquare
};

export default function QRTypeSelector({ selectedType, onTypeChange }: QRTypeSelectorProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        QR Code Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {qrTypes.map((type) => {
          const Icon = typeIcons[type.type];
          return (
            <button
              key={type.type}
              onClick={() => onTypeChange(type.type)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                selectedType === type.type
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-200 text-gray-600'
              }`}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{typeLabels[type.type]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}