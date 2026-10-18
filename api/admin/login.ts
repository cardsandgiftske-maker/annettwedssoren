// LEGACY ROUTE NOTE: vercel.json routes /api/* requests to server.ts.
// This handler is retained for reference and must not be wired independently without review.
import { validatePasscode, generateAdminToken } from '../_auth.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Expected POST.' });
  }
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); }
      catch { return res.status(400).json({ success: false, error: 'Invalid JSON payload.' }); }
    }
    const passcode = body?.passcode;
    if (!passcode || typeof passcode !== 'string' || !validatePasscode(passcode)) {
      return res.status(401).json({ success: false, error: 'Incorrect passcode. Please enter the valid Couple Admin Portal passcode.' });
    }
    return res.status(200).json({ success: true, token: generateAdminToken() });
  } catch (err: any) {
    console.error('Admin login error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Authentication service is temporarily unavailable.' });
  }
}
