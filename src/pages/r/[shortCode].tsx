import { GetServerSideProps } from 'next';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, writeBatch, increment } from 'firebase/firestore';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortCode } = context.params as { shortCode: string };

  try {
    // Find matching short URL
    const q = query(
      collection(db, 'shortUrls'),
      where('shortCode', '==', shortCode),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { notFound: true };
    }

    const shortUrl = snapshot.docs[0].data();
    const qrCodeRef = doc(db, 'qrcodes', shortUrl.qrcodeId);

    // Track scan using batch write
    const batch = writeBatch(db);
    
    // Update QR code scan count
    batch.update(qrCodeRef, {
      scans: increment(1)
    });

    // Create scan record
    const scanRef = doc(collection(db, 'scans'));
    batch.set(scanRef, {
      shortCode,
      qrcodeId: shortUrl.qrcodeId,
      timestamp: new Date(),
      userAgent: context.req.headers['user-agent'] || '',
      referrer: context.req.headers['referer'] || '',
      ipAddress: context.req.headers['x-forwarded-for'] || context.req.socket.remoteAddress,
      status: 'tracked'
    });

    await batch.commit();

    // Redirect to original URL
    return {
      redirect: {
        destination: shortUrl.currentUrl,
        permanent: false
      }
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return { notFound: true };
  }
};

// Empty component since we're redirecting server-side
export default function ShortURLRedirect() {
  return null;
} 