import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
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
  orderBy 
} from 'firebase/firestore';

import { validatePasscode, generateAdminToken, verifyAdminToken } from './api/_auth';

// Initialize Firebase SDK on server
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyAaMfdiMyP2L7X-tHrDCDXF7ZXsNBPut4s',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'dianaandcharles-8d637.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'dianaandcharles-8d637',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'dianaandcharles-8d637.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '434427553533',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '1:434427553533:web:51895a4d238effe68b4094'
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(appInstance);
const COLLECTION_NAME = 'rsvps';

// Normalizes phone numbers for duplicate checks (strips spaces, dashes, parentheses)
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '').trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    // Ensure strict JSON header
    res.setHeader('Content-Type', 'application/json');

    try {
      const { fullName, phoneNumber, willAttend, notes, songRequest, eCardCode, id, submittedAt } = req.body;

      // 1. Validation
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
      const rsvpId = typeof id === 'string' && /^[a-zA-Z0-9_\-]+$/.test(id.trim())
        ? id.trim()
        : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const generatedCode = typeof eCardCode === 'string' && eCardCode.trim().length > 0
        ? eCardCode.trim()
        : `DC-26-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const timestamp = typeof submittedAt === 'string' && submittedAt.trim().length > 0
        ? submittedAt.trim()
        : new Date().toISOString();

      // Safe clean payload without undefined properties
      const cleanPayload: Record<string, any> = {
        id: rsvpId,
        fullName: cleanFullName,
        phoneNumber: cleanPhone,
        willAttend,
        adultsCount: willAttend === 'yes' ? 1 : 0,
        childrenCount: 0,
        submittedAt: timestamp,
        eCardCode: generatedCode,
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
        rsvp: finalDoc
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

  // Admin login endpoint
  app.post('/api/admin/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { passcode } = req.body || {};

    if (!passcode || typeof passcode !== 'string' || passcode.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Passcode is required.' });
    }

    if (validatePasscode(passcode)) {
      const token = generateAdminToken();
      return res.status(200).json({ success: true, token });
    }

    return res.status(401).json({ success: false, error: 'Incorrect passcode. Access Denied.' });
  });

  // Admin authorization middleware
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token || !verifyAdminToken(token)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired admin session.' });
    }
    next();
  };

  // Get all RSVPs (Admin Only)
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

  // Update RSVP status or guest counts (Admin Only)
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

  // Delete an RSVP (Admin Only)
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

  // Get aggregated stats (Admin Only)
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
  // VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
