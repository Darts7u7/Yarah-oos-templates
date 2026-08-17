import 'server-only';

import type { UserSchema } from '@yarahdev/sdk';
import { getAccessToken, getRefreshToken } from '@/lib/auth-cookies';
import { createYarahServerClient } from '@/lib/yarah';
import type { AuthViewer } from '@/lib/types';

const VISITOR_VIEWER: AuthViewer = {
  isAuthenticated: false,
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
};

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

async function refreshAuthenticatedUser(refreshToken: string) {
  const yarah = createYarahServerClient();
  const { data, error } = await yarah.auth.refreshSession({ refreshToken });

  if (error || !data?.accessToken || !data.user) {
    return null;
  }

  return {
    accessToken: data.accessToken,
    user: data.user,
  };
}

export async function getAuthenticatedSession(): Promise<{
  viewer: AuthViewer;
  accessToken: string | null;
}> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) {
    const yarah = createYarahServerClient({ accessToken });
    const { data, error } = await yarah.auth.getCurrentUser();

    if (!error && data.user) {
      return {
        viewer: mapUserToViewer(data.user),
        accessToken,
      };
    }
  }

  if (refreshToken) {
    const refreshed = await refreshAuthenticatedUser(refreshToken);

    if (refreshed) {
      return {
        viewer: mapUserToViewer(refreshed.user),
        accessToken: refreshed.accessToken,
      };
    }
  }

  return {
    viewer: VISITOR_VIEWER,
    accessToken: null,
  };
}

export async function getCurrentViewer(): Promise<AuthViewer> {
  const session = await getAuthenticatedSession();
  return session.viewer;
}
