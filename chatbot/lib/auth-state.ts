import 'server-only';

import type { UserSchema } from '@yarahdev/sdk';
import { getAccessToken, getRefreshToken } from '@/lib/auth-cookies';
import { createYarahServerClient } from '@/lib/yarah';
import type { AuthViewer } from '@/lib/types';

const UNAUTHENTICATED_VIEWER: AuthViewer = {
  isAuthenticated: false,
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
};

function mapUserToViewer(user: UserSchema | null | undefined): AuthViewer {
  if (!user) return UNAUTHENTICATED_VIEWER;

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

  if (error || !data?.accessToken || !data.user) {
    return null;
  }

  return data.user;
}

export async function getCurrentViewer(): Promise<AuthViewer> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) {
    const yarah = createYarahServerClient({ accessToken });
    const { data, error } = await yarah.auth.getCurrentUser();

    if (!error && data.user) {
      return mapUserToViewer(data.user);
    }
  }

  if (refreshToken) {
    const user = await refreshAuthenticatedUser(refreshToken);
    return mapUserToViewer(user);
  }

  return UNAUTHENTICATED_VIEWER;
}
