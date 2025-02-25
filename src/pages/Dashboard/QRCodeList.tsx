import React, { useEffect, useState } from 'react';
import { Trash2, BarChart2, ExternalLink, RefreshCw, Download, Pencil } from 'lucide-react';
import { Card, Spinner } from '@nextui-org/react';
import { collection, getDocs, deleteDoc, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import QRCodeStyling from 'qr-code-styling';
import { auth } from '../../lib/firebase';


interface QRCodeListProps {
  qrCodes: any[];
  onUpdate: () => void;
  onSelectForAnalytics?: (id: string) => void;
}

interface QRCode {
  id: string;
  name: string;
  scans: number;
  category?: string;
  createdAt: any; // Using any to handle Firebase timestamp
  uniqueId: string;
  redirectUrl?: string;
  // ... other fields ...
}

// Separate component for QR code rendering
function QRCodeDisplay({ code }: { code: any }) {
  const [qrElement, setQrElement] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const container = document.createElement('div');
    setQrElement(container);
    
    let isMounted = true;
    let qrInstance = null;
    
    async function generateQR() {
      try {
        setLoading(true);
        setError(false);
        
        const qrDoc = await getDoc(doc(db, 'qrcodes', code.id));
        if (!qrDoc.exists() || !isMounted) return;
        
        const qrData = qrDoc.data();
        const redirectUrl = `${window.location.origin}/qr/${qrData.uniqueId}`;
        
        // Adjusted QR code size to fit card
        qrInstance = new QRCodeStyling({
          
          type: 'svg',
          ...qrData.options,
          data: redirectUrl,
          image: qrData.logoUrl || undefined,
          dotsOptions: {
            type: 'rounded',
            color: '#000000',
            ...(qrData.options?.dotsOptions || {})
          },
          backgroundOptions: {
            color: '#FFFFFF',
            ...(qrData.options?.backgroundOptions || {})
          },
          cornersSquareOptions: {
            type: 'square',
            color: '#000000',
            ...(qrData.options?.cornersSquareOptions || {})
          },
          cornersDotOptions: {
            type: 'square',
            color: '#000000',
            ...(qrData.options?.cornersDotOptions || {})
          },
          width: 250,  // Set a base size
          height: 250,
        });
        
        if (isMounted) {
          container.innerHTML = '';
          await qrInstance.append(container);
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    generateQR();
    
    return () => {
      isMounted = false;
      container.innerHTML = '';
    };
  }, [code.id]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-[120px] w-[120px]"><Spinner size="lg" /></div>;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-[120px] w-[120px] bg-gray-100 rounded">
        <p className="text-sm text-gray-500">QR Code Error</p>
      </div>
    );
  }
  
  return qrElement ? (
    <div 
      className="qr-container h-full w-full" 
      dangerouslySetInnerHTML={{ __html: qrElement.innerHTML }}
    />
  ) : null;
}

// Create a reusable function to generate the QR code instance with all styling
const createStyledQRCode = async (code: QRCode) => {
  try {
    // Get the complete QR code document to access all styling options
    const qrDoc = await getDoc(doc(db, 'qrcodes', code.id));
    
    if (!qrDoc.exists()) {
      throw new Error("QR code not found");
    }
    
    const qrData = qrDoc.data();
    const redirectUrl = code.redirectUrl || `${window.location.origin}/qr/${code.uniqueId}`;
    
    // Create QR code with all styling options
    return new QRCodeStyling({
      width: 1000,  // Larger size for better quality download
      height: 1000,
      type: 'canvas', // Use canvas for PNG download
      data: redirectUrl,
      image: qrData.logoUrl || undefined,
      ...qrData.options,
      dotsOptions: {
        type: 'rounded',
        color: '#000000',
        ...(qrData.options?.dotsOptions || {})
      },
      backgroundOptions: {
        color: '#FFFFFF',
        ...(qrData.options?.backgroundOptions || {})
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#000000',
        ...(qrData.options?.cornersSquareOptions || {})
      },
      cornersDotOptions: {
        type: 'square',
        color: '#000000',
        ...(qrData.options?.cornersDotOptions || {})
      }
    });
  } catch (error) {
    console.error("Error creating styled QR code:", error);
    throw error;
  }
};

// Updated download function that preserves styling
const handleDownload = async (code: QRCode) => {
  try {
    // Show download progress to user
    const downloadName = `${code.name || 'QRCode'}`;
    
    // Create the styled QR code
    const qrCode = await createStyledQRCode(code);
    
    // Use the built-in download method which handles file creation
    await qrCode.download({
      name: downloadName,
      extension: 'png'
    });
    
  } catch (error) {
    console.error("Error downloading QR code:", error);
    alert("Failed to download QR code. Please try again.");
  }
};

export default function QRCodeList({ qrCodes, onUpdate, onSelectForAnalytics }: QRCodeListProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [showCategoryEditModal, setShowCategoryEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editQRCodeId, setEditQRCodeId] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (qrCodes && qrCodes.length > 0) {
      // Extract unique categories from the qrCodes prop
      const uniqueCategories = Array.from(
        new Set(qrCodes.map(code => code.category || 'Uncategorized'))
      ).filter(Boolean) as string[];
      
      setCategories(['all', ...uniqueCategories]);
    }
  }, [qrCodes]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      if (!auth.currentUser) return;
      
      try {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setAvailableCategories(['all', ...categoriesData.map(c => c.name)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [showCategoryEditModal]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    onUpdate(); // Call the parent's update function
    setRefreshing(false);
  };
  
  const handleDelete = async () => {
    if (!deleteCandidateId) return;
    
    try {
      await deleteDoc(doc(db, 'qrcodes', deleteCandidateId));
      // Refresh QR codes list by calling the parent's update function
      onUpdate();
    } catch (error) {
      console.error("Error deleting QR code:", error);
    } finally {
      setShowDeleteDialog(false);
      setDeleteCandidateId(null);
    }
  };
  
  const handleUpdateCategory = async () => {
    if (!editQRCodeId) return;

    try {
      // Prevent updating the 'all' category
      if (editCategory === 'all') {
        alert('"All" is a reserved category and cannot be assigned to QR codes');
        return;
      }

      // Update the category field in the QR code document
      await updateDoc(doc(db, 'qrcodes', editQRCodeId), {
        category: editCategory || 'Uncategorized'
      });
      
      // Refresh the QR code list by calling the parent's update function
      onUpdate();
    } catch (error) {
      console.error("Error updating category:", error);
      alert('Error updating category. Please try again.');
    } finally {
      setShowCategoryEditModal(false);
      setEditQRCodeId(null);
      setEditCategory('');
    }
  };
  
  return (
    <div className="flex gap-6">
      <div className="flex-1">
        {/* Updated Category Edit Modal */}
        {showCategoryEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCategoryEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Delete QR Code?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this QR code? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
          {qrCodes.map((code) => (
            <Card key={code.id} className="p-4 hover:shadow-lg transition-shadow w-[300px]">
              <div className="flex flex-col items-center space-y-4">
                {/* QR Code Display Container */}
                <div className="bg-white rounded-lg shadow-inner w-full aspect-square flex items-center justify-center p-2">
                  <QRCodeDisplay code={code} />
                </div>

                {/* QR Code Info */}
                <div className="w-full text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {code.name || 'Unnamed QR Code'}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                    {code.category || 'Uncategorized'}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Scans: {code.scans || 0}
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
                    onClick={() => handleDownload(code)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download QR Code"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteCandidateId(code.id);
                      setShowDeleteDialog(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete QR Code"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditQRCodeId(code.id);
                      setEditCategory(code.category || '');
                      setShowCategoryEditModal(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-400">
                  Created: {code.createdAt?.toDate 
                    ? code.createdAt.toDate().toLocaleDateString() 
                    : new Date().toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}