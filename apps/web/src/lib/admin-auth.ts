import { createHmac, timingSafeEqual } from 'node:crypto';
import { supabaseRest } from './supabase-rest';

type TokenIdentity = { id: string; email: string; role: string; exp: number };

function signingSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_TOKEN_SECRET must be configured in production.');
  }
  return 'parshuram-local-development-only-token-secret';
}

export function createAuthToken(identity: Omit<TokenIdentity, 'exp'>) {
  const payload = Buffer.from(JSON.stringify({ ...identity, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', signingSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | null) {
  if (!token) return null;
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expected = createHmac('sha256', signingSecret()).update(payload).digest();
    const supplied = Buffer.from(signature, 'base64url');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const identity = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenIdentity;
    if (!identity.id || !identity.email || identity.exp < Date.now() || !['admin', 'super_admin'].includes(identity.role)) return null;
    return identity;
  } catch {
    return null;
  }
}

export function getAuthIdentity(request: Request) {
  return verifyToken(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null);
}

function verifyToken(token: string | null): TokenIdentity | null {
  if (!token) return null;
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expected = createHmac('sha256', signingSecret()).update(payload).digest();
    const supplied = Buffer.from(signature, 'base64url');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const identity = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenIdentity;
    if (!identity.id || !identity.email || identity.exp < Date.now() || !['admin', 'super_admin', 'member'].includes(identity.role)) return null;
    return identity;
  } catch {
    return null;
  }
}

export function getAdminIdentity(request: Request) {
  return verifyAdminToken(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null);
}

export async function getVerifiedAdminIdentity(request: Request) {
  const identity = getAdminIdentity(request);
  if (!identity) return null;
  try {
    const profiles = await supabaseRest<TokenIdentity[]>('profiles', {
      query: { select: 'id,email,role,is_active', id: `eq.${identity.id}`, is_active: 'eq.true', limit: '1' }
    });
    const profile = profiles[0];
    if (!profile || profile.email.toLowerCase() !== identity.email.toLowerCase() || profile.role !== identity.role) return null;
    return identity;
  } catch {
    return null;
  }
}
