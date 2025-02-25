/**
 * QR code list component for the dashboard
 */
import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, BarChart2, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, Spinner } from '@nextui-org/react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { auth } from '../../lib/firebase';

interface QRCodeListProps {
  qrCodes: any[];
  onUpdate: () => void;
  onSelectForAnalytics?: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

export default function QRCodeList({ qrCodes, onUpdate, onSelectForAnalytics }: QRCodeListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(qrCodes.length / ITEMS_PER_PAGE);
  const displayedQRCodes = qrCodes.slice(0, page * ITEMS_PER_PAGE);
  const [categories, setCategories] = useState<Record<string, any>>({});
  const [scanCounts, setScanCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const loadCategories = async () => {
      try {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const categoriesMap: Record<string, any> = {};
        snapshot.docs.forEach(doc => {
          categoriesMap[doc.id] = { id: doc.id, ...doc.data() };
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const fetchScanCounts = async () => {
    setLoading(true);
    const counts: { [key: string]: number } = {};

    try {
      for (const code of qrCodes) {
        if (!code.id) continue;
        
        const scansCol = collection(db, 'qrcodes', code.id, 'scans');
        const snapshot = await getDocs(scansCol);
        counts[code.id] = snapshot.docs.length;
      }
      
      setScanCounts(counts);
    } catch (error) {
      console.error("Error fetching scan counts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (qrCodes.length > 0) {
      fetchScanCounts();
    } else {
      setLoading(false);
    }
  }, [qrCodes]);

  const handleRefresh = () => {
    setRefreshing(true);
    onUpdate();
    fetchScanCounts();
  };

  // Enhance QR codes with category data
  const qrCodesWithCategories = displayedQRCodes.map(qr => ({
    ...qr,
    category: qr.categoryId ? categories[qr.categoryId] : null
  }));

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this QR code?")) {
      try {
        await deleteDoc(doc(db, 'qrcodes', id));
        onUpdate();
      } catch (error) {
        console.error("Error deleting QR code:", error);
      }
    }
  };

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 mb-4">You haven't created any QR codes yet.</p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Your First QR Code
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodesWithCategories.map((code) => (
          <Card key={code.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center space-y-4">
              {/* QR Code Display */}
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <QRCode
                  value={code.redirectUrl || `${window.location.origin}/qr/${code.uniqueId}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                  renderAs="svg"
                />
              </div>

              {/* QR Code Info */}
              <div className="w-full text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {code.name || 'Unnamed QR Code'}
                </h3>
                <div className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" /> Loading scans...
                    </span>
                  ) : (
                    `Scans: ${scanCounts[code.id] || 0}`
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-2 w-full pt-2 border-t">
                <button
                  onClick={() => onSelectForAnalytics?.(code.id)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="View Analytics"
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
                <a
                  href={code.redirectUrl || `${window.location.origin}/qr/${code.uniqueId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Open Link"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  onClick={() => handleDelete(code.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete QR Code"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400">
                Created: {code.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}