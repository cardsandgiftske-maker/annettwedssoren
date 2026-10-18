import { RsvpGuest } from '../types';

export const isFirebaseConfigured = true;

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
    : `AS-26-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
 * Submit an RSVP through the server API only. No direct Firestore fallback is allowed;
 * the server owns duplicate checks and QR-token issuance. Same name + phone recovers an existing e-card.
 */
export async function saveRsvp(rsvpInput: Partial<RsvpGuest>): Promise<{ success: boolean; rsvp: RsvpGuest; recovered?: boolean; updated?: boolean }> {
  const validatedRsvp = buildValidatedRsvp(rsvpInput);
  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedRsvp),
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();
  if (!contentType.includes('application/json')) {
    throw new Error('The RSVP service returned an unexpected response. Please try again later.');
  }

  let data: any;
  try { data = JSON.parse(rawText); } catch { throw new Error('The RSVP service returned an invalid response. Please try again later.'); }
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Unable to submit RSVP (HTTP ${response.status}).`);
  }
  return data;
}

/**
 * Authenticate admin with passcode and obtain a secure session token
 */
export async function adminLogin(passcode: string): Promise<{ success: boolean; token: string }> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success || !data.token) {
    throw new Error(data.error || 'Admin login is unavailable. Please try again.');
  }
  return data;
}

/**
 * Fetch RSVP records through the authenticated server API only. No client-side Firestore fallback.
 */
export async function getAdminRsvps(token?: string): Promise<RsvpGuest[]> {
  const response = await fetch('/api/admin/rsvps', {
    method: 'GET',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();
  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an invalid response when fetching RSVPs.');
  }

  let data: any;
  try { data = JSON.parse(rawText); } catch { throw new Error('Invalid JSON received while fetching RSVPs.'); }
  if (!response.ok || !data.success || !Array.isArray(data.rsvps)) {
    throw new Error(data.error || 'Failed to retrieve RSVP records.');
  }
  return data.rsvps as RsvpGuest[];
}

/**
 * Update an RSVP record's attendance status
 */
export async function updateAdminRsvpStatus(
  token: string | undefined,
  id: string,
  willAttend: 'yes' | 'no',
  adultsCount: number,
  childrenCount: number = 0
): Promise<void> {
  const response = await fetch(`/api/admin/rsvps?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
 * Delete an RSVP record
 */
export async function deleteAdminRsvp(token: string | undefined, id: string): Promise<void> {
  const response = await fetch(`/api/admin/rsvps?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
 * Fetch aggregated statistics
 */
export async function getAdminStats(
  token?: string
): Promise<{ totalRsvps: number; totalAttending: number; totalDeclined: number }> {
  const response = await fetch('/api/admin/stats', {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

// Deprecated legacy stubs kept for backwards compatibility
export async function getRsvps(): Promise<RsvpGuest[]> {
  return getAdminRsvps();
}

export async function deleteRsvp(id: string): Promise<void> {
  return deleteAdminRsvp(undefined, id);
}

export async function updateRsvpStatus(
  id: string,
  willAttend: 'yes' | 'no',
  adultsCount: number,
  childrenCount: number = 0
): Promise<void> {
  return updateAdminRsvpStatus(undefined, id, willAttend, adultsCount, childrenCount);
}
