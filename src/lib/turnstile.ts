const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

type SiteVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * If no secret key is configured, verification is skipped (returns true) so
 * local/dev environments without keys still work — the honeypot remains the
 * fallback. When configured, a missing or invalid token fails.
 */
export async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteip) body.append('remoteip', remoteip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    const data = (await response.json()) as SiteVerifyResponse;
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
