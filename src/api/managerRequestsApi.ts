import { axiosClient } from './axiosClient';
import { getAdminTickets } from './adminApi';

import type { ApiResponse } from '@/types/api';

export type ManagerTicketStatus =
    'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
export type ManagerTransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ManagerTicket {
    id: string;
    code: string;
    title: string;
    category: string;
    status: ManagerTicketStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    reporterName?: string | null;
    createdAt?: string | null;
}

export interface ManagerTransfer {
    id: string;
    userId?: string | null;
    fromRoomId?: string | null;
    toRoomId?: string | null;
    reason: string;
    status: ManagerTransferStatus;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewNote?: string | null;
    createdAt?: string | null;
}

export async function getManagerTransfer(id: string): Promise<ManagerTransfer> {
    const response = await axiosClient.get<ApiResponse<ManagerTransfer>>(
        `/api/transfer-request/${id}`
    );
    return response.data.result;
}

export async function reviewManagerTransfer(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNote: string
): Promise<ManagerTransfer> {
    const response = await axiosClient.patch<ApiResponse<ManagerTransfer>>(
        `/api/transfer-request/${id}/status`,
        { status, reviewNote: reviewNote || null }
    );
    return response.data.result;
}

export async function getManagerTickets(): Promise<ManagerTicket[]> {
    return getAdminTickets();
}

export async function getManagerTransfers(): Promise<ManagerTransfer[]> {
    const response = await axiosClient.get<ApiResponse<ManagerTransfer[]>>(
        '/api/transfer-request'
    );
    return response.data.result;
}
