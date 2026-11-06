import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { emitUnauthorized } from '../auth/authEvents';
import { authStorage } from '../auth/authStorage';
import type { ApiResponse } from '../types/api';
import type { AuthTokensResponse } from '../types/auth';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
    throw new Error('EXPO_PUBLIC_API_URL chưa được cấu hình');
}

/*
 * Instance này dùng cho login và refresh.
 * Không gắn response interceptor để tránh vòng lặp 401.
 */
export const publicAxios = axios.create({
    baseURL,
    timeout: 15_000,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

/*
 * Instance dùng cho các API cần đăng nhập.
 */
export const axiosClient = axios.create({
    baseURL,
    timeout: 15_000,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = await authStorage.getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
);

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = publicAxios
            .post<ApiResponse<AuthTokensResponse>>('/api/v1/auth/refresh')
            .then(async (response) => {
                const newAccessToken = response.data.result.accessToken;

                await authStorage.saveAccessToken(newAccessToken);

                return newAccessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

axiosClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshAccessToken();

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosClient(originalRequest);
        } catch (refreshError) {
            await authStorage.clear();
            emitUnauthorized();

            return Promise.reject(refreshError);
        }
    }
);
