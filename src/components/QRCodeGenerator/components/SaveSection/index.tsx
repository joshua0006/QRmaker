/**
 * SaveSection component that handles QR code saving and authentication flow
 */
import React from 'react';
import { Save, Lock } from 'lucide-react';
import { auth, db, storage } from '../../../../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { QROptions } from '../../../../types/qr';
import { useAuthModal } from '../../../../hooks/useAuthModal';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { nanoid } from 'nanoid';

interface SaveSectionProps {
  options: QROptions;
  url: string;
  logoUrl: string;
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderColor: string;
  borderRadius: number;
  bannerPosition: 'none' | 'top' | 'bottom';
  bannerText: string;
  bannerColor: string;
  bannerTextColor: string;
  bannerWidth: number;
  bannerFontSize: number;
  bannerFontFamily: string;
  bannerBold: boolean;
  bannerItalic: boolean;
}

export default function SaveSection({ 
  options, 
  url, 
  logoUrl,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
  bannerPosition,
  bannerText,
  bannerColor,
  bannerTextColor,
  bannerWidth,
  bannerFontSize,
  bannerFontFamily,
  bannerBold,
  bannerItalic
}: SaveSectionProps) {
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [saving, setSaving] = React.useState(false);
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [qrName, setQrName] = React.useState('');
  const [error, setError] = React.useState('');

  // Set initial QR name based on URL when URL changes
  React.useEffect(() => {
    if (url) {
      // Get the raw value without prefixes
      const rawValue = url
        .replace(/^(https?:\/\/)?(www\.)?/, '')  // Remove URL prefixes
        .replace(/^mailto:/, '')                  // Remove email prefix
        .replace(/^tel:/, '')                     // Remove phone prefix
        .replace(/^smsto:/, '')                   // Remove SMS prefix
        .split('/')[0];                          // Get first part of URL

      setQrName(rawValue);
    }
  }, [url]);

  React.useEffect(() => {
    const loadUserCategories = async () => {
      if (!auth.currentUser) return;
      
      setLoadingCategories(true);
      try {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const loadedCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(loadedCategories);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    // Load categories when component mounts or auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserCategories();
      } else {
        setCategories([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    // Reset selected category when categories change
    if (categories.length === 0) {
      setSelectedCategory('');
    }
  }, [categories]);

  React.useEffect(() => {
    // Initial load if user is already authenticated
    if (auth.currentUser && categories.length === 0) {
      loadCategories();
    }
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', auth.currentUser!.uid)
      );
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSave = async () => {
    try {
      const qrRef = doc(collection(db, 'qrcodes'));
      const uniqueId = nanoid(8); 
      const redirectUrl = `${window.location.origin}/qr/${uniqueId}`;
      
      await setDoc(qrRef, {
        userId: auth.currentUser.uid,
        uniqueId: uniqueId,
        name: qrName.trim(),
        url: url, // Original target URL
        redirectUrl: redirectUrl, // Store redirect URL
        options: {
          ...options,
          data: redirectUrl, // QR code will point to redirect URL
        },
        logoUrl: logoUrl || null,
        createdAt: serverTimestamp(),
        type: options.type,
        categoryId: selectedCategory || null,
        status: 'active'
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving QR code:', error);
      setError('Failed to save QR code');
      setSaving(false);
    }
  };

  // If user is already authenticated, show save button
  if (auth.currentUser) {
    return (
      <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Save className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Save Your QR Code
              </h2>
              <p className="text-gray-600 mb-6">
                Name your QR code and save it to your dashboard to enable dynamic URL updates and track scan analytics.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder="Enter a name for your QR code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                {loadingCategories && (
                  <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
                )}
                {!loadingCategories && (
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save QR Code</span>
                  </>
                )}
              </button>

              {error && (
                <p className="text-sm text-red-600 mt-4">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Save Your QR Code
            </h2>
            <p className="text-gray-600 mb-6">
              Create an account to save your QR codes, enable dynamic URL updates, and track scan analytics.
              Name your QR code and save it to your dashboard to enable dynamic URL updates and track scan analytics.
            </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openModal()}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => openModal()}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Sign In
            </button>
          </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Name
              </label>
              <input
                type="text"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                placeholder="Enter a name for your QR code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600 mt-4">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}