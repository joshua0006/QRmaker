/**
 * URL input component with icon
 */
import React, { useEffect } from 'react';
import { QRCodeType } from '../../../../types/qr';
import { qrTypes } from '../../../../data/qrTypes';
import { useRef } from 'react';

interface URLInputProps {
  type: QRCodeType;
  url: string;
  setUrl: (url: string) => void;
}

export default function URLInput({ type, url, setUrl }: URLInputProps) {
  const typeConfig = qrTypes.find(t => t.type === type)!;
  const [error, setError] = React.useState<string>('');
  const [displayValue, setDisplayValue] = React.useState('');
  const previousTypeRef = useRef(type);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear input and reset display value when type changes
  useEffect(() => {
    if (previousTypeRef.current !== type) {
      setUrl('');
      setDisplayValue('');
      setError('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      previousTypeRef.current = type;
    }
  }, [type, url]);

  const handleChange = (value: string) => {
    setDisplayValue(value);
    
    let formattedValue = value;
    let validationValue = value;

    switch (type) {
      case 'url':
        formattedValue = value.startsWith('http') ? value : `https://${value}`;
        validationValue = value;
        break;
      case 'email':
        formattedValue = `mailto:${value}`;
        validationValue = value;
        break;
      case 'phone':
        formattedValue = `tel:${value.replace(/[\s-()]/g, '')}`;
        validationValue = value;
        break;
      case 'sms':
        formattedValue = `smsto:${value.replace(/[\s-()]/g, '')}`;
        validationValue = value;
        break;
    }
    
    setUrl(formattedValue);
    
    if (value && !typeConfig.validate(validationValue)) {
      setError(`Please enter a valid ${typeConfig.label.toLowerCase()}`);
    } else {
      setError('');
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {typeConfig.label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={typeConfig.placeholder}
        />
      </div>
      {error && displayValue && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}