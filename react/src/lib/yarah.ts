import { createClient } from '@yarahdev/sdk';

let browserClient: ReturnType<typeof createClient> | null = null;

export function getYarahConfig() {
  const baseUrl = import.meta.env.VITE_YARAH_BASE_URL?.trim();
  const anonKey = import.meta.env.VITE_YARAH_ANON_KEY?.trim();

  return {
    baseUrl: baseUrl ?? '',
    anonKey: anonKey ?? '',
    isConfigured: Boolean(baseUrl),
  };
}

export function createYarahClient() {
  const { baseUrl, anonKey } = getYarahConfig();

  if (!baseUrl || !anonKey) {
    throw new Error(
      'Missing Yarah configuration. Set VITE_YARAH_BASE_URL and VITE_YARAH_ANON_KEY.',
    );
  }

  return createClient({ baseUrl, anonKey });
}

export function getYarahClient() {
  if (!browserClient) {
    browserClient = createYarahClient();
  }

  return browserClient;
}
