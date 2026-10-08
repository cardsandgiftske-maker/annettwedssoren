import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { RsvpGuest } from '../types';

export const isFirebaseConfigured = true;

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAaMfdiMyP2L7X-tHrDCDXF7ZXsNBPut4s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dianaandcharles-8d637.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dianaandcharles-8d637',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dianaandcharles-8d637.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '434427553533',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:434427553533:web:51895a4d238effe68b4094'
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const clientDb = getFirestore(appInstance);

/**
 * Validates and strictly sanitizes an RSVP object to guarantee that
 * NO `undefined` or `null` property can ever reach Firestore or the API payload.
 */
export function buildValidatedRsvp(raw: Partial<RsvpGuest>): RsvpGuest {
  const fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
  if (!fullName) {
    throw new Error('Full name is required.');
  }
  if (fullName.length > 100) {
    throw new Error('Full name cannot exceed 100 characters.');
  }

  const phoneNumber = typeof raw.phoneNumber === 'string' ? raw.phoneNumber.trim() : '';
  if (!phoneNumber || phoneNumber.length < 5) {
    throw new Error('A valid phone number is required.');
  }
  if (phoneNumber.length > 30) {
    throw new Error('Phone number cannot exceed 30 characters.');
  }

  if (raw.willAttend !== 'yes' && raw.willAttend !== 'no') {
    throw new Error('Please specify whether you will attend.');
  }

  const id = typeof raw.id === 'string' && /^[a-zA-Z0-9_\-]+$/.test(raw.id.trim())
    ? raw.id.trim()
    : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const submittedAt = typeof raw.submittedAt === 'string' && raw.submittedAt.trim()
    ? raw.submittedAt.trim()
    : new Date().toISOString();

  const eCardCode = typeof raw.eCardCode === 'string' && raw.eCardCode.trim()
    ? raw.eCardCode.trim()
    : `DC-26-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const cleanDoc: Record<string, any> = {
    id,
    fullName,
    phoneNumber,
    willAttend: raw.willAttend,
    adultsCount: raw.willAttend === 'yes' ? 1 : 0,
    childrenCount: 0,
    submittedAt,
    eCardCode,
  };

  if (raw.notes && typeof raw.notes === 'string' && raw.notes.trim().length > 0) {
    cleanDoc.notes = raw.notes.trim().slice(0, 500);
  }

  if (raw.songRequest && typeof raw.songRequest === 'string' && raw.songRequest.trim().length > 0) {
    cleanDoc.songRequest = raw.songRequest.trim().slice(0, 200);
  }

  // Strip all undefined or null keys completely
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(cleanDoc)) {
    if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  }

  return sanitized as RsvpGuest;
}

/**
 * Submit an RSVP. Attempts the secure backend API endpoint first;
 * if unavailable (e.g. static CDN 404), falls back to direct client Firestore creation.
 * Throws clear error without writing to localStorage on failure.
 */
export async function saveRsvp(rsvpInput: Partial<RsvpGuest>): Promise<{ success: boolean; rsvp: RsvpGuest; updated?: boolean }> {
  // Validate and sanitize beforehand so no undefined property ever exists
  const validatedRsvp = buildValidatedRsvp(rsvpInput);
  let apiSucceeded = false;
  let resultData: any = null;

  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedRsvp),
    });

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(rawText);
        if (response.ok && data.success) {
          apiSucceeded = true;
          resultData = data;
        } else if (!response.ok) {
          throw new Error(data.error || `Server returned status ${response.status}`);
        }
      } catch (jsonErr: any) {
        if (!response.ok) {
          throw new Error(jsonErr.message || 'Server error occurred.');
        }
      }
    }
  } catch (apiErr: any) {
    console.warn('API endpoint unavailable or failed, attempting direct Firestore synchronization:', apiErr.message);
  }

  if (apiSucceeded && resultData) {
    return resultData;
  }

  // Fallback direct Firestore write if the serverless/API endpoint is unreachable
  try {
    const docRef = doc(clientDb, 'rsvps', validatedRsvp.id);
    await setDoc(docRef, validatedRsvp);

    return {
      success: true,
      rsvp: validatedRsvp
    };
  } catch (firestoreErr: any) {
    console.error('Direct Firestore submission failure:', firestoreErr);
    throw new Error(
      'Unable to record your RSVP in the database. Please check your network connection and try again.'
    );
  }
}

/**
 * Authenticate admin with passcode and obtain a secure session token
 */
export async function adminLogin(passcode: string): Promise<{ success: boolean; token: string }> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ passcode }),
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error('Authentication server returned an invalid response.');
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON received from authentication server.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed.');
  }

  return data;
}

/**
 * Fetch all RSVPs for authenticated admin dashboard
 */
export async function getAdminRsvps(token: string): Promise<RsvpGuest[]> {
  const response = await fetch('/api/admin/rsvps', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an invalid response when fetching RSVPs.');
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON received from server.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch RSVP records.');
  }

  return data.rsvps || [];
}

/**
 * Update an RSVP record's attendance status (Admin Only)
 */
export async function updateAdminRsvpStatus(
  token: string,
  id: string,
  willAttend: 'yes' | 'no',
  adultsCount: number,
  childrenCount: number = 0
): Promise<void> {
  const response = await fetch(`/api/admin/rsvps?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, willAttend, adultsCount, childrenCount }),
  });

  if (!response.ok) {
    const rawText = await response.text();
    let errorMsg = 'Failed to update RSVP.';
    try {
      const data = JSON.parse(rawText);
      if (data.error) errorMsg = data.error;
    } catch {}
    throw new Error(errorMsg);
  }
}

/**
 * Delete an RSVP record (Admin Only)
 */
export async function deleteAdminRsvp(token: string, id: string): Promise<void> {
  const response = await fetch(`/api/admin/rsvps?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const rawText = await response.text();
    let errorMsg = 'Failed to delete RSVP.';
    try {
      const data = JSON.parse(rawText);
      if (data.error) errorMsg = data.error;
    } catch {}
    throw new Error(errorMsg);
  }
}

/**
 * Fetch aggregated statistics (Admin Only)
 */
export async function getAdminStats(
  token: string
): Promise<{ totalRsvps: number; totalAttending: number; totalDeclined: number }> {
  const response = await fetch('/api/admin/stats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an invalid response when fetching stats.');
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON received.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch stats.');
  }

  return data;
}

// Deprecated legacy stubs kept for backwards compatibility (throw explanatory errors if called without auth)
export async function getRsvps(): Promise<RsvpGuest[]> {
  const savedToken = sessionStorage.getItem('admin_auth_token');
  if (savedToken) {
    return getAdminRsvps(savedToken);
  }
  throw new Error('Unauthorized: Admin authentication is required to list RSVPs.');
}

export async function deleteRsvp(id: string): Promise<void> {
  const savedToken = sessionStorage.getItem('admin_auth_token');
  if (savedToken) {
    return deleteAdminRsvp(savedToken, id);
  }
  throw new Error('Unauthorized: Admin authentication is required to delete RSVPs.');
}

export async function updateRsvpStatus(
  id: string,
  willAttend: 'yes' | 'no',
  adultsCount: number,
  childrenCount: number = 0
): Promise<void> {
  const savedToken = sessionStorage.getItem('admin_auth_token');
  if (savedToken) {
    return updateAdminRsvpStatus(savedToken, id, willAttend, adultsCount, childrenCount);
  }
  throw new Error('Unauthorized: Admin authentication is required to update RSVPs.');
}
