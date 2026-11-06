import { axiosClient } from './axiosClient';

const DOCUMENT_PATH = /^\/uploads\/user-documents\/[A-Za-z0-9._-]+$/;

export async function getResidentDocumentImage(
    fileUrl: string
): Promise<string> {
    if (!DOCUMENT_PATH.test(fileUrl)) {
        throw new Error('Invalid resident document file path');
    }

    const response = await axiosClient.get<Blob>(fileUrl, {
        responseType: 'blob',
    });
    const contentType = String(response.headers['content-type'] || '').split(
        ';'
    )[0];
    if (!contentType.startsWith('image/')) {
        throw new Error('This document is not an image');
    }

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Could not read resident document'));
            }
        };
        reader.onerror = () =>
            reject(new Error('Could not read resident document'));
        reader.readAsDataURL(response.data);
    });
}
