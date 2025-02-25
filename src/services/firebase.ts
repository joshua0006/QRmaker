/**
 * Firebase service layer
 */
import { auth, db, storage } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import { QROptions } from '../types/qr';

export const authService = {
  async signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: new Date(),
      role: 'user'
    });
    return userCredential.user;
  },

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async signOut() {
    await signOut(auth);
  }
};

export const qrCodeService = {
  async saveQRCode(userId: string, name: string, imageData: string, options: QROptions, url: string, logoUrl: string) {
    // Upload QR code image
    const storageRef = ref(storage, `qrcodes/${userId}/${name}.png`);
    await uploadString(storageRef, imageData, 'data_url');

    // Save QR code data
    return addDoc(collection(db, 'qrcodes'), {
      userId,
      name,
      url,
      options,
      logoUrl,
      createdAt: new Date(),
    });
  }
};