import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ShortRedirectPage() {
  const { shortId } = useParams();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        if (!shortId) throw new Error('Missing redirect ID');
        
        const shortRef = doc(db, 'shortUrls', shortId);
        const shortSnap = await getDoc(shortRef);

        if (shortSnap.exists()) {
          // Update visit count and last accessed
          await updateDoc(shortRef, {
            visits: increment(1),
            lastAccessed: new Date()
          });
          
          // Redirect to target URL
          window.location.href = shortSnap.data().targetUrl;
        } else {
          window.location.href = '/404';
        }
      } catch (error) {
        console.error('Redirect tracking failed:', error);
        window.location.href = '/error';
      }
    };

    trackVisit();
  }, [shortId]);

  return <div>Redirecting...</div>;
} 