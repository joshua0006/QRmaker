/**
 * Utility functions for QR code generation and URL management
 */
import { db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { QRCodeType } from '../types/qr';
import { qrTypes } from '../data/qrTypes';

// Generate a random short code
function generateShortCode(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a short URL entry in Firestore
export async function createShortUrl(url: string): Promise<string> {
  try {
    // Generate a unique short code
    const shortCode = generateShortCode();
    
    // Add to Firestore
    await addDoc(collection(db, 'shortUrls'), {
      shortCode,
      currentUrl: url,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    });

    // Return the redirect URL
    return `/r/${shortCode}`;
  } catch (error) {
    console.error('Error creating short URL:', error);
    throw error;
  }
}

// Format data based on QR code type
export async function getFormattedData(url: string, type: QRCodeType): Promise<string> {
  const typeConfig = qrTypes.find(t => t.type === type);
  if (!typeConfig) return url;

  const formattedUrl = typeConfig.format(url);
  
  // For URL type, create a short URL
  if (type === 'url') {
    try {
      const shortUrl = await createShortUrl(formattedUrl);
      return window.location.origin + shortUrl;
    } catch (error) {
      console.error('Failed to create short URL:', error);
      return formattedUrl;
    }
  }

  return formattedUrl;
}