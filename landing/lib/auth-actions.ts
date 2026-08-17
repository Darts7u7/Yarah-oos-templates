'use server';

import { redirect } from 'next/navigation';
import {
  clearAuthCookies,
  consumePkceVerifier,
  setAuthCookies,
  setPkceVerifier,
} from '@/lib/auth-cookies';
import { getYarahServerClient } from '@/lib/yarah';

export type AuthResult = { success: true } | { success: false; error: string };

export type SignUpResult =
  | { success: true; requireVerification: boolean }
  | { success: false; error: string };

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const yarah = getYarahServerClient();
  const { data, error } = await yarah.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message ?? 'Sign in failed.' };
  }
  if (!data?.accessToken || !data?.refreshToken) {
    return { success: false, error: 'Sign in failed.' };
  }

  await setAuthCookies(data.accessToken, data.refreshToken);
  return { success: true };
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  const yarah = getYarahServerClient();
  const { data, error } = await yarah.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message ?? 'Sign up failed.' };
  }

  // If the project has email verification enabled, signUp succeeds without
  // returning a session — the user must verify before they can sign in.
  if (!data?.accessToken || !data?.refreshToken) {
    return { success: true, requireVerification: true };
  }

  await setAuthCookies(data.accessToken, data.refreshToken);
  return { success: true, requireVerification: false };
}

export async function getOAuthUrl(
  provider: 'google' | 'github',
): Promise<{ url: string } | { error: string }> {
  const yarah = getYarahServerClient();
  const origin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');

  type OAuthProvider = Parameters<typeof yarah.auth.signInWithOAuth>[0]['provider'];

  const { data, error } = await yarah.auth.signInWithOAuth({
    provider: provider as OAuthProvider,
    redirectTo: `${origin}/auth/callback`,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url) {
    return { error: error?.message ?? 'OAuth provider not configured.' };
  }
  if (data.codeVerifier) {
    await setPkceVerifier(data.codeVerifier);
  }
  return { url: data.url };
}

export async function exchangeAuthCode(code: string): Promise<AuthResult> {
  const yarah = getYarahServerClient();
  const codeVerifier = await consumePkceVerifier();
  const { data, error } = await yarah.auth.exchangeOAuthCode(code, codeVerifier ?? undefined);

  if (error || !data?.accessToken || !data?.refreshToken) {
    return { success: false, error: error?.message ?? 'Code exchange failed.' };
  }
  await setAuthCookies(data.accessToken, data.refreshToken);
  return { success: true };
}

export async function signOut() {
  const yarah = getYarahServerClient();
  try {
    await yarah.auth.signOut();
  } catch {
    // best-effort — still clear cookies + redirect
  }
  await clearAuthCookies();
  redirect('/');
}
