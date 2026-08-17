import type { UserSchema } from '@yarahdev/sdk';
import { getYarahClient, getYarahConfig } from './yarah';

export type AuthResult = { success: true } | { success: false; error: string };
export type SignUpResult =
  | { success: true; requireVerification: boolean }
  | { success: false; error: string };
export type ResetCodeResult =
  | { success: true; token: string }
  | { success: false; error: string };
export type OAuthUrlResult = { url: string } | { error: string };

export type AuthViewer = {
  isAuthenticated: boolean;
  id: string | null;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

export const VISITOR_VIEWER: AuthViewer = {
  isAuthenticated: false,
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
};

const PKCE_STORAGE_KEY = 'yarah_pkce_verifier';

function getRedirectOrigin() {
  return window.location.origin;
}

function setPkceVerifier(verifier: string) {
  window.sessionStorage.setItem(PKCE_STORAGE_KEY, verifier);
}

function consumePkceVerifier() {
  const verifier = window.sessionStorage.getItem(PKCE_STORAGE_KEY);
  if (verifier) {
    window.sessionStorage.removeItem(PKCE_STORAGE_KEY);
  }

  return verifier;
}

function mapUserToViewer(user: UserSchema | null | undefined): AuthViewer {
  if (!user) return VISITOR_VIEWER;

  return {
    isAuthenticated: true,
    id: user.id,
    email: user.email,
    name: user.profile?.name?.trim() || null,
    avatarUrl: user.profile?.avatar_url?.trim() || null,
  };
}

export async function getAuthConfig() {
  const { baseUrl } = getYarahConfig();

  if (!baseUrl) {
    return {
      oAuthProviders: [] as string[],
      requireEmailVerification: false,
      passwordMinLength: 8,
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/auth/public-config`, { cache: 'no-store' });

    if (!response.ok) {
      return {
        oAuthProviders: [] as string[],
        requireEmailVerification: false,
        passwordMinLength: 8,
      };
    }

    return (await response.json()) as {
      requireEmailVerification: boolean;
      passwordMinLength: number;
      verifyEmailMethod: string;
      resetPasswordMethod: string;
      oAuthProviders: string[];
    };
  } catch {
    return {
      oAuthProviders: [] as string[],
      requireEmailVerification: false,
      passwordMinLength: 8,
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const yarah = getYarahClient();
  const { error } = await yarah.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.statusCode === 403) {
      return { success: false, error: 'Email not verified. Please verify your email first.' };
    }

    return { success: false, error: error.message ?? 'Sign in failed.' };
  }

  return { success: true };
}

export async function signUp(email: string, password: string, name: string): Promise<SignUpResult> {
  const yarah = getYarahClient();
  const { data, error } = await yarah.auth.signUp({
    email,
    password,
    name,
    redirectTo: `${getRedirectOrigin()}/auth/sign-in`,
  });

  if (error) {
    return { success: false, error: error.message ?? 'Sign up failed.' };
  }

  if (data?.requireEmailVerification) {
    return { success: true, requireVerification: true };
  }

  return { success: true, requireVerification: false };
}

export async function verifyEmail(email: string, otp: string): Promise<AuthResult> {
  const yarah = getYarahClient();
  const { error } = await yarah.auth.verifyEmail({ email, otp });

  if (error) {
    return { success: false, error: error.message ?? 'Verification failed.' };
  }

  return { success: true };
}

export async function resendVerification(email: string): Promise<AuthResult> {
  const yarah = getYarahClient();

  try {
    await yarah.auth.resendVerificationEmail({
      email,
      redirectTo: `${getRedirectOrigin()}/auth/sign-in`,
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to resend verification code.' };
  }
}

export async function sendResetEmail(email: string): Promise<AuthResult> {
  const yarah = getYarahClient();

  try {
    await yarah.auth.sendResetPasswordEmail({
      email,
      redirectTo: `${getRedirectOrigin()}/auth/reset-password`,
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to send reset email.' };
  }
}

export async function exchangeResetCode(email: string, code: string): Promise<ResetCodeResult> {
  const yarah = getYarahClient();
  const { data, error } = await yarah.auth.exchangeResetPasswordToken({ email, code });

  if (error || !data?.token) {
    return { success: false, error: error?.message ?? 'Invalid or expired code.' };
  }

  return { success: true, token: data.token };
}

export async function resetPassword(newPassword: string, otp: string): Promise<AuthResult> {
  const yarah = getYarahClient();
  const { error } = await yarah.auth.resetPassword({ newPassword, otp });

  if (error) {
    return { success: false, error: error.message ?? 'Password reset failed.' };
  }

  return { success: true };
}

export async function getOAuthUrl(provider: string): Promise<OAuthUrlResult> {
  try {
    const yarah = getYarahClient();

    type OAuthProvider = Parameters<typeof yarah.auth.signInWithOAuth>[0]['provider'];

    const { data, error } = await yarah.auth.signInWithOAuth({
      provider: provider as OAuthProvider,
      redirectTo: `${getRedirectOrigin()}/auth/callback`,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url) {
      return { error: error?.message ?? 'OAuth failed.' };
    }

    if (data.codeVerifier) {
      setPkceVerifier(data.codeVerifier);
    }

    return { url: data.url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'OAuth failed.',
    };
  }
}

export async function exchangeAuthCode(code: string): Promise<AuthResult> {
  const yarah = getYarahClient();
  const codeVerifier = consumePkceVerifier();
  const { error } = await yarah.auth.exchangeOAuthCode(code, codeVerifier ?? undefined);

  if (error) {
    return { success: false, error: error.message ?? 'Code exchange failed.' };
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  const yarah = getYarahClient();
  await yarah.auth.signOut();
}

export async function getCurrentViewer(): Promise<AuthViewer> {
  const yarah = getYarahClient();
  const { data, error } = await yarah.auth.getCurrentUser();

  if (error || !data?.user) {
    return VISITOR_VIEWER;
  }

  return mapUserToViewer(data.user);
}
