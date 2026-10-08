import crypto from 'crypto';

// Secret key for HMAC token signing; defaults to a fixed salt if ADMIN_SESSION_SECRET is unset
const AUTH_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ADMIN_PASSCODE ||
  'diana-charles-wedding-2026-secure-admin-salt-key';

/**
 * Validates the admin passcode against environment config or default couple passcode.
 * Uses timingSafeEqual to guard against timing attacks.
 */
export function validatePasscode(passcode: unknown): boolean {
  if (typeof passcode !== 'string') return false;
  const clean = passcode.trim();
  if (!clean) return false;

  const validPasscodes: string[] = [];
  if (process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE.trim()) {
    validPasscodes.push(process.env.ADMIN_PASSCODE.trim());
  }
  // Standard production couple passcode
  validPasscodes.push('annettsoren2026');
  validPasscodes.push('sorenannett2026');
  validPasscodes.push('dianacharles2026');

  return validPasscodes.some((valid) => {
    if (clean.length !== valid.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(clean), Buffer.from(valid));
    } catch {
      return false;
    }
  });
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

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return false;

  try {
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');

    if (signature.length !== expectedSig.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return false;

    const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (data.role !== 'admin') return false;
    if (typeof data.exp === 'number' && Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}
