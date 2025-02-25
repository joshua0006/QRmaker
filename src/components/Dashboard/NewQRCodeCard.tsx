/**
 * Enhanced QR code card component with proper sizing and banner support
 */
import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Edit2, Check, X, Link2 } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import QRCodeStyling from 'qr-code-styling';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import DynamicURLInput from './DynamicURLInput';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  data: any;
  onDelete: (id: string, name: string) => void;
  onUpdate: () => void;
  className?: string;
}

export default function NewQRCodeCard({ data, onDelete, onUpdate, className = '' }: QRCodeCardProps) {
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const [qrRef, isVisible] = useIntersectionObserver();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(data.name);
  const [error, setError] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(data.categoryId || '');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', data.userId)
        );
        const snapshot = await getDocs(q);
        setCategories(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, [data.userId]);

  const handleCategoryUpdate = async () => {
    try {
      await updateDoc(doc(db, 'qrcodes', data.id), {
        categoryId: selectedCategory || null
      });
      onUpdate();
      setIsEditingCategory(false);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      await updateDoc(doc(db, 'qrcodes', data.id), {
        name: newName.trim()
      });
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error renaming QR code:', err);
      setError('Failed to rename QR code');
    }
  };

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = '';
      
      if (data.imageUrl) {
        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = data.name;
        img.className = 'w-full h-full object-contain';
        container.appendChild(img);
      } else {
        // Create redirect URL using the QR code's uniqueId
        const redirectUrl = `${window.location.origin}/qr/${data.uniqueId}`;
        
        const qr = new QRCodeStyling({
          width: 220,
          height: 220,
          type: 'canvas',
          ...data.options,
          data: redirectUrl, // Set the QR code to point to the redirect URL
          image: data.logoUrl || undefined,
          dotsOptions: {
            type: 'extra-rounded',
            color: '#4F46E5',
          },
          backgroundOptions: {
            color: '#EEF2FF',
          }
        });
        qr.append(container);
      }
    }
  }, [isVisible, data]);

  useEffect(() => {
    const trackView = async () => {
      // Only track scans when not on the dashboard and the QR code is visible
      if (isVisible && !window.location.pathname.includes('/dashboard')) {
        console.log('[Tracking] Starting scan tracking for QR:', data.id);
        if (!data.id || !auth.currentUser) return;
        
        try {
          await updateDoc(doc(db, 'qrcodes', data.id), {
            scans: (data.scans || 0) + 1
          });
          console.log('[Tracking] QR code scans updated successfully');

          // Track scan details
          await addDoc(collection(db, 'qrcodes', data.id, 'scans'), {
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            // Add any other relevant tracking data
          });
        } catch (err) {
          console.error('[Tracking] Error tracking QR code scan:', err);
          // Log error for debugging
          await addDoc(collection(db, 'errors'), {
            type: 'scan_tracking',
            error: err,
            qrcodeId: data.id,
            userId: auth.currentUser?.uid,
            time: new Date().toISOString()
          });
        }
      }
    };

    trackView();
  }, [isVisible, data.id, data.scans, data.imageUrl, data.url, data.name]);

  const generateTrackableQR = async (data: string) => {
    const qrRef = doc(collection(db, 'qrcodes'));
    const uniqueId = qrRef.id.slice(0, 8); // Generate a shorter unique ID from the document ID
    
    const qrData = {
      id: qrRef.id,
      uniqueId: uniqueId, // Add the uniqueId field
      content: data,
      created: new Date(),
      owner: auth.currentUser?.uid,
      scanCount: 0 // Initialize scan counter
    };
    
    await setDoc(qrRef, qrData);
    return qrRef.id;
  };

  const formatDate = (dateField) => {
    if (!dateField) return '';
    
    // Check if it's a Firestore Timestamp (has toDate method)
    if (dateField && typeof dateField.toDate === 'function') {
      return new Date(dateField.toDate()).toLocaleDateString();
    }
    
    // Already a Date object or timestamp
    return new Date(dateField).toLocaleDateString();
  };

  return (
    <div ref={qrRef as React.RefObject<HTMLDivElement>} className={`border rounded-lg hover:shadow-md transition-shadow bg-white ${className}`}>
      <div className="mb-4 text-right">
        {isEditingCategory ? (
          <div className="inline-flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1.5 text-xs border-0 bg-transparent focus:ring-0 cursor-pointer min-w-[120px]"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCategoryUpdate}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => {
                setIsEditingCategory(false);
                setSelectedCategory(data.categoryId || '');
              }}
              className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className="group cursor-pointer inline-flex items-center gap-2 rounded-lg py-2 px-3 transition-all hover:shadow-sm"
            onClick={() => setIsEditingCategory(true)}
            style={{ 
              backgroundColor: data.category ? `${data.category.color}15` : 'transparent',
              color: data.category ? data.category.color : 'rgb(156, 163, 175)'
            }}
          >
            <span className="text-xs font-medium">
              {data.category ? data.category.name : 'No Category'}
            </span>
            <Edit2 
              size={12} 
              className="opacity-50 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {/* QR Code Preview */}
        <div className="p-0 border-b relative">
          {/* Unique ID overlay remains */}
          <div className="absolute bottom-2 right-2 bg-gray-100/95 px-2 py-1 rounded-md backdrop-blur-[2px]">
            <p className="text-xs text-gray-600 font-mono">{data.uniqueId}</p>
          </div>
          
          {/* QR code container - simplified */}
          <div 
            ref={containerRef} 
            className="flex flex-col items-center justify-center w-full h-[330px] bg-white"
          >
            {!data.imageUrl && !qrCode && (
              <p className="text-gray-400 text-sm">Generating QR code...</p>
            )}
          </div>
        </div>

        {/* QR Code Details */}
        <div className="px-4 py-4">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter name"
                autoFocus
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleRename}
                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(data.name);
                    setError('');
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="group relative cursor-pointer py-1 -mx-1 px-1 hover:bg-gray-50 rounded"
              onClick={() => setIsEditing(true)}
            >
              <h3 className="font-medium text-gray-900">{data.name}</h3>
              <Edit2 
                size={14} 
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
          <p className="text-sm text-gray-500 truncate mt-2">
            {data.redirectUrl || `${window.location.origin}/qr/${data.uniqueId}`}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(data.id, data.name)}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete QR code"
              >
                <Trash2 size={18} />
              </button>
              <a
                href={data.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Open URL"
              >
                <ExternalLink size={18} />
              </a>
            </div>
            
            <span className="text-xs text-gray-500">
              {formatDate(data.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}