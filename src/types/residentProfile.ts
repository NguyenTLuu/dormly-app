import type { ResidentDocument } from './managerResident';

export interface ResidentAcademicProfile {
    id: string;
    studentCode?: string | null;
    major?: string | null;
    identityNumber?: string | null;
    startYear?: number | null;
    endYear?: number | null;
    sleepTime?: string | null;
    wakeUpTime?: string | null;
    roommatePreference?: string | null;
    traits?: string[] | null;
    updatedAt?: string | null;
}

export interface ResidentProfileData {
    academic: ResidentAcademicProfile | null;
    documents: ResidentDocument[];
}

export interface ResidentContactInput {
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
}
