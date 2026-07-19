import type { APIRoute } from 'astro';
import { createLeadInJobber, isJobberConfigured, type ContactLeadInput } from '@/lib/jobber';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const prerender = false;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseBody(body: unknown): ContactLeadInput | null {
  if (!body || typeof body !== 'object') return null;

  const data = body as Record<string, unknown>;
  const firstName = String(data.firstName ?? '').trim();
  const lastName = String(data.lastName ?? '').trim();
  const email = String(data.email ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  const address = String(data.address ?? '').trim();
  const city = String(data.city ?? '').trim();
  const state = String(data.state ?? '').trim();
  const postalCode = String(data.postalCode ?? '').trim();
  const message = String(data.message ?? '').trim();

  if (!firstName || !lastName || !email || !phone || !address || !city || !state || !postalCode || !message) return null;
  if (!isValidEmail(email)) return null;

  return {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    message,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const website = String((body as Record<string, unknown>).website ?? '').trim();

    if (website) {
      return new Response(JSON.stringify({ message: 'Request received.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turnstileToken = String((body as Record<string, unknown>).turnstileToken ?? '').trim();
    const remoteip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const humanVerified = await verifyTurnstileToken(turnstileToken, remoteip);
    if (!humanVerified) {
      return new Response(
        JSON.stringify({ error: 'Verification failed. Please refresh the page and try again.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const lead = parseBody(body);
    if (!lead) {
      return new Response(JSON.stringify({ error: 'Invalid form submission.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isJobberConfigured()) {
      return new Response(
        JSON.stringify({
          error:
            'Contact form API is not configured yet. Add Jobber credentials to .env (Week 2 rollout).',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const result = await createLeadInJobber(lead);

    return new Response(
      JSON.stringify({
        message: 'Your request was submitted successfully.',
        clientId: result.clientId,
        requestId: result.requestId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unable to submit request.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
