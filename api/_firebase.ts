import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyAu3rH8fsjaSadFXlL6xsq7_JQx8VFopKE',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'annettandsorenwedding.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'annettandsorenwedding',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'annettandsorenwedding.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '112216813556',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '1:112216813556:web:370b819a8d9aac76fa13a1'
};

// Legacy helper retained for reference only: vercel.json routes /api/* to server.ts,
// which uses the Firebase Admin SDK and the new project's default database.
const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(appInstance);
export const COLLECTION_NAME = 'rsvps';

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '').trim();
}
