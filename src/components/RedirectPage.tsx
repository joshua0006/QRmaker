import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  increment, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export default function RedirectPage() {
  const { uniqueId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Use a ref to track if we've already processed this scan
  const hasProcessed = useRef(false);
  
  useEffect(() => {
    const handleRedirect = async () => {
      // Skip if already processed
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      
      try {
        // Find the QR code document with the matching uniqueId
        const qrQuery = query(
          collection(db, 'qrcodes'),
          where('uniqueId', '==', uniqueId)
        );
        
        const querySnapshot = await getDocs(qrQuery);
        
        if (querySnapshot.empty) {
          setError('QR code not found');
          setLoading(false);
          return;
        }
        
        // Get the first matching document
        const qrDoc = querySnapshot.docs[0];
        const qrData = qrDoc.data();
        const qrId = qrDoc.id;
        
        // Extract the target URL
        const targetUrl = qrData.url;
        
        if (!targetUrl) {
          setError('Invalid QR code: no URL found');
          setLoading(false);
          return;
        }
        
        // Increment scan count
        await updateDoc(doc(db, 'qrcodes', qrId), {
          scans: increment(1)
        });
        
        // Log scan details
        await addDoc(collection(db, 'qrcodes', qrId, 'scans'), {
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          platform: navigator.platform
        });
        
        // Redirect to the target URL
        window.location.href = targetUrl;
      } catch (err) {
        console.error('Error during redirection:', err);
        setError('Failed to process QR code');
        setLoading(false);
      }
    };
    
    handleRedirect();
    
    // Clean up function
    return () => {
      hasProcessed.current = true; // Prevent processing on unmount
    };
  }, [uniqueId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting you to your destination...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">QR Code Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <a href="/" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Return Home
          </a>
        </div>
      </div>
    );
  }
  
  return null;
} 