import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async (event) => {
  console.log("--- Redirect function invoked ---");
  console.log("Event:", event);

  // Extract the shortcode from the query parameters
  const shortcode = event.queryStringParameters?.shortcode;
  console.log("Shortcode:", shortcode);

  if (!shortcode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Shortcode is required" })
    };
  }

  try {
    // Query the shortUrls collection
    const shortUrlsRef = collection(db, 'shortUrls');
    const q = query(shortUrlsRef, where('shortCode', '==', shortcode));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "URL not found" })
      };
    }

    const shortUrlData = snapshot.docs[0].data();

    if (!shortUrlData || shortUrlData.status !== 'active') {
      return {
        statusCode: 410,
        body: JSON.stringify({ error: "This link is no longer active" })
      };
    }

    // Record analytics asynchronously
    recordAnalytics(shortcode, event);

    // Redirect to the destination URL
    return {
      statusCode: 301,
      headers: {
        Location: shortUrlData.currentUrl,
        'Cache-Control': 'no-cache'
      },
      body: ''
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};

async function recordAnalytics(shortCode: string, event: any) {
  try {
    const { headers, ip } = event;
    const userAgent = headers['user-agent'] || '';
    const referrer = headers.referer || '';

    // Get basic device info from user agent
    const isMobile = /mobile/i.test(userAgent);
    const browser = getBrowser(userAgent);
    const os = getOS(userAgent);

    // Add scan record
    const scanData = {
      shortCode,
      timestamp: new Date(),
      device: {
        type: isMobile ? 'Mobile' : 'Desktop',
        browser,
        os
      },
      location: {
        ip
      },
      referrer
    };

    // Add to analytics collection
    await addDoc(collection(db, 'analytics'), scanData);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  return 'Other';
}

function getOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  if (/android/i.test(userAgent)) return 'Android';
  return 'Other';
}