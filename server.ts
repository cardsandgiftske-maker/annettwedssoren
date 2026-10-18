import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { validatePasscode, generateAdminToken, verifyAdminToken } from './api/_auth.js';

let firebaseAppletConfig: Record<string, any> = {};
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) firebaseAppletConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (err) {
  console.warn('Could not read firebase-applet-config.json; using FIREBASE_PROJECT_ID environment variable.');
}

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || 'annettandsorenwedding';
const APP_NAME = 'annett-soren-admin-sdk';
let firestore: ReturnType<typeof getFirestore> | null = null;

function getDb() {
  if (firestore) return firestore;
  const existing = getApps().find((item) => item.name === APP_NAME);
  if (existing) {
    firestore = getFirestore(existing);
    return firestore;
  }

  // Never use the public Firebase web API key for privileged server writes.
  // Configure FIREBASE_SERVICE_ACCOUNT_JSON in Vercel with the service-account JSON.
  const rawCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const encodedCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!rawCredentials && !encodedCredentials) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.');
  }

  let serviceAccount: Record<string, any>;
  try {
    const decoded = encodedCredentials
      ? Buffer.from(encodedCredentials, 'base64').toString('utf8')
      : String(rawCredentials);
    serviceAccount = JSON.parse(decoded) as Record<string, any>;
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
  }
  if (serviceAccount.project_id && serviceAccount.project_id !== PROJECT_ID) {
    throw new Error(`Firebase service account belongs to ${serviceAccount.project_id}, not configured project ${PROJECT_ID}.`);
  }

  const appInstance = initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID,
  }, APP_NAME);
  firestore = getFirestore(appInstance);
  return firestore;
}

const COLLECTION_NAME = 'rsvps';
const PHONE_INDEX_COLLECTION = 'rsvpPhoneIndex';
const app = express();
app.use(express.json({ limit: '100kb' }));

function normalizePhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits.slice(-9) : digits;
}
function phoneIndexId(normalizedPhone: string): string {
  return crypto.createHash('sha256').update(normalizedPhone).digest('hex');
}
function normalizeName(name: string): string {
  return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
}
function publicGuest(data: Record<string, any>) {
  const { qrTokenHash, normalizedPhone, ...safe } = data;
  return safe;
}
function maintenanceEnabled() {
  // Maintenance stays ON unless explicitly disabled after migration and testing.
  return process.env.RSVP_MAINTENANCE_MODE !== 'false';
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', projectId: PROJECT_ID, rsvpMaintenance: maintenanceEnabled(), time: new Date().toISOString() });
});

