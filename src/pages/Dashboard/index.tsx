/**
 * User dashboard for managing QR codes
 */
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { QrCode, Edit, Trash2, BarChart2 } from 'lucide-react';
import QRCodeList from './QRCodeList';
import Analytics from './Analytics';
import Sidebar from '../../components/Dashboard/Sidebar';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'analytics'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reload QR codes when category selection changes
  useEffect(() => {
    if (auth.currentUser) {
      loadQRCodes(auth.currentUser.uid);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let unsubscribed = false;

    const loadData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading data for user:', auth.currentUser.uid);
        await loadQRCodes(auth.currentUser.uid);
      } catch (err) {
        console.error('Error loading QR codes:', err);
        setError('Failed to load QR codes. Please try again later.');
      } finally {
        if (!unsubscribed) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!unsubscribed) {
        if (user) {
          console.log('User authenticated:', user.uid);
          loadData();
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, []);

  const loadQRCodes = async (userId: string) => {
    console.log('Fetching QR codes for user:', userId);
    const constraints = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ];

    if (selectedCategory) {
      constraints.unshift(where('categoryId', '==', selectedCategory));
    }

    const q = query(
      collection(db, 'qrcodes'),
      ...constraints
    );
    
    const snapshot = await getDocs(q);
    console.log('Found QR codes:', snapshot.docs.length);
    const codes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setQrCodes(codes);
    setError(null);
  };

  // If not authenticated, redirect to home
  if (!loading && !auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          <Sidebar
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                My QR Codes
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    view === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('analytics')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    view === 'analytics'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Loading your QR codes...</p>
              </div>
            ) : view === 'list' ? (
              <QRCodeList 
                qrCodes={qrCodes} 
                onUpdate={() => auth.currentUser && loadQRCodes(auth.currentUser.uid)} 
              />
            ) : (
              <Analytics qrCodes={qrCodes} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}