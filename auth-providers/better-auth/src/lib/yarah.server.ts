// Pattern B — per-request Yarah client construction for server components,
// route handlers, and server actions. Use this when you don't want a long-lived
// client + refresh logic, e.g. for SSR data fetching.
import { createClient } from '@yarahdev/sdk';
import { auth } from './auth';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function createYarahClient() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const yarahToken = jwt.sign(
    {
      sub: session.user.id,
      role: 'authenticated',
      aud: 'yarah-api',
    },
    process.env.YARAH_JWT_SECRET!,
    { algorithm: 'HS256', expiresIn: '1h' },
  );

  return createClient({
    baseUrl: process.env.NEXT_PUBLIC_YARAH_BASE_URL!,
    edgeFunctionToken: yarahToken, // sets BOTH HttpClient + TokenManager
  });
}
