import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

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

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please call us instead.');
      }

      setForm(initialForm);
      setState('success');
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed.');
    }
  }

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (state === 'success') {
    return (
      <div className="card border-green-200 bg-green-50 text-green-900">
        <h3 className="text-xl font-bold">Request received</h3>
        <p className="mt-2">
          Thanks for reaching out! One of our team members will get back to you shortly.
        </p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => setState('idle')}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-brand-800">
          First name *
          <input
            required
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-brand-800">
          Last name *
          <input
            required
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-brand-800">
          Email *
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-brand-800">
          Phone *
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-brand-800">
        Street address *
        <input
          required
          type="text"
          name="address"
          value={form.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-brand-800">
          City *
          <input
            required
            type="text"
            name="city"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-brand-800">
          State *
          <input
            required
            type="text"
            name="state"
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-brand-800">
          ZIP *
          <input
            required
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-brand-800">
        Tell us about your project *
        <textarea
          required
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => updateField('message', e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
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

      {state === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Request Free Estimate'}
      </button>
    </form>
  );
}
