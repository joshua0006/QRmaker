/**
 * QR code list component for the dashboard
 */
import React from 'react';
import NewQRCodeCard from '../../components/Dashboard/NewQRCodeCard';
import { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { deleteDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { auth } from '../../lib/firebase';
import { BarChart2 } from 'lucide-react';

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

  // Enhance QR codes with category data
  const qrCodesWithCategories = displayedQRCodes.map(qr => ({
    ...qr,
    category: qr.categoryId ? categories[qr.categoryId] : null
  }));

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    if (!auth.currentUser) {
      alert('You must be logged in to delete QR codes');
      return;
    }

    try {
      // Delete QR code from Firestore
      await deleteDoc(doc(db, 'qrcodes', id));
      
      onUpdate();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code. Please try again later.');
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
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {qrCodesWithCategories.map((qr) => (
          <NewQRCodeCard
            key={qr.id}
            data={qr}
            onDelete={handleDelete}
            onUpdate={onUpdate}
          >
            {onSelectForAnalytics && (
              <button
                onClick={() => onSelectForAnalytics(qr.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Analytics"
              >
                <BarChart2 className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </NewQRCodeCard>
        ))}
      </div>
      {page < totalPages && (
        <div className="text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}