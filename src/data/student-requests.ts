import { DormRoom, dormRooms } from './manager-management';
import { Priority } from './manager-requests';

export type StudentIssueType = 'Electric' | 'Water' | 'Internet' | 'Facility';
export type StudentRequestKind = 'issue' | 'complaint';

export interface StudentAttachment {
    id: string;
    name: string;
    size?: number;
    mimeType?: string;
    uri: string;
}

export interface StudentWorkRequestSubmission {
    id: string;
    kind: StudentRequestKind;
    issueType?: StudentIssueType;
    title: string;
    description: string;
    priority: Priority;
    attachments: StudentAttachment[];
    submittedAt: string;
}

export interface StudentTransferSubmission {
    id: string;
    requestedRoom: string;
    reason: string;
    submittedAt: string;
}

export const studentIssueTypes: StudentIssueType[] = [
    'Electric',
    'Water',
    'Internet',
    'Facility',
];

export const studentPriorityOptions: Priority[] = ['Low', 'Medium', 'Urgent'];
export const dormitoryHotline = '1900 6868';

export const studentWorkRequestSubmissions: StudentWorkRequestSubmission[] = [];
export const studentTransferSubmissions: StudentTransferSubmission[] = [];

export const availableTransferRooms: DormRoom[] = dormRooms
    .filter((room) => room.occupied < room.capacity)
    .sort(
        (first, second) =>
            first.block.localeCompare(second.block) ||
            first.floor.localeCompare(second.floor) ||
            first.code.localeCompare(second.code)
    );

export const submitStudentWorkRequest = (
    request: Omit<StudentWorkRequestSubmission, 'id' | 'submittedAt'>
) => {
    studentWorkRequestSubmissions.unshift({
        ...request,
        id: `STU-${request.kind.toUpperCase()}-${Date.now()}`,
        submittedAt: 'Just now',
    });
};

export const submitStudentTransferRequest = (
    request: Omit<StudentTransferSubmission, 'id' | 'submittedAt'>
) => {
    studentTransferSubmissions.unshift({
        ...request,
        id: `STU-TRANSFER-${Date.now()}`,
        submittedAt: 'Just now',
    });
};
