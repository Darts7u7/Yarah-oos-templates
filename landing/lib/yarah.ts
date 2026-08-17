import 'server-only';

import { createClient } from '@yarahdev/sdk';

let cached: ReturnType<typeof createClient> | null = null;
let cachedConfig: { baseUrl: string; anonKey: string } | null = null;

function readConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_YARAH_URL;
  const anonKey = process.env.NEXT_PUBLIC_YARAH_ANON_KEY;
  if (!baseUrl || !anonKey) {
    throw new Error(
      'Missing Yarah config. Set NEXT_PUBLIC_YARAH_URL and NEXT_PUBLIC_YARAH_ANON_KEY in .env.local.',
    );
  }
  return { baseUrl, anonKey };
}

export function createYarahServerClient(options?: { accessToken?: string }) {
  const { baseUrl, anonKey } = readConfig();
  return createClient({
    baseUrl,
    anonKey,
    isServerMode: true,
    ...(options?.accessToken ? { edgeFunctionToken: options.accessToken } : {}),
  });
}

export function getYarahServerClient() {
  const config = readConfig();
  if (
    !cached ||
    !cachedConfig ||
    cachedConfig.baseUrl !== config.baseUrl ||
    cachedConfig.anonKey !== config.anonKey
  ) {
    cached = createYarahServerClient();
    cachedConfig = config;
  }
  return cached;
}
