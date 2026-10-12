import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyAaMfdiMyP2L7X-tHrDCDXF7ZXsNBPut4s',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'dianaandcharles-8d637.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'dianaandcharles-8d637',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'dianaandcharles-8d637.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '434427553533',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '1:434427553533:web:51895a4d238effe68b4094'
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(appInstance);
export const COLLECTION_NAME = 'rsvps';

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '').trim();
}
