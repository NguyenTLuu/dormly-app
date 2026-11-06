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

export const studentIssueTypes: StudentIssueType[] = [
    'Electric',
    'Water',
    'Internet',
    'Facility',
];

export const studentPriorityOptions: Priority[] = ['Low', 'Medium', 'Urgent'];
export const dormitoryHotline = '1900 6868';

export const studentWorkRequestSubmissions: StudentWorkRequestSubmission[] = [];
export const submitStudentWorkRequest = (
    request: Omit<StudentWorkRequestSubmission, 'id' | 'submittedAt'>
) => {
    studentWorkRequestSubmissions.unshift({
        ...request,
        id: `STU-${request.kind.toUpperCase()}-${Date.now()}`,
        submittedAt: 'Just now',
    });
};