// RSVP submission also recovers an existing e-card when the same guest re-enters
// their exact name and phone number. Phone index lookups are O(1) document reads.
app.post('/api/rsvp', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (maintenanceEnabled()) {
    return res.status(503).json({
      success: false,
      code: 'RSVP_TEMPORARILY_UNAVAILABLE',
      error: 'RSVP submissions are temporarily unavailable while we complete maintenance. Please check back shortly.'
    });
  }

  try {
    const { fullName, phoneNumber, willAttend, notes, songRequest, id, submittedAt } = req.body || {};
    if (typeof fullName !== 'string' || !fullName.trim()) return res.status(400).json({ success: false, error: 'Full name is required.' });
    if (fullName.trim().length > 100) return res.status(400).json({ success: false, error: 'Full name cannot exceed 100 characters.' });
    if (typeof phoneNumber !== 'string' || phoneNumber.trim().length < 5 || phoneNumber.trim().length > 30) return res.status(400).json({ success: false, error: 'A valid phone number is required.' });
    if (willAttend !== 'yes' && willAttend !== 'no') return res.status(400).json({ success: false, error: 'Please specify whether you will attend.' });
    if (notes && (typeof notes !== 'string' || notes.length > 500)) return res.status(400).json({ success: false, error: 'Notes cannot exceed 500 characters.' });
    if (songRequest && (typeof songRequest !== 'string' || songRequest.length > 200)) return res.status(400).json({ success: false, error: 'Song request cannot exceed 200 characters.' });

    const cleanFullName = fullName.trim().replace(/\s+/g, ' ');
    const cleanPhone = phoneNumber.trim();
    const normalizedPhone = normalizePhone(cleanPhone);
    if (normalizedPhone.length < 7) return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });

    const rsvpId = typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id.trim())
      ? id.trim()
      : `rsvp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const generatedCode = `AS-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const qrToken = crypto.randomBytes(32).toString('hex');
    const qrTokenHash = crypto.createHash('sha256').update(qrToken).digest('hex');
    const timestamp = typeof submittedAt === 'string' && submittedAt.trim() ? submittedAt.trim() : new Date().toISOString();
    const newGuest: Record<string, any> = {
      id: rsvpId,
      fullName: cleanFullName,
      phoneNumber: cleanPhone,
      normalizedPhone,
      willAttend,
      adultsCount: willAttend === 'yes' ? 1 : 0,
      childrenCount: 0,
      submittedAt: timestamp,
      eCardCode: generatedCode,
      qrTokenHash,
      checkInStatus: 'unused',
      checkedInAt: null,
      ...(notes?.trim() ? { notes: notes.trim().slice(0, 500) } : {}),
      ...(songRequest?.trim() ? { songRequest: songRequest.trim().slice(0, 200) } : {}),
    };

    const db = getDb();
    const indexRef = db.collection(PHONE_INDEX_COLLECTION).doc(phoneIndexId(normalizedPhone));
    const newGuestRef = db.collection(COLLECTION_NAME).doc(rsvpId);
    const result = await db.runTransaction(async (transaction) => {
      const indexSnap = await transaction.get(indexRef);
      if (indexSnap.exists) {
        const existingId = String(indexSnap.get('rsvpId') || '');
        if (!existingId) return { kind: 'stale-index' as const };
        const existingRef = db.collection(COLLECTION_NAME).doc(existingId);
        const existingSnap = await transaction.get(existingRef);
        if (!existingSnap.exists) {
          transaction.set(newGuestRef, newGuest);
          transaction.set(indexRef, { rsvpId, normalizedPhone, createdAt: FieldValue.serverTimestamp() });
          return { kind: 'created' as const, guest: newGuest };
        }
        const existing = existingSnap.data() as Record<string, any>;
        if (normalizeName(existing.fullName) !== normalizeName(cleanFullName)) return { kind: 'duplicate-phone' as const };
        // Same guest returning for an e-card: rotate token, preserve their RSVP answer and check-in status.
        transaction.update(existingRef, { qrTokenHash, normalizedPhone });
        return { kind: 'recovered' as const, guest: { ...existing, qrTokenHash, normalizedPhone } };
      }
      transaction.set(newGuestRef, newGuest);
      transaction.set(indexRef, { rsvpId, normalizedPhone, createdAt: FieldValue.serverTimestamp() });
      return { kind: 'created' as const, guest: newGuest };
    });

    if (result.kind === 'duplicate-phone') {
      return res.status(409).json({ success: false, code: 'PHONE_ALREADY_USED', error: 'This phone number already has an RSVP. Enter the same full name used for the original RSVP to recover that e-card.' });
    }
    if (result.kind === 'stale-index') {
      return res.status(500).json({ success: false, error: 'RSVP index needs administrator repair. Please try again later.' });
    }
    const guest = result.guest as Record<string, any>;
    return res.status(200).json({
      success: true,
      recovered: result.kind === 'recovered',
      message: result.kind === 'recovered' ? 'Your existing RSVP was found. Your e-card is ready to download again.' : 'RSVP submitted successfully.',
      rsvp: { ...publicGuest(guest), qrToken }
    });
  } catch (err: any) {
    console.error('Error saving/recovering RSVP:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Unable to save or recover your RSVP right now. Please try again shortly.' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body || {};
  if (!passcode || typeof passcode !== 'string' || !validatePasscode(passcode)) {
    return res.status(401).json({ success: false, error: 'Incorrect passcode. Please enter the valid Couple Admin Portal passcode.' });
  }
  return res.status(200).json({ success: true, token: generateAdminToken() });
});

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Unauthorized: Passcode authentication required.' });
  if (!verifyAdminToken(authHeader.split(' ')[1])) return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired admin token.' });
  next();
};

