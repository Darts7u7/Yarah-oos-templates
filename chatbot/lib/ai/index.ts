import type { AIProvider } from '@/lib/ai/types';

export type { AIProvider, AIChatMessage, UserContentPart, FileParserOptions, StreamCompletionParams } from '@/lib/ai/types';

type ProviderName = 'yarah' | 'vercel';

export function getAIProviderName(): ProviderName {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (!raw || raw === 'yarah') return 'yarah';
  if (raw === 'vercel') return 'vercel';

  throw new Error(
    `Unknown AI_PROVIDER "${raw}". Supported values: yarah, vercel.`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAIProvider(yarahClient?: any): Promise<AIProvider> {
  const name = getAIProviderName();

  if (name === 'yarah') {
    if (!yarahClient) {
      throw new Error('Yarah client is required for the yarah AI provider.');
    }
    const { createYarahAIProvider } = await import('@/lib/ai/providers/yarah');
    return createYarahAIProvider(yarahClient as Parameters<typeof createYarahAIProvider>[0]);
  }

  const { createVercelAIProvider } = await import('@/lib/ai/providers/vercel');
  return createVercelAIProvider();
}
