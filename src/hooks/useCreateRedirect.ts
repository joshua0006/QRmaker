import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '../lib/firebase';

export default async function createQRCode(userId: string, targetUrl: string) {
  const uniqueId = nanoid(8);
  const qrRef = doc(db, 'qrcodes', uniqueId);
  
  await setDoc(qrRef, {
    uniqueId,          // Store uniqueId in document
    targetUrl,
    redirectUrl: `${window.location.origin}/redirect/${uniqueId}`,
    scanCount: 0,
    owner: userId,
    createdAt: new Date(),
    lastScanned: null
  });

  return {
    id: uniqueId,
    shortUrl: `${window.location.origin}/redirect/${uniqueId}`
  };
} 