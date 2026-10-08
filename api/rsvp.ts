import { doc, setDoc } from 'firebase/firestore';
import { db, COLLECTION_NAME } from './_firebase';

export default async function handler(req: any, res: any) {
  // Ensure strict JSON content type header
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Expected POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { fullName, phoneNumber, willAttend, notes, songRequest, eCardCode, id, submittedAt } = body;

    // 1. Validate required fields
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
      : `AS-26-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const timestamp = typeof submittedAt === 'string' && submittedAt.trim().length > 0
      ? submittedAt.trim()
      : new Date().toISOString();

    // Construct clean payload - never contain undefined
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

    // Explicit sanitize check: verify no key has undefined or null value
    const finalDoc: Record<string, any> = {};
    for (const [k, v] of Object.entries(cleanPayload)) {
      if (v !== undefined && v !== null) {
        finalDoc[k] = v;
      }
    }

    // Persist to Firestore
    const docRef = doc(db, COLLECTION_NAME, rsvpId);
    await setDoc(docRef, finalDoc);

    return res.status(200).json({
      success: true,
      message: 'RSVP submitted successfully',
      rsvp: finalDoc
    });
  } catch (err: any) {
    console.error('API /api/rsvp error:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Unable to record your RSVP. Please try again.'
    });
  }
}
