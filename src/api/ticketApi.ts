import { axiosClient } from './axiosClient';

import type { ApiResponse } from '../types/api';
import type {
    CreateTicketRequest,
    TicketAttachment,
    TicketDetail,
} from '../types/ticket';

export async function createTicketApi(
    request: CreateTicketRequest
): Promise<TicketDetail> {
    const formData = new FormData();
    const { files, ...data } = request;

    formData.append('data', JSON.stringify(data));
    files.forEach((file) => formData.append('files', toFormDataFile(file)));

    const response = await axiosClient.post<ApiResponse<TicketDetail>>(
        '/api/users/me/tickets',
        formData
    );

    return response.data.result;
}

function toFormDataFile(file: TicketAttachment): Blob {
    return {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob;
}
