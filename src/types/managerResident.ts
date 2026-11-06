export type ResidentDocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ResidentUser {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    isActive: boolean;
    roles: string[];
    createdAt?: string | null;
}

export interface ResidentDocument {
    id: string;
    documentType: string;
    fileUrl: string;
    status: ResidentDocumentStatus;
    rejectReason?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface ResidentDocumentItem extends ResidentDocument {
    userId: string;
    residentName: string;
    residentEmail: string;
}
