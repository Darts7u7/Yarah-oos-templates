import { createClient } from '@yarahdev/sdk';
import { DEFAULT_MODEL } from '@/lib/constants';

let serverClient: ReturnType<typeof createClient> | null = null;

export const DEFAULT_SYSTEM_PROMPT =
  'You are a thoughtful assistant inside a product-grade web chatbot. Be concise, helpful, and clear.';

export function getConfiguredModel() {
  return process.env.YARAH_AI_MODEL?.trim() || DEFAULT_MODEL;
}

function getYarahConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_YARAH_URL;
  const anonKey = process.env.NEXT_PUBLIC_YARAH_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error(
      'Missing Yarah configuration. Set NEXT_PUBLIC_YARAH_URL and NEXT_PUBLIC_YARAH_ANON_KEY.',
    );
  }

  return { baseUrl, anonKey };
}

export function createYarahServerClient(options?: { accessToken?: string }) {
  const { baseUrl, anonKey } = getYarahConfig();

  return createClient({
    baseUrl,
    anonKey,
    isServerMode: true,
    ...(options?.accessToken
      ? { edgeFunctionToken: options.accessToken }
      : {}),
  });
}

export function getYarahServerClient() {
  if (!serverClient) {
    serverClient = createYarahServerClient();
  }

  return serverClient;
}
