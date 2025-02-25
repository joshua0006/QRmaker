/**
 * QR code type configurations
 */
import { QRTypeConfig } from '../types/qr';

export const qrTypes: QRTypeConfig[] = [
  {
    type: 'url',
    label: 'Website URL',
    prefix: '',
    placeholder: 'www.example.com',
    validate: (value: string) => {
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return true;
      } catch {
        return false;
      }
    },
    format: (value: string) => value.startsWith('http') ? value : `https://${value}`
  },
  {
    type: 'email',
    label: 'Email Address',
    prefix: '',
    placeholder: 'Enter email address',
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    format: (value: string) => `mailto:${value}`
  },
  {
    type: 'phone',
    label: 'Phone Number',
    prefix: '',
    placeholder: 'Enter phone number',
    validate: (value: string) => {
      const phoneRegex = /^\+?[\d\s-()]{8,}$/;
      return phoneRegex.test(value);
    },
    format: (value: string) => `tel:${value.replace(/[\s-()]/g, '')}`
  },
  {
    type: 'sms',
    label: 'SMS Number',
    prefix: '',
    placeholder: 'Enter phone number for SMS',
    validate: (value: string) => {
      const phoneRegex = /^\+?[\d\s-()]{8,}$/;
      return phoneRegex.test(value);
    },
    format: (value: string) => `smsto:${value.replace(/[\s-()]/g, '')}`
  }
];