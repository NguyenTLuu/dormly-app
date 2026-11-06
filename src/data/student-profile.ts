export interface UploadedStudentDocument {
    id: 'citizen-id-front' | 'citizen-id-back' | 'temporary-residence';
    title: string;
    description: string;
    status: 'Uploaded' | 'Missing';
    fileName?: string;
    uri?: string;
}

export const studentProfileDocuments: UploadedStudentDocument[] = [
    {
        id: 'citizen-id-front',
        title: 'Citizen ID — Front',
        description: 'Clear image or PDF of the front side',
        status: 'Missing',
    },
    {
        id: 'citizen-id-back',
        title: 'Citizen ID — Back',
        description: 'Clear image or PDF of the back side',
        status: 'Missing',
    },
    {
        id: 'temporary-residence',
        title: 'Temporary Residence',
        description: 'Temporary residence confirmation document',
        status: 'Missing',
    },
];
