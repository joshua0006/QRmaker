import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { auth, db, storage } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import AuthForm from './AuthForm';
import { QROptions } from '../../../../types/qr';
import QRCodeStyling from 'qr-code-styling';

interface SaveQRCodeProps {
  qrCode?: QRCodeStyling;
  options: QROptions;
  url: string;
  logoUrl: string;
}

export default function SaveQRCode({ qrCode, options, url, logoUrl }: SaveQRCodeProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  const handleSave = async () => {
    if (!auth.currentUser) {
      setShowAuth(true);
      return;
    }

    if (!name) {
      setError('Please enter a name for your QR code');
      return;
    }

    if (!qrCode) {
      setError('QR code not initialized');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Get QR code as data URL
      await qrCode.draw();
      const canvas = qrCode._canvas;
      if (!canvas) throw new Error('Failed to generate QR code');
      const dataUrl = canvas.toDataURL('image/png');

      // Upload QR code image to Storage
      const storageRef = ref(storage, `qrcodes/${auth.currentUser.uid}/${name}.png`);
      await uploadString(storageRef, dataUrl, 'data_url');

      // Save QR code data to Firestore
      // Save QR code data with logo URL
      await addDoc(collection(db, 'qrcodes'), {
        userId: auth.currentUser.uid,
        name,
        url,
        options,
        logoUrl: logoUrl || null,  // Store the Firebase Storage URL
        createdAt: new Date(),
      });

      setName('');
      setSaving(false);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Save QR Code</h3>
      
      {showAuth ? (
        <AuthForm 
          onSuccess={() => setShowAuth(false)}
          hasQRCode={!!qrCode}
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your QR code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save QR Code'}
          </button>
        </div>
      )}
    </div>
  );
}