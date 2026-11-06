import type { ApiResponse } from '@/types/api';
import type { AdminUser } from '@/types/admin';
import { axiosClient } from './axiosClient';

export interface StaffProfileUpdate {
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
}

export async function getStaffProfile(userId: string): Promise<AdminUser> {
    const response = await axiosClient.get<ApiResponse<AdminUser>>(
        `/api/users/${userId}`
    );
    return response.data.result;
}

export async function updateStaffProfile(
    userId: string,
    input: StaffProfileUpdate
): Promise<AdminUser> {
    const response = await axiosClient.put<ApiResponse<AdminUser>>(
        `/api/users/${userId}`,
        input
    );
    return response.data.result;
}
