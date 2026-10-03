import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { RsvpGuest } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth ? auth.currentUser : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Check if Firebase is fully configured
export const isFirebaseConfigured = !!(firebaseConfig && firebaseConfig.projectId);

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with the exact Database ID from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Firestore Connection on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or connecting...');
    }
    return false;
  }
}

// Run test connection
testConnection().catch(() => {});

// COLLECTION NAME
const COLLECTION_NAME = 'rsvps';

// LOCAL STORAGE FALLBACK HELPERS
const getLocalRsvps = (): RsvpGuest[] => {
  try {
    const list: RsvpGuest[] = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    return list.filter((item) => item.id && !item.id.includes('seed'));
  } catch {
    return [];
  }
};

const saveLocalRsvps = (rsvps: RsvpGuest[]) => {
  const clean = rsvps.filter((item) => item.id && !item.id.includes('seed'));
  localStorage.setItem('wedding_rsvps', JSON.stringify(clean));
  window.dispatchEvent(new Event('rsvp_database_updated'));
};

const KNOWN_SEED_IDS = ['rsvp-seed-1', 'rsvp-seed-2', 'rsvp-seed-3', 'seed-1', 'seed-2', 'seed-3'];

/**
 * Purge any residual seed documents from Firestore and localStorage
 */
export async function purgeSeedData(): Promise<void> {
  // Purge from Firestore
  try {
    for (const seedId of KNOWN_SEED_IDS) {
      await deleteDoc(doc(db, COLLECTION_NAME, seedId)).catch(() => {});
    }
  } catch {
    // ignore
  }

  // Purge from local storage cache
  try {
    const raw = localStorage.getItem('wedding_rsvps');
    if (raw) {
      const parsed: RsvpGuest[] = JSON.parse(raw);
      const cleaned = parsed.filter((item) => item.id && !item.id.includes('seed'));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem('wedding_rsvps', JSON.stringify(cleaned));
        window.dispatchEvent(new Event('rsvp_database_updated'));
      }
    }
  } catch {
    // ignore
  }
}

// Automatically trigger purge of any seed data on boot
purgeSeedData().catch(() => {});

/**
 * Clean and normalize phone numbers for deduplication checks
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+254')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('254')) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

/**
 * Check if a phone number has already submitted an RSVP
 */
export async function hasPhoneAlreadyRsvped(phone: string): Promise<boolean> {
  const normInput = normalizePhoneNumber(phone);
  if (!normInput || normInput.length < 5) return false;

  const allRsvps = await getRsvps();
  return allRsvps.some((r) => normalizePhoneNumber(r.phoneNumber) === normInput);
}

/**
 * Save or update an RSVP entry in Firestore
 */
export async function saveRsvp(rsvp: RsvpGuest): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, rsvp.id);
    await setDoc(docRef, rsvp);
    // Sync to local as backup cache
    const existing = getLocalRsvps();
    const updated = existing.filter((item) => item.id !== rsvp.id && item.phoneNumber !== rsvp.phoneNumber);
    updated.push(rsvp);
    saveLocalRsvps(updated);
    return;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${rsvp.id}`);
    // Local storage fallback
    const existing = getLocalRsvps();
    const updated = existing.filter((item) => item.id !== rsvp.id && item.phoneNumber !== rsvp.phoneNumber);
    updated.push(rsvp);
    saveLocalRsvps(updated);
  }
}

/**
 * Fetch all RSVPs from Firestore (real submissions only, no seed data)
 */
export async function getRsvps(): Promise<RsvpGuest[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const rsvps: RsvpGuest[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as RsvpGuest;
      // Filter out any seed entries
      if (data.id && !data.id.includes('seed')) {
        rsvps.push(data);
      }
    });
    return rsvps;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    const local = getLocalRsvps();
    return local.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }
}

/**
 * Delete an RSVP entry
 */
export async function deleteRsvp(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }

  const existing = getLocalRsvps();
  const updated = existing.filter((item) => item.id !== id);
  saveLocalRsvps(updated);
}

/**
 * Toggle RSVP attendance status or change seat count
 */
export async function updateRsvpStatus(
  id: string, 
  willAttend: 'yes' | 'no', 
  adultsCount: number, 
  childrenCount: number = 0
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      willAttend,
      adultsCount,
      childrenCount,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }

  const existing = getLocalRsvps();
  const updated = existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        willAttend,
        adultsCount,
        childrenCount,
      };
    }
    return item;
  });
  saveLocalRsvps(updated);
}

/**
 * Real-time RSVP updates subscription using onSnapshot (real submissions only)
 */
export function subscribeToRsvps(onUpdate: (rsvps: RsvpGuest[]) => void): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const rsvps: RsvpGuest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as RsvpGuest;
          if (data.id && !data.id.includes('seed')) {
            rsvps.push(data);
          }
        });
        onUpdate(rsvps);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
    );
  } catch (e) {
    console.warn('Real-time listener setup failed, using local polling fallback:', e);
  }

  // Local storage listener fallback
  const handleLocalUpdate = () => {
    onUpdate(getLocalRsvps().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  };

  window.addEventListener('rsvp_database_updated', handleLocalUpdate);
  handleLocalUpdate();

  return () => {
    window.removeEventListener('rsvp_database_updated', handleLocalUpdate);
  };
}
