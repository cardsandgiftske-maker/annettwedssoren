import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); if (row.some((v) => v.trim())) rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); if (row.some((v) => v.trim())) rows.push(row); }
  return rows;
}
function normalizePhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits.slice(-9) : digits;
}
function phoneIndexId(normalizedPhone: string): string {
  return crypto.createHash('sha256').update(normalizedPhone).digest('hex');
}
function normalizeName(name: string): string { return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en'); }

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const csvArg = args.find((arg) => !arg.startsWith('--'));
  const csvPath = path.resolve(csvArg || 'annett_and_soren_wedding_rsvps_2026-10-18.csv');
  if (!fs.existsSync(csvPath)) throw new Error(`CSV not found: ${csvPath}`);
  const projectId = process.env.FIREBASE_PROJECT_ID || 'annettandsorenwedding';
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve('serviceAccountKey.json');
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 && !fs.existsSync(credentialPath)) {
    throw new Error('Set FIREBASE_SERVICE_ACCOUNT_JSON or place a private service account key at serviceAccountKey.json (never commit it).');
  }
  const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64
      ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString('utf8'))
      : JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
  if (credentials.project_id && credentials.project_id !== projectId) {
    throw new Error(`The service account belongs to ${credentials.project_id}, not ${projectId}.`);
  }
  const appName = 'annett-soren-rsvp-import';
  const existing = getApps().find((a) => a.name === appName);
  const adminApp = existing || initializeApp({ credential: cert(credentials), projectId }, appName);
  const db = getFirestore(adminApp);

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, ''));
  if (rows.length < 2) throw new Error('CSV contains no RSVP rows.');
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name.toLowerCase());
  const required = ['id', 'full name', 'phone number', 'will attend', 'digital code', 'submitted at'];
  for (const header of required) if (idx(header) < 0) throw new Error(`Missing required CSV column: ${header}`);

  let created = 0, skipped = 0, conflicts = 0;
  for (const row of rows.slice(1)) {
    const value = (header: string) => (row[idx(header)] || '').trim();
    const id = value('ID');
    const fullName = value('Full Name').replace(/\s+/g, ' ');
    const phoneNumber = value('Phone Number');
    const normalizedPhone = normalizePhone(phoneNumber);
    const willAttend = value('Will Attend').toLowerCase() === 'yes' ? 'yes' : 'no';
    const eCardCode = value('Digital Code');
    const submittedAt = value('Submitted At') || new Date().toISOString();
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || !fullName || normalizedPhone.length < 7 || !eCardCode) {
      console.warn(`Skipping invalid row: ${id || '(no ID)'}`); skipped++; continue;
    }
    const rsvpRef = db.collection('rsvps').doc(id);
    const indexRef = db.collection('rsvpPhoneIndex').doc(phoneIndexId(normalizedPhone));
    const [rsvpSnap, indexSnap] = await Promise.all([rsvpRef.get(), indexRef.get()]);
    if (rsvpSnap.exists) { skipped++; continue; }
    if (indexSnap.exists) {
      const indexedId = String(indexSnap.get('rsvpId') || '');
      if (indexedId !== id) {
        console.error(`Phone conflict for ${fullName}; phone index already points to ${indexedId}. No data written for this row.`);
        conflicts++; continue;
      }
    }

    const guest: Record<string, any> = {
      id, fullName, phoneNumber, normalizedPhone, willAttend,
      adultsCount: willAttend === 'yes' ? 1 : 0,
      childrenCount: 0,
      eCardCode,
      submittedAt,
      checkInStatus: 'unused',
      checkedInAt: null,
      importedFromCsv: true,
    };
    const songRequest = value('Song Request');
    const notes = value('Notes');
    if (songRequest) guest.songRequest = songRequest.slice(0, 200);
    if (notes) guest.notes = notes.slice(0, 500);
    // The CSV does not contain QR-token hashes or check-in history. The guest can
    // re-enter their exact name + phone to get a fresh QR token after migration.
    if (!dryRun) {
      const batch = db.batch();
      batch.create(rsvpRef, guest);
      if (!indexSnap.exists) batch.create(indexRef, { rsvpId: id, normalizedPhone, createdAt: FieldValue.serverTimestamp() });
      await batch.commit();
    }
    created++;
  }
  console.log(JSON.stringify({ projectId, mode: dryRun ? 'dry-run (no writes performed)' : 'import', csvPath, rows: rows.length - 1, created: dryRun ? 0 : created, wouldCreate: dryRun ? created : undefined, skipped, conflicts }, null, 2));
  if (conflicts) process.exitCode = 2;
}
main().catch((err) => { console.error('RSVP import failed:', err?.message || err); process.exitCode = 1; });
