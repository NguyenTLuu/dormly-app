import { axiosClient } from './axiosClient';

import type { ApiResponse } from '../types/api';
import type { CreateTransferRequest } from '../types/transfer';

export async function createTransferRequestApi(
    request: CreateTransferRequest
): Promise<void> {
    await axiosClient.post<ApiResponse<void>>('/api/transfer-request', request);
}
