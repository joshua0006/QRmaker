import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getApps, getApp } from 'firebase/app';

// Initialize Firebase only once
const firebaseConfig = {
  apiKey: "AIzaSyD3CwNB2h9dFW84BosRFI7NCCJp3ryVs5I",
  authDomain: "qr-code-maker-1.firebaseapp.com",
  projectId: "qr-code-maker-1",
  storageBucket: "qr-code-maker-1.firebasestorage.app",
  messagingSenderId: "116092035124",
  appId: "1:116092035124:web:1e753f8b90e4a6f7f1ea61"
};

let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
  app = initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);