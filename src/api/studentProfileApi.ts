import { axiosClient } from './axiosClient';

import type { ApiResponse } from '../types/api';
import type {
    ChangeStudentPasswordInput,
    StudentAcademicProfile,
    StudentDocument,
    StudentDocumentType,
    StudentUserProfile,
    UpdateStudentUserProfileInput,
} from '../types/studentProfile';

export async function getStudentUserProfile(userId: string) {
    const response = await axiosClient.get<ApiResponse<StudentUserProfile>>(
        `/api/users/${userId}`
    );
    return response.data.result;
}

export async function updateStudentUserProfile(
    userId: string,
    input: UpdateStudentUserProfileInput
) {
    const response = await axiosClient.put<ApiResponse<StudentUserProfile>>(
        `/api/users/${userId}`,
        input
    );
    return response.data.result;
}

export async function getStudentAcademicProfile() {
    const response = await axiosClient.get<ApiResponse<StudentAcademicProfile>>(
        '/api/users/profile/student-profile'
    );
    return response.data.result;
}

export async function getStudentDocuments() {
    const response = await axiosClient.get<ApiResponse<StudentDocument[]>>(
        '/api/users/me/documents'
    );
    return response.data.result;
}

export async function uploadStudentDocument(
    documentType: StudentDocumentType,
    file: { uri: string; name: string; mimeType?: string | null }
) {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('status', 'PENDING');
    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob);

    const response = await axiosClient.post<ApiResponse<StudentDocument>>(
        '/api/users/me/documents',
        formData
    );
    return response.data.result;
}

export async function changeStudentPassword(
    userId: string,
    input: ChangeStudentPasswordInput
) {
    await axiosClient.put<ApiResponse<void>>(
        `/api/users/${userId}/update-password`,
        input
    );
}
