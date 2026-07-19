import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';

const JOBBER_API_URL = 'https://api.getjobber.com/api/graphql';
const JOBBER_TOKEN_URL = 'https://api.getjobber.com/api/oauth/token';
const JOBBER_TOKEN_BLOB_PATH = 'jobber/refresh-token.json';
const localTokenPath = path.join(process.cwd(), 'src/data/jobber-token.json');

export type ContactLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  message: string;
};

type JobberGraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;
let cachedRefreshToken: string | null = null;

type StoredToken = { refresh_token: string; updated_at: string };

async function readRefreshTokenFromBlob(): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const { blobs } = await list({ prefix: JOBBER_TOKEN_BLOB_PATH, limit: 1 });
    const blob = blobs.find((entry) => entry.pathname === JOBBER_TOKEN_BLOB_PATH);
    if (!blob) return null;

    const response = await fetch(blob.url);
    if (!response.ok) return null;

    const data = (await response.json()) as StoredToken;
    return data.refresh_token ?? null;
  } catch {
    return null;
  }
}

async function readRefreshTokenFromFile(): Promise<string | null> {
  try {
    const raw = await readFile(localTokenPath, 'utf8');
    const data = JSON.parse(raw) as StoredToken;
    return data.refresh_token ?? null;
  } catch {
    return null;
  }
}

async function getStoredRefreshToken(): Promise<string | null> {
  return (await readRefreshTokenFromBlob()) ?? (await readRefreshTokenFromFile());
}

async function saveRefreshToken(refreshToken: string): Promise<void> {
  const payload: StoredToken = { refresh_token: refreshToken, updated_at: new Date().toISOString() };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(JOBBER_TOKEN_BLOB_PATH, JSON.stringify(payload), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  if (import.meta.env.DEV) {
    await writeFile(localTokenPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  }
}

function getJobberConfig() {
  const clientId = import.meta.env.JOBBER_CLIENT_ID;
  const clientSecret = import.meta.env.JOBBER_CLIENT_SECRET;
  const refreshToken = import.meta.env.JOBBER_REFRESH_TOKEN;
  const graphqlVersion = import.meta.env.JOBBER_GRAPHQL_VERSION ?? '2026-05-12';

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return { clientId, clientSecret, refreshToken, graphqlVersion };
}

export function isJobberConfigured(): boolean {
  return getJobberConfig() !== null;
}

async function getAccessToken(): Promise<string> {
  const config = getJobberConfig();
  if (!config) {
    throw new Error('Jobber is not configured. Set JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, and JOBBER_REFRESH_TOKEN.');
  }

  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt) {
    return cachedAccessToken.token;
  }

  const refreshToken = cachedRefreshToken ?? (await getStoredRefreshToken()) ?? config.refreshToken;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(JOBBER_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Jobber token refresh failed (${response.status}): ${text}`);
  }

  const token = (await response.json()) as TokenResponse;
  cachedAccessToken = {
    token: token.access_token,
    expiresAt: Date.now() + (token.expires_in - 60) * 1000,
  };

  cachedRefreshToken = token.refresh_token;
  await saveRefreshToken(token.refresh_token);

  return token.access_token;
}

export async function jobberRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const config = getJobberConfig();
  if (!config) {
    throw new Error('Jobber is not configured.');
  }

  const accessToken = await getAccessToken();

  const response = await fetch(JOBBER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-JOBBER-GRAPHQL-VERSION': config.graphqlVersion,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Jobber API request failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as JobberGraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('Jobber API returned no data.');
  }

  return payload.data;
}

const CLIENT_CREATE_MUTATION = `
  mutation CreateClient($input: ClientCreateInput!) {
    clientCreate(input: $input) {
      client {
        id
        properties {
          id
        }
      }
      userErrors {
        message
        path
      }
    }
  }
`;

const REQUEST_CREATE_MUTATION = `
  mutation CreateRequest($input: RequestCreateInput!) {
    requestCreate(input: $input) {
      request {
        id
      }
      userErrors {
        message
        path
      }
    }
  }
`;

type ClientCreateResult = {
  clientCreate: {
    client: {
      id: string;
      properties: Array<{ id: string }>;
    } | null;
    userErrors: Array<{ message: string; path: string[] }>;
  };
};

type RequestCreateResult = {
  requestCreate: {
    request: { id: string } | null;
    userErrors: Array<{ message: string; path: string[] }>;
  };
};

export async function createLeadInJobber(lead: ContactLeadInput): Promise<{
  clientId: string;
  requestId: string;
}> {
  const clientResult = await jobberRequest<ClientCreateResult>(CLIENT_CREATE_MUTATION, {
    input: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      emails: [{ address: lead.email, primary: true, description: 'MAIN' }],
      phones: [{ number: lead.phone, primary: true, description: 'MAIN' }],
      billingAddress: {
        street1: lead.address,
        city: lead.city,
        province: lead.state,
        postalCode: lead.postalCode,
        country: 'US',
      },
      properties: [
        {
          address: {
            street1: lead.address,
            city: lead.city,
            province: lead.state,
            postalCode: lead.postalCode,
            country: 'US',
          },
        },
      ],
    },
  });

  const clientErrors = clientResult.clientCreate.userErrors;
  if (clientErrors.length > 0) {
    throw new Error(clientErrors.map((error) => error.message).join('; '));
  }

  const client = clientResult.clientCreate.client;
  if (!client?.id) {
    throw new Error('Jobber did not return a client ID.');
  }

  const clientId = client.id;
  const propertyId = client.properties[0]?.id;

  const requestResult = await jobberRequest<RequestCreateResult>(REQUEST_CREATE_MUTATION, {
    input: {
      clientId,
      ...(propertyId ? { propertyId } : {}),
      title: 'Website quote request',
      requestDetails: {
        form: {
          sections: [
            {
              label: 'Website Submission',
              items: [
                { label: 'Message', answerText: lead.message },
                { label: 'Address', answerText: lead.address },
                { label: 'City', answerText: lead.city },
                { label: 'State', answerText: lead.state },
                { label: 'Postal Code', answerText: lead.postalCode },
              ],
            },
          ],
        },
      },
    },
  });

  const requestErrors = requestResult.requestCreate.userErrors;
  if (requestErrors.length > 0) {
    throw new Error(requestErrors.map((error) => error.message).join('; '));
  }

  const requestId = requestResult.requestCreate.request?.id;
  if (!requestId) {
    throw new Error('Jobber did not return a request ID.');
  }

  return { clientId, requestId };
}
