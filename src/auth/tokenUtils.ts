import { jwtDecode } from 'jwt-decode';

import type { AuthIdentity, AuthSession, JwtPayload } from '../types/auth';

export function decodeSession(
    accessToken: string,
    identity?: AuthIdentity | null
): AuthSession | null {
    try {
        const payload = jwtDecode<JwtPayload>(accessToken);

        if (!payload.sub || !payload.exp) {
            return null;
        }

        return {
            userId: String(payload.id),
            email: payload.sub,
            fullName: identity?.fullName,
            roles: identity?.roles?.length
                ? identity.roles
                : (payload.roles ?? []),
            accessToken,
        };
    } catch {
        return null;
    }
}

export function isTokenExpired(accessToken: string): boolean {
    try {
        const payload = jwtDecode<JwtPayload>(accessToken);

        const expiresAt = payload.exp * 1000;

        return Date.now() >= expiresAt;
    } catch {
        return true;
    }
}
