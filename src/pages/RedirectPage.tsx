import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function RedirectPage() {
  const { uniqueId } = useParams();

  useEffect(() => {
    const trackAndRedirect = async () => {
      if (!uniqueId) return;
      
      const qrRef = doc(db, 'qrcodes', uniqueId);
      const qrSnap = await getDoc(qrRef);

      if (qrSnap.exists()) {
        const { targetUrl } = qrSnap.data();
        
        // Atomic update
        await Promise.all([
          updateDoc(qrRef, {
            scanCount: increment(1),
            lastScanned: new Date()
          }),
          addDoc(collection(db, 'qrcodes', uniqueId, 'scans'), {
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            ip: await fetch('https://api.ipify.org?format=json')
                  .then(res => res.json())
                  .then(data => data.ip)
          })
        ]);

        // Force full page redirect
        window.location.href = targetUrl;
      } else {
        window.location.href = '/404';
      }
    };

    trackAndRedirect();
  }, [uniqueId]);

  return <div>Redirecting...</div>;
} 