import "server-only";

import type { UserSchema } from "@yarahdev/sdk";

import { getAccessToken, getRefreshToken } from "@/lib/auth-cookies";
import { createYarahServerClient } from "@/lib/yarah";

type AuthViewer = {
  isAuthenticated: boolean;
  id: string | null;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

const VISITOR_VIEWER: AuthViewer = {
  isAuthenticated: false,
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
};

export type { AuthViewer };

function mapUserToViewer(user: UserSchema | null | undefined): AuthViewer {
  if (!user) {
    return VISITOR_VIEWER;
  }

  return {
    isAuthenticated: true,
    id: user.id,
    email: user.email,
    name: user.profile?.name?.trim() || null,
    avatarUrl: user.profile?.avatar_url?.trim() || null,
  };
}

async function refreshAuthenticatedUser(refreshToken: string) {
  const yarah = createYarahServerClient();
  const { data, error } = await yarah.auth.refreshSession({ refreshToken });

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

export async function getCurrentUserDetails(): Promise<UserSchema | null> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) {
    const yarah = createYarahServerClient({ accessToken });
    const { data, error } = await yarah.auth.getCurrentUser();

    if (!error && data.user) {
      return data.user;
    }
  }

  if (refreshToken) {
    return refreshAuthenticatedUser(refreshToken);
  }

  return null;
}

export async function getCurrentViewer(): Promise<AuthViewer> {
  const user = await getCurrentUserDetails();
  return mapUserToViewer(user);
}
