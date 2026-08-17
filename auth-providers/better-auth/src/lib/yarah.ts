'use client';

import { createClient, type YarahClient } from '@yarahdev/sdk';
import { authClient } from './auth-client';
import { useEffect, useMemo, useState } from 'react';

const REFRESH_INTERVAL_MS = 50 * 60 * 1000; // 50 min for the 1h bridge JWT

// Bridge JWT → both HTTP and realtime auth.
// On SDK ≥ 1.3.0 this is a single client.setAccessToken(token) call.
// On 1.2.x we update the http client + the realtime token manager separately —
// realtime needs its own pump or its WebSocket keeps using the anon key.
function setBridgeToken(client: YarahClient, token: string | null) {
  if (typeof (client as unknown as { setAccessToken?: unknown }).setAccessToken === 'function') {
    (client as unknown as { setAccessToken: (t: string | null) => void }).setAccessToken(token);
    return;
  }
  client.getHttpClient().setAuthToken(token);
  // tokenManager is private at compile-time but accessible at runtime; this is
  // the documented BA-bridge pattern until ≥1.3.0 ships across the ecosystem.
  (client.realtime as unknown as { tokenManager: { setAccessToken: (t: string | null) => void } })
    .tokenManager.setAccessToken(token);
}

// Pattern A — long-lived Yarah client + imperative refresh from the BA session.
// Fetches /api/yarah-token (same-origin, BA cookie auto-attached) and pipes
// the resulting HS256 JWT into the SDK so HTTP (database/storage/functions/AI/
// emails) and realtime (WebSocket auth) both authenticate as the BA user.
export function useYarahClient(): { client: YarahClient; isReady: boolean } {
  const session = authClient.useSession();
  const [isReady, setIsReady] = useState(false);

  const client = useMemo(
    () =>
      createClient({
        baseUrl: process.env.NEXT_PUBLIC_YARAH_BASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_YARAH_ANON_KEY!,
        autoRefreshToken: false,
      }),
    [],
  );

  useEffect(() => {
    if (!session.data?.user) {
      setBridgeToken(client, null);
      setIsReady(false);
      return;
    }

    let cancelled = false;
    const refresh = async () => {
      try {
        const res = await fetch('/api/yarah-token', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`bridge ${res.status}`);
        const { token } = (await res.json()) as { token?: string };
        if (cancelled) return;
        if (typeof token !== 'string' || !token) throw new Error('bridge: no token in response');
        setBridgeToken(client, token);
        setIsReady(true);
      } catch {
        if (cancelled) return;
        setBridgeToken(client, null);
        setIsReady(false);
      }
    };

    void refresh();
    const id = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [client, session.data?.user?.id]);

  return { client, isReady };
}
