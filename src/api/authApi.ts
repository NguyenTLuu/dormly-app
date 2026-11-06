import { axiosClient, publicAxios } from './axiosClient';

import { authStorage } from '../auth/authStorage';
import type { ApiResponse } from '../types/api';
import type {
    AuthTokensResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterStudentRequest,
} from '../types/auth';

export async function loginApi(
    body: LoginRequest
): Promise<AuthTokensResponse> {
    const response = await publicAxios.post<ApiResponse<AuthTokensResponse>>(
        '/api/v1/auth/login',
        body
    );

    return response.data.result;
}

export async function refreshApi(): Promise<AuthTokensResponse> {
    const response = await publicAxios.post<ApiResponse<AuthTokensResponse>>(
        '/api/v1/auth/refresh'
    );

    return response.data.result;
}

export async function logoutApi(): Promise<void> {
    try {
        await axiosClient.post('/api/v1/auth/logout');
    } finally {
        await authStorage.clear();
    }
}

export async function requestRegistrationCode(email: string): Promise<void> {
    await publicAxios.post<ApiResponse<void>>(
        '/api/request-code/register-code',
        {
            email,
        }
    );
}

export async function requestForgotPasswordCode(email: string): Promise<void> {
    await publicAxios.post<ApiResponse<void>>(
        '/api/request-code/forgot-password-code',
        { email }
    );
}

export async function forgotPasswordApi(
    request: ForgotPasswordRequest
): Promise<void> {
    await publicAxios.post<ApiResponse<void>>(
        '/api/v1/auth/forgot-password',
        request
    );
}

export async function registerStudentApi(
    request: RegisterStudentRequest
): Promise<void> {
    const formData = new FormData();
    const { citizenIdFile, studentCardFile, ...payload } = request;

    formData.append(
        'request',
        JSON.stringify({
            ...payload,
            major: payload.major || undefined,
        })
    );
    formData.append('citizenIdFile', toFormDataFile(citizenIdFile));
    formData.append('studentCardFile', toFormDataFile(studentCardFile));

    await publicAxios.post<ApiResponse<void>>(
        '/api/v1/auth/register',
        formData
    );
}

function toFormDataFile(file: RegisterStudentRequest['citizenIdFile']): Blob {
    return {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob;
}
