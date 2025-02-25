/**
 * Modal component for logo upload authentication
 */
import React from 'react';
import { X, QrCode } from 'lucide-react';
import { useAuthModal } from '../../../../hooks/useAuthModal';

interface LogoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoAuthModal({ isOpen, onClose }: LogoAuthModalProps) {
  const { openModal } = useAuthModal();

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose();
    openModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Add Your Logo
          </h2>
          <p className="text-gray-600">
            Sign in to upload and save your logo. This allows you to:
          </p>
          <ul className="mt-4 space-y-2 text-left text-gray-600">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
              Upload and store your logo securely
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
              Access your logo in future QR codes
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
              Manage multiple logos for different brands
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSignIn}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}