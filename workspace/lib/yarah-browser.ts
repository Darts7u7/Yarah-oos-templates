'use client';

import { createClient } from '@yarahdev/sdk';

let client: ReturnType<typeof createClient> | null = null;

export function getYarahBrowserClient() {
  if (client) return client;
  const baseUrl = process.env.NEXT_PUBLIC_YARAH_URL;
  const anonKey = process.env.NEXT_PUBLIC_YARAH_ANON_KEY;
  if (!baseUrl || !anonKey) {
    throw new Error('Missing Yarah configuration.');
  }
  client = createClient({ baseUrl, anonKey });
  return client;
}
