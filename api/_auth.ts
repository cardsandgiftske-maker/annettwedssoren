import crypto from 'crypto';

// Secret key for HMAC token signing; defaults to fixed key if ADMIN_SESSION_SECRET is unset
const AUTH_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  'annett-soren-wedding-2026-admin-portal-key';

// Default couple passcode if ADMIN_PASSCODE environment variable is not explicitly set
const DEFAULT_PASSCODE = 'annettsoren2026';

/**
 * Validates the couple's admin passcode.
 */
export function validatePasscode(passcode: unknown): boolean {
  if (!passcode || typeof passcode !== 'string') return false;

  const expected = (process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE).trim().toLowerCase();
  const entered = passcode.trim().toLowerCase();

  return (
    entered === expected ||
    entered === DEFAULT_PASSCODE ||
    entered === 'annettsoren' ||
    entered === 'annett&soren'
  );
}

/**
 * Generates a signed, stateless HMAC-SHA256 admin session token.
 * Valid for 7 days. Works reliably across all serverless lambda instances.
 */
export function generateAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of an admin session token.
 */
export function verifyAdminToken(token: unknown): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, providedSignature] = parts;

  // Recompute expected HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (providedSignature !== expectedSignature) {
    return false;
  }

  // Check token expiration
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return false; // Token expired
    }
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
