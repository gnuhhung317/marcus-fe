export interface SessionStateInput {
  accessToken?: string | null;
  refreshToken?: string | null;
  role?: string | null;
}

export function normalizeRole(role?: string | null): string | undefined {
  if (!role) {
    return undefined;
  }

  return role === 'USER' ? 'TRADER' : role;
}

export function hasAuthenticatedSession({ accessToken, refreshToken, role }: SessionStateInput): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole || normalizedRole === 'GUEST') {
    return false;
  }

  return Boolean(accessToken || refreshToken);
}
