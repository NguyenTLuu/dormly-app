import * as SecureStore from 'expo-secure-store';

import type { AuthIdentity } from '../types/auth';

const ACCESS_TOKEN_KEY = 'dormly_access_token';
const AUTH_IDENTITY_KEY = 'dormly_auth_identity';

export const authStorage = {
    async getAccessToken(): Promise<string | null> {
        return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    async saveAccessToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    },

    async getIdentity(): Promise<AuthIdentity | null> {
        const serialized = await SecureStore.getItemAsync(AUTH_IDENTITY_KEY);
        if (!serialized) return null;

        try {
            return JSON.parse(serialized) as AuthIdentity;
        } catch {
            await SecureStore.deleteItemAsync(AUTH_IDENTITY_KEY);
            return null;
        }
    },

    async saveIdentity(identity: AuthIdentity): Promise<void> {
        await SecureStore.setItemAsync(
            AUTH_IDENTITY_KEY,
            JSON.stringify(identity)
        );
    },

    async clear(): Promise<void> {
        await Promise.all([
            SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
            SecureStore.deleteItemAsync(AUTH_IDENTITY_KEY),
        ]);
    },
};