app.post('/api/admin/check-in', requireAdmin, async (req, res) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    if (!/^[a-f0-9]{64}$/i.test(token)) return res.status(400).json({ success: false, status: 'invalid', message: 'Invalid QR code.' });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const db = getDb();
    const matchSnap = await db.collection(COLLECTION_NAME).where('qrTokenHash', '==', tokenHash).limit(1).get();
    if (matchSnap.empty) return res.status(404).json({ success: false, status: 'invalid', message: 'INVALID QR — no matching invitation.' });
    const guestRef = matchSnap.docs[0].ref;
    const result = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(guestRef);
      if (!current.exists) return { status: 'invalid' as const };
      const guest = current.data() as Record<string, any>;
      if (guest.willAttend !== 'yes') return { status: 'declined' as const, guest };
      if (guest.checkInStatus === 'used' || guest.checkedInAt) return { status: 'used' as const, guest };
      const checkedInAt = new Date().toISOString();
      transaction.update(guestRef, { checkInStatus: 'used', checkedInAt });
      return { status: 'granted' as const, guest: { ...guest, checkInStatus: 'used', checkedInAt } };
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

app.get('/api/admin/rsvps', requireAdmin, async (_req, res) => {
  try {
    const snap = await getDb().collection(COLLECTION_NAME).orderBy('submittedAt', 'desc').get();
    return res.status(200).json({ success: true, rsvps: snap.docs.map((d) => publicGuest(d.data())) });
  } catch (err: any) {
    console.error('Admin fetch error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve RSVPs. Check Firebase configuration and quota.' });
  }
});

const handleUpdateRsvp = async (req: express.Request, res: express.Response) => {
  try {
    const id = (req.params.id || req.query.id || req.body?.id) as string;
    if (!id) return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
    const { willAttend, adultsCount, childrenCount } = req.body || {};
    const ref = getDb().collection(COLLECTION_NAME).doc(id);
    const existing = await ref.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'RSVP record not found.' });
    const updates: Record<string, any> = {};
    if (willAttend === 'yes' || willAttend === 'no') updates.willAttend = willAttend;
    if (typeof adultsCount === 'number') updates.adultsCount = adultsCount;
    if (typeof childrenCount === 'number') updates.childrenCount = childrenCount;
    if (Object.keys(updates).length) await ref.update(updates);
    return res.status(200).json({ success: true, rsvp: { ...publicGuest(existing.data() as Record<string, any>), ...updates } });
  } catch (err: any) {
    console.error('Admin update error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to update RSVP.' });
  }
};
app.patch('/api/admin/rsvps', requireAdmin, handleUpdateRsvp);
app.patch('/api/admin/rsvps/:id', requireAdmin, handleUpdateRsvp);

const handleDeleteRsvp = async (req: express.Request, res: express.Response) => {
  try {
    const id = (req.params.id || req.query.id || req.body?.id) as string;
    if (!id) return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
    const db = getDb();
    const ref = db.collection(COLLECTION_NAME).doc(id);
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists) return;
      const data = snap.data() as Record<string, any>;
      transaction.delete(ref);
      const normalizedPhone = data.normalizedPhone || normalizePhone(data.phoneNumber || '');
      if (normalizedPhone) transaction.delete(db.collection(PHONE_INDEX_COLLECTION).doc(phoneIndexId(normalizedPhone)));
    });
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Admin delete error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to delete RSVP.' });
  }
};
app.delete('/api/admin/rsvps', requireAdmin, handleDeleteRsvp);
app.delete('/api/admin/rsvps/:id', requireAdmin, handleDeleteRsvp);

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  try {
    const collectionRef = getDb().collection(COLLECTION_NAME);
    const [totalSnap, attendingSnap, declinedSnap] = await Promise.all([
      collectionRef.count().get(),
      collectionRef.where('willAttend', '==', 'yes').count().get(),
      collectionRef.where('willAttend', '==', 'no').count().get(),
    ]);
    return res.status(200).json({
      success: true,
      totalRsvps: totalSnap.data().count,
      totalAttending: attendingSnap.data().count,
      totalDeclined: declinedSnap.data().count,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to calculate RSVP statistics.' });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await (eval(`import('vite')`) as Promise<any>);
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  if (!process.env.VERCEL) app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}
startServer().catch((err) => console.error('Server failed to start:', err));
export default app;
