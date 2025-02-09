// kindeApiClient.ts
// This module encapsulates the configuration for calling your Kinde API.
// It uses the KINDE_BASE_URL and KINDE_API_SECRET from your environment variables.

const baseUrl = process.env.KINDE_BASE_URL?.replace(/\/$/, "") || "";
const apiSecret = process.env.KINDE_API_SECRET;

export interface KindeApiResponse<T = any> {
  data: T;
}

/**
 * A reusable function to perform API requests to Kinde.
 *
 * @param endpoint - The API endpoint (e.g. "/organization")
 * @param options - Fetch options (method, body, etc.)
 * @returns The parsed JSON response.
 */
export async function kindeApiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const baseUrl = process.env.NEXT_PUBLIC_KINDE_BASE_URL;
  const apiSecret = process.env.NEXT_PUBLIC_KINDE_API_SECRET;

  console.log('Environment variables check:', {
    baseUrl: baseUrl ? 'exists' : 'missing',
    apiSecret: apiSecret ? 'exists' : 'missing'
  });

  if (!baseUrl || !apiSecret) {
    throw new Error('Missing required environment variables: ' + 
      (!baseUrl ? 'NEXT_PUBLIC_KINDE_BASE_URL ' : '') +
      (!apiSecret ? 'NEXT_PUBLIC_KINDE_API_SECRET' : '')
    );
  }

  const url = `${baseUrl}${endpoint}`;
  
  console.log('kindeApiFetch Request:', {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  });

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiSecret}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  console.log('kindeApiFetch Response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('kindeApiFetch Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
  }

  return response.json();
}
