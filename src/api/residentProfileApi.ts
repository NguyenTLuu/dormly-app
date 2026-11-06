import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/api';
import type { AdminUser } from '@/types/admin';
import type { ResidentDocument } from '@/types/managerResident';
import type {
    ResidentAcademicProfile,
    ResidentContactInput,
    ResidentProfileData,
} from '@/types/residentProfile';

export async function getResidentProfileData(
    userId: string
): Promise<ResidentProfileData> {
    // The single-profile endpoint resolves the authenticated user. In this DTO,
    // profile.id is the resident user ID, so staff can select from the list.
    const [profiles, documents] = await Promise.all([
        axiosClient.get<ApiResponse<ResidentAcademicProfile[]>>(
            '/api/users/profile/student-profiles'
        ),
        axiosClient.get<ApiResponse<ResidentDocument[]>>(
            `/api/users/me/documents/user/${userId}`
        ),
    ]);
    return {
        academic:
            profiles.data.result.find((item) => item.id === userId) ?? null,
        documents: documents.data.result,
    };
}

export async function updateResidentContact(
    userId: string,
    input: ResidentContactInput
): Promise<AdminUser> {
    const response = await axiosClient.put<ApiResponse<AdminUser>>(
        `/api/users/${userId}`,
        input
    );
    return response.data.result;
}
