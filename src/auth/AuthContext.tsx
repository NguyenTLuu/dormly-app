import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { logoutApi, refreshApi } from '../api/authApi';
import { queryClient } from '../lib/queryClient';
import type {
    AuthIdentity,
    AuthSession,
    AuthTokensResponse,
} from '../types/auth';

import { setUnauthorizedListener } from './authEvents';
import { authStorage } from './authStorage';
import { decodeSession, isTokenExpired } from './tokenUtils';

interface AuthContextValue {
    session: AuthSession | null;
    isBootstrapping: boolean;
    isAuthenticated: boolean;

    setAuthTokens: (tokens: AuthTokensResponse) => Promise<void>;
    updateProfileName: (fullName: string) => Promise<void>;

    signOut: () => Promise<void>;

    hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<AuthSession | null>(null);

    const [isBootstrapping, setIsBootstrapping] = useState(true);

    const clearLocalSession = useCallback(async () => {
        await authStorage.clear();

        setSession(null);

        /*
         * Không giữ cache dữ liệu
         * của tài khoản đã đăng xuất.
         */
        queryClient.clear();
    }, []);

    const setAuthTokens = useCallback(
        async (tokens: AuthTokensResponse): Promise<void> => {
            const storedIdentity = await authStorage.getIdentity();
            const identity: AuthIdentity = {
                fullName: tokens.fullName ?? storedIdentity?.fullName,
                roles:
                    tokens.roles && tokens.roles.length > 0
                        ? tokens.roles
                        : storedIdentity?.roles,
            };
            const decodedSession = decodeSession(tokens.accessToken, identity);

            if (!decodedSession) {
                throw new Error('Access token không hợp lệ');
            }

            await Promise.all([
                authStorage.saveAccessToken(tokens.accessToken),
                authStorage.saveIdentity(identity),
            ]);

            setSession(decodedSession);
        },
        []
    );

    const signOut = useCallback(async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            await clearLocalSession();
        }
    }, [clearLocalSession]);

    const updateProfileName = useCallback(async (fullName: string) => {
        const identity = await authStorage.getIdentity();
        await authStorage.saveIdentity({ ...identity, fullName });
        setSession((current) =>
            current ? { ...current, fullName } : current
        );
    }, []);

    /*
     * Khi Axios không thể refresh token,
     * tự động chuyển người dùng về login.
     */
    useEffect(() => {
        setUnauthorizedListener(() => {
            void clearLocalSession();
        });

        return () => {
            setUnauthorizedListener(null);
        };
    }, [clearLocalSession]);

    /*
     * Khôi phục phiên đăng nhập khi mở app.
     */
    useEffect(() => {
        async function bootstrapAuth() {
            try {
                const [storedToken, storedIdentity] = await Promise.all([
                    authStorage.getAccessToken(),
                    authStorage.getIdentity(),
                ]);

                if (storedToken && !isTokenExpired(storedToken)) {
                    const restoredSession = decodeSession(
                        storedToken,
                        storedIdentity
                    );

                    setSession(restoredSession);
                    return;
                }

                /*
                 * Access token đã hết hạn:
                 * thử dùng refresh cookie.
                 */
                try {
                    const refreshed = await refreshApi();

                    await setAuthTokens(refreshed);
                } catch {
                    await clearLocalSession();
                }
            } finally {
                setIsBootstrapping(false);
            }
        }

        void bootstrapAuth();
    }, [clearLocalSession, setAuthTokens]);

    const hasRole = useCallback(
        (...allowedRoles: string[]) => {
            if (!session) {
                return false;
            }

            return allowedRoles.some((allowedRole) => {
                const normalizedAllowedRole = allowedRole
                    .replace(/^ROLE_/, '')
                    .toUpperCase();

                return session.roles.some((sessionRole) => {
                    const normalizedSessionRole = sessionRole
                        .replace(/^ROLE_/, '')
                        .toUpperCase();

                    return normalizedSessionRole === normalizedAllowedRole;
                });
            });
        },
        [session]
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            isBootstrapping,
            isAuthenticated: session !== null,
            setAuthTokens,
            updateProfileName,
            signOut,
            hasRole,
        }),
        [session, isBootstrapping, setAuthTokens, updateProfileName, signOut, hasRole]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth phải nằm bên trong AuthProvider');
    }

    return context;
}
