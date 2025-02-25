/**
 * Component for managing dynamic URL shortcodes
 */
import React, { useState, useEffect } from 'react';
import { Check, X, Copy } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

interface DynamicURLInputProps {
  qrId: string;
  url: string;
  shortCode?: string;
  scans?: number;
}

export default function DynamicURLInput({ qrId, url, shortCode: initialShortCode, scans = 0 }: DynamicURLInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [shortCode, setShortCode] = useState(initialShortCode || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateShortCode = (code: string) => {
    return /^[a-zA-Z0-9-]+$/.test(code);
  };

  const handleSave = async () => {
    if (!shortCode.trim()) {
      setError('Short code cannot be empty');
      return;
    }

    if (!validateShortCode(shortCode)) {
      setError('Only letters, numbers, and hyphens are allowed');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Check if shortcode is already in use
      const shortUrlsQ = query(
        collection(db, 'shortUrls'),
        where('shortCode', '==', shortCode)
      );
      const shortUrlsSnapshot = await getDocs(shortUrlsQ);
      
      if (!shortUrlsSnapshot.empty) {
        setError('This short code is already in use');
        setSaving(false);
        return;
      }

      // Create new shortUrl document
      await addDoc(collection(db, 'shortUrls'), {
        shortCode: shortCode.trim(),
        qrcodeId: qrId,
        currentUrl: url,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        scans: 0
      });

      // Update the QR code with the new short code
      await updateDoc(doc(db, 'qrcodes', qrId), {
        shortCode: shortCode.trim()
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating short code:', err);
      setError('Failed to update short code');
    } finally {
      setSaving(false);
    }
  };

  const trackShortUrlScan = async () => {
    if (!shortCode) return;

    try {
      // Update QR code scan count
      await updateDoc(doc(db, 'qrcodes', qrId), {
        scans: (scans || 0) + 1
      });

      // Record scan details
      await addDoc(collection(db, 'scans'), {
        shortCode,
        qrcodeId: qrId,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (err) {
      console.error('Error tracking short URL scan:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://qrr.au/r/${shortCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Add this useEffect to keep short URLs in sync
  useEffect(() => {
    const updateShortUrl = async () => {
      if (!shortCode) return;

      try {
        const shortUrlsQ = query(
          collection(db, 'shortUrls'),
          where('shortCode', '==', shortCode)
        );
        const snapshot = await getDocs(shortUrlsQ);
        
        if (!snapshot.empty) {
          await updateDoc(snapshot.docs[0].ref, {
            currentUrl: url,
            updatedAt: new Date()
          });
        }
      } catch (err) {
        console.error('Error updating short URL:', err);
      }
    };

    updateShortUrl();
  }, [url, shortCode]);

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">qrr.au/</span>
              <input
                type="text"
                value={shortCode}
                onChange={(e) => {
                  setShortCode(e.target.value);
                  setError('');
                }}
                className="flex-1 px-2 py-1 text-sm border-0 focus:ring-0"
                placeholder="Enter short code"
                autoFocus
              />
            </div>
            <div className="h-px bg-gray-200" />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setShortCode(initialShortCode || '');
              setError('');
            }}
            className="p-1 text-gray-400 hover:bg-gray-50 rounded"
          >
            <X size={16} />
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {shortCode ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              qrr.au/r/{shortCode}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title={copied ? 'Copied!' : 'Copy URL'}
            >
              <Copy size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            Add dynamic URL
          </button>
        )}
      </div>
      {scans > 0 && (
        <span className="text-xs text-gray-500">
          {scans} {scans === 1 ? 'scan' : 'scans'}
        </span>
      )}
    </div>
  );
}