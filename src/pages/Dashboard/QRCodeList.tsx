import React, { useEffect, useState } from 'react';
import { Trash2, BarChart2, ExternalLink, RefreshCw, Download } from 'lucide-react';
import { Card, Spinner } from '@nextui-org/react';
import { collection, getDocs, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import QRCodeStyling from 'qr-code-styling';
import { auth } from '../../lib/firebase';

interface QRCodeListProps {
  qrCodes: any[];
  onUpdate: () => void;
  onSelectForAnalytics?: (id: string) => void;
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

export default function QRCodeList({ qrCodes, onUpdate, onSelectForAnalytics }: QRCodeListProps) {
  const [qrCodesData, setQRCodesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchQRCodes();
  }, []);
  
  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      
      // Get all QR codes for the current user
      const userQrCodesQuery = query(
        collection(db, 'qrcodes'),
        where('userId', '==', auth.currentUser?.uid)
      );
      
      const qrSnapshot = await getDocs(userQrCodesQuery);
      
      // Map through each QR code and include its scan count
      const qrCodesData = qrSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // If scans field exists use it, otherwise default to 0
        scans: doc.data().scans || 0
      }));
      
      setQRCodesData(qrCodesData);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchQRCodes();
  };
  
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
        {qrCodesData.map((code) => (
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
                <div className="text-sm text-gray-600">
                  {/* Display the actual scan count from the database */}
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
                  onClick={() => {/* Handle download logic */}}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download QR Code"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Handle delete logic */}}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete QR Code"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400">
                Created: {code.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}