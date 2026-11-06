export interface StudentUserProfile {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
    avatar?: string | null;
}

export interface StudentAcademicProfile {
    id: string;
    studentCode: string;
    major?: string | null;
}

export type StudentDocumentType =
    | 'CCCD_FRONT'
    | 'CCCD_BACK'
    | 'TEMPORARY_RESIDENCE';

export type StudentDocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StudentDocument {
    id: string;
    documentType: StudentDocumentType;
    fileUrl: string;
    status: StudentDocumentStatus;
    rejectReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateStudentUserProfileInput {
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
}

export interface ChangeStudentPasswordInput {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
