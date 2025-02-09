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
export async function kindeApiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl}${endpoint}`;
  const headers = new Headers(options.headers);
  
  // Always set these headers.
  headers.set("Authorization", `Bearer ${apiSecret}`);
  headers.set("Content-Type", "application/json");
  
  console.log("[kindeApiClient] Fetching URL:", url);
  
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  console.log("[kindeApiClient] Response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("[kindeApiClient] Error response:", errorText);
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}
