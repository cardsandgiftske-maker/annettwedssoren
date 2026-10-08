import { validatePasscode, generateAdminToken } from '../_auth';

export default async function handler(req: any, res: any) {
  // Ensure strict application/json content-type header
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Expected POST.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON payload.'
        });
      }
    }

    const passcode = body?.passcode;

    // Missing credentials check (returns 400 Bad Request)
    if (!passcode || typeof passcode !== 'string' || passcode.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Passcode is required.'
      });
    }

    // Verify passcode
    if (validatePasscode(passcode)) {
      const token = generateAdminToken();
      return res.status(200).json({
        success: true,
        token
      });
    }

    // Invalid credentials (returns 401 Unauthorized, never 500)
    return res.status(401).json({
      success: false,
      error: 'Incorrect passcode. Access Denied.'
    });
  } catch (err: any) {
    console.error('Admin login error:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Authentication service is temporarily unavailable.'
    });
  }
}
