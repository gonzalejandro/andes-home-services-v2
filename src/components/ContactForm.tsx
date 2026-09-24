import { useEffect, useRef, useState, type FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'MI',
  postalCode: '',
  message: '',
  website: '',
};

/** `onDark` drops the border, as the mockup does on the dark home section. */
export default function ContactForm({ onDark = false }: { onDark?: boolean }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load the Turnstile script (only when a site key is configured) and render
  // the widget. Scoped to this component, so it never loads on other pages.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    function renderWidget() {
      if (cancelled || widgetIdRef.current !== null) return;
      if (!widgetRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY as string,
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener('load', renderWidget);
      } else {
        const script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', renderWidget);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  function resetTurnstile() {
    setTurnstileToken('');
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setState('error');
      setErrorMessage('Please complete the verification before submitting.');
      return;
    }

    setState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please call us instead.');
      }

      setForm(initialForm);
      resetTurnstile();
      setState('success');
    } catch (error) {
      resetTurnstile();
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed.');
    }
  }

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (state === 'success') {
    return (
      <div className="grid gap-[0.5rem] rounded-theme border border-hairline bg-white p-[1.75rem]">
        <h3 className="text-[1.15rem]">Request received</h3>
        <p className="mt-2">
          Thanks for reaching out! One of our team members will get back to you shortly.
        </p>
        <button
          type="button"
          className="mt-[0.5rem] justify-self-start rounded-full border-[0.5px] border-brand-900 bg-brand-900 px-[1.2rem] py-[0.6rem] text-[0.85rem] font-medium uppercase tracking-[0.06em] text-white transition-colors duration-200 hover:bg-brand-800"
          onClick={() => setState('idle')}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className={`grid gap-[1rem] rounded-theme bg-white p-[1.75rem]${
        onDark ? '' : ' border border-hairline'
      }`} onSubmit={handleSubmit}>
      <div className="grid gap-[1rem] sm:grid-cols-2">
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          First name *
          <input
            required
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          Last name *
          <input
            required
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
      </div>

      <div className="grid gap-[1rem] sm:grid-cols-2">
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          Email *
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          Phone *
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
      </div>

      <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
        Street address *
        <input
          required
          type="text"
          name="address"
          value={form.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
        />
      </label>

      <div className="grid gap-[1rem] sm:grid-cols-3">
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          City *
          <input
            required
            type="text"
            name="city"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          State *
          <input
            required
            type="text"
            name="state"
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
        <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
          ZIP *
          <input
            required
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          />
        </label>
      </div>

      <label className="grid gap-[0.3rem] text-[0.85rem] font-semibold text-brand-900">
        Tell us about your project *
        <textarea
          required
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => updateField('message', e.target.value)}
          className="w-full rounded-[6px] border border-hairline bg-cream px-[0.85rem] py-[0.65rem] text-[0.93rem] focus:border-brand-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-500"
          placeholder="Number of stumps, access notes, preferred timing, etc."
        />
      </label>

      <label className="hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => updateField('website', e.target.value)}
        />
      </label>

      {TURNSTILE_SITE_KEY && <div ref={widgetRef} className="min-h-[65px]" />}

      {state === 'error' && (
        <p className="rounded-[6px] bg-red-50 px-[0.85rem] py-[0.65rem] text-[0.85rem] text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <button type="submit" className="block w-full rounded-full border-[0.5px] border-accent bg-accent px-[1.6rem] py-[0.8rem] text-center font-display text-[1.05rem] font-semibold text-white transition-colors duration-200 hover:border-brand-900 hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Request Free Estimate'}
      </button>

      <p className="text-center text-[0.8rem] text-muted">
        We'll get back to you within one business day.
      </p>
    </form>
  );
}
