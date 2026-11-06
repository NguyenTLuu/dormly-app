import { axiosClient } from './axiosClient';

import type { ApiResponse } from '@/types/api';
import type {
    ResidentDocument,
    ResidentDocumentItem,
    ResidentDocumentStatus,
    ResidentUser,
} from '@/types/managerResident';

export async function getResidentUsers(): Promise<ResidentUser[]> {
    const response =
        await axiosClient.get<ApiResponse<ResidentUser[]>>('/api/users');
    return response.data.result;
}

export async function toggleResidentAccount(id: string): Promise<ResidentUser> {
    const response = await axiosClient.patch<ApiResponse<ResidentUser>>(
        `/api/users/toggle/${id}`
    );
    return response.data.result;
}

export async function getResidentDocuments(): Promise<ResidentDocumentItem[]> {
    const [users, documents] = await Promise.all([
        getResidentUsers(),
        axiosClient.get<ApiResponse<Record<string, ResidentDocument[]>>>(
            '/api/users/me/documents/grouped-by-user-id'
        ),
    ]);
    const userById = new Map(users.map((user) => [user.id, user]));

    return Object.entries(documents.data.result).flatMap(
        ([userId, userDocuments]) => {
            const user = userById.get(userId);

            return userDocuments.map((document) => ({
                ...document,
                userId,
                residentName: user?.fullName || 'Dorm resident',
                residentEmail: user?.email || 'No email available',
            }));
        }
    );
}

export async function updateResidentDocumentStatus(input: {
    id: string;
    status: ResidentDocumentStatus;
    rejectReason?: string;
}): Promise<ResidentDocument> {
    const response = await axiosClient.patch<ApiResponse<ResidentDocument>>(
        `/api/users/me/documents/${input.id}/status`,
        {
            status: input.status,
            rejectReason: input.rejectReason,
        }
    );
    return response.data.result;
}
