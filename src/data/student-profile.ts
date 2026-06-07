export interface UploadedStudentDocument {
    id: 'citizen-id' | 'temporary-residence';
    title: string;
    description: string;
    status: 'Uploaded' | 'Missing';
    fileName?: string;
    uri?: string;
}

export const studentProfileDocuments: UploadedStudentDocument[] = [
    {
        id: 'citizen-id',
        title: 'Citizen ID',
        description: 'Front/back image or a single PDF document',
        status: 'Uploaded',
        fileName: 'citizen-id-2231200123.jpg',
        uri: 'mock://documents/citizen-id/2231200123.jpg',
    },
    {
        id: 'temporary-residence',
        title: 'Temporary Residence',
        description: 'Temporary residence confirmation document',
        status: 'Uploaded',
        fileName: 'temporary-residence-2231200123.jpg',
        uri: 'mock://documents/temporary-residence/2231200123.jpg',
    },
];
