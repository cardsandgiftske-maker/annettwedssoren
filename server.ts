import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  runTransaction
} from 'firebase/firestore';

import { validatePasscode, generateAdminToken, verifyAdminToken } from './api/_auth.js';

// Safely load firebase config JSON with a fallback if the file doesn't exist
let firebaseAppletConfig: Record<string, any> = {};
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseAppletConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.warn('Warning: firebase-applet-config.json could not be read. Falling back to environment variables.');
}

// Initialize Firebase SDK on server
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || firebaseAppletConfig.appId || '',
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);
const COLLECTION_NAME = 'rsvps';

const app = express();

// JSON request body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ==========================================
// PUBLIC RSVP SUBMISSION ENDPOINT
// ==========================================
app.post('/api/rsvp', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { fullName, phoneNumber, willAttend, notes, songRequest, id, submittedAt } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (fullName.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Full name cannot exceed 100 characters.' });
    }
    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'A valid phone number is required.' });
    }
    if (phoneNumber.trim().length > 30) {
      return res.status(400).json({ success: false, error: 'Phone number cannot exceed 30 characters.' });
    }
    if (willAttend !== 'yes' && willAttend !== 'no') {
      return res.status(400).json({ success: false, error: 'Please specify whether you will attend.' });
    }
    if (notes && (typeof notes !== 'string' || notes.length > 500)) {
      return res.status(400).json({ success: false, error: 'Notes cannot exceed 500 characters.' });
    }
    if (songRequest && (typeof songRequest !== 'string' || songRequest.length > 200)) {
      return res.status(400).json({ success: false, error: 'Song request cannot exceed 200 characters.' });
    }

    const cleanFullName = fullName.trim();
    const cleanPhone = phoneNumber.trim();

    // Check if phone number has already been used for RSVP
    const rawTargetDigits = cleanPhone.replace(/\D/g, '');
    const targetDigits = rawTargetDigits.length >= 9 ? rawTargetDigits.slice(-9) : rawTargetDigits;

    if (targetDigits.length >= 7) {
      const existingSnap = await getDocs(collection(db, COLLECTION_NAME));
      const isDuplicate = existingSnap.docs.some((docSnap) => {
        const data = docSnap.data();
        if (!data || !data.phoneNumber) return false;
        const existingRaw = String(data.phoneNumber).replace(/\D/g, '');
        const existingDigits = existingRaw.length >= 9 ? existingRaw.slice(-9) : existingRaw;
        return existingDigits && existingDigits === targetDigits;
      });

      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          error: 'This phone number has already been used to confirm an RSVP. Each phone number can only confirm once.',
        });
      }
    }

    const rsvpId = typeof id === 'string' && /^[a-zA-Z0-9_\-]+$/.test(id.trim())
      ? id.trim()
      : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const generatedCode = `AS-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const qrToken = crypto.randomBytes(32).toString('hex');
    const qrTokenHash = crypto.createHash('sha256').update(qrToken).digest('hex');

    const timestamp = typeof submittedAt === 'string' && submittedAt.trim().length > 0
      ? submittedAt.trim()
      : new Date().toISOString();

    const cleanPayload: Record<string, any> = {
      id: rsvpId,
      fullName: cleanFullName,
      phoneNumber: cleanPhone,
      willAttend,
      adultsCount: willAttend === 'yes' ? 1 : 0,
      childrenCount: 0,
      submittedAt: timestamp,
      eCardCode: generatedCode,
      qrTokenHash,
      checkInStatus: 'unused',
      checkedInAt: null,
    };

    if (notes && typeof notes === 'string' && notes.trim().length > 0) {
      cleanPayload.notes = notes.trim().slice(0, 500);
    }

    if (songRequest && typeof songRequest === 'string' && songRequest.trim().length > 0) {
      cleanPayload.songRequest = songRequest.trim().slice(0, 200);
    }

    const finalDoc: Record<string, any> = {};
    for (const [k, v] of Object.entries(cleanPayload)) {
      if (v !== undefined && v !== null) {
        finalDoc[k] = v;
      }
    }

    await setDoc(doc(db, COLLECTION_NAME, rsvpId), finalDoc);

    return res.status(200).json({
      success: true,
      message: 'RSVP submitted successfully',
      rsvp: { ...Object.fromEntries(Object.entries(finalDoc).filter(([key]) => key !== 'qrTokenHash')), qrToken }
    });
  } catch (err: any) {
    console.error('Error saving RSVP to Firestore:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Unable to record your RSVP. Please try again.'
    });
  }
});

// ==========================================
// ADMIN AUTHENTICATION & MANAGEMENT ENDPOINTS
// ==========================================

app.post('/api/admin/login', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { passcode } = req.body || {};

  if (!passcode || typeof passcode !== 'string' || !validatePasscode(passcode)) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect passcode. Please enter the valid Couple Admin Portal passcode.'
    });
  }

  const token = generateAdminToken();
  return res.status(200).json({ success: true, token });
});

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Passcode authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired admin token.' });
  }

  next();
};

app.post('/api/admin/check-in', requireAdmin, async (req, res) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ success: false, status: 'invalid', message: 'Invalid QR code.' });
    }
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const matches = await getDocs(query(collection(db, COLLECTION_NAME)));
    const match = matches.docs.find((item) => item.data().qrTokenHash === tokenHash);
    if (!match) {
      return res.status(404).json({ success: false, status: 'invalid', message: 'INVALID QR — no matching invitation.' });
    }
    const guestRef = doc(db, COLLECTION_NAME, match.id);
    const result = await runTransaction(db, async (transaction) => {
      const current = await transaction.get(guestRef);
      if (!current.exists()) return { status: 'invalid' as const };
      const guest = current.data();
      if (guest.willAttend !== 'yes') return { status: 'declined' as const, guest };
      if (guest.checkInStatus === 'used' || guest.checkedInAt) {
        return { status: 'used' as const, guest };
      }
      const checkedInAt = new Date().toISOString();
      transaction.update(guestRef, { checkInStatus: 'used', checkedInAt });
      return {
        status: 'granted' as const,
        guest: {
          ...guest,
          fullName: guest.fullName as string,
          eCardCode: guest.eCardCode as string,
          checkInStatus: 'used',
          checkedInAt
        }
      };
    });
    if (result.status === 'granted') return res.status(200).json({ success: true, status: result.status, message: 'ACCESS GRANTED', guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode, checkedInAt: result.guest.checkedInAt } });
    if (result.status === 'used') return res.status(409).json({ success: false, status: 'used', message: 'ALREADY USED — ACCESS DENIED', guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode, checkedInAt: result.guest.checkedInAt } });
    if (result.status === 'declined') return res.status(403).json({ success: false, status: 'declined', message: 'RSVP DECLINED — ACCESS DENIED', guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode } });
    return res.status(404).json({ success: false, status: 'invalid', message: 'INVALID QR — no matching invitation.' });
  } catch (err: any) {
    console.error('Check-in error:', err?.message || err);
    return res.status(500).json({ success: false, status: 'error', message: 'Unable to verify QR. Check your connection and try again.' });
  }
});

app.get('/api/admin/rsvps', requireAdmin, async (req, res) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const rsvps: any[] = [];
    querySnapshot.forEach((d) => {
      rsvps.push(d.data());
    });

    return res.status(200).json({ success: true, rsvps });
  } catch (err: any) {
    console.error('Admin fetch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve RSVPs from Firestore.' });
  }
});

const handleUpdateRsvp = async (req: express.Request, res: express.Response) => {
  try {
    const id = (req.params.id || req.query.id || req.body?.id) as string;
    if (!id) {
      return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
    }
    const { willAttend, adultsCount, childrenCount } = req.body || {};

    const docRef = doc(db, COLLECTION_NAME, id);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      return res.status(404).json({ success: false, error: 'RSVP record not found.' });
    }

    const updates: any = {};
    if (willAttend === 'yes' || willAttend === 'no') updates.willAttend = willAttend;
    if (typeof adultsCount === 'number') updates.adultsCount = adultsCount;
    if (typeof childrenCount === 'number') updates.childrenCount = childrenCount;

    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);

    return res.status(200).json({ success: true, rsvp: updatedDoc.data() });
  } catch (err: any) {
    console.error('Admin update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update RSVP in Firestore.' });
  }
};

app.patch('/api/admin/rsvps', requireAdmin, handleUpdateRsvp);
app.patch('/api/admin/rsvps/:id', requireAdmin, handleUpdateRsvp);

const handleDeleteRsvp = async (req: express.Request, res: express.Response) => {
  try {
    const id = (req.params.id || req.query.id || req.body?.id) as string;
    if (!id) {
      return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
    }
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Admin delete error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete RSVP from Firestore.' });
  }
};

app.delete('/api/admin/rsvps', requireAdmin, handleDeleteRsvp);
app.delete('/api/admin/rsvps/:id', requireAdmin, handleDeleteRsvp);

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    let totalRsvps = 0;
    let totalAttending = 0;
    let totalDeclined = 0;

    snap.forEach((d) => {
      const data = d.data();
      totalRsvps++;
      if (data.willAttend === 'yes') totalAttending++;
      if (data.willAttend === 'no') totalDeclined++;
    });

    return res.status(200).json({ success: true, totalRsvps, totalAttending, totalDeclined });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to calculate stats.' });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS & STARTUP
// ==========================================
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    // Use eval import so the bundler completely ignores Vite/Rollup during serverless builds
    const { createServer: createViteServer } = await (eval(`import('vite')`) as Promise<any>);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});

export default app;
