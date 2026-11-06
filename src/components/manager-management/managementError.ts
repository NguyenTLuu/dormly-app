import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

export function managementError(error: unknown, fallback: string) {
    return isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data.message || fallback
        : fallback;
}
