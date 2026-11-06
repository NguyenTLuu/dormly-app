import { axiosClient } from './axiosClient';
import { Platform } from 'react-native';

import type { ApiResponse } from '../types/api';
import type { BuildingNode } from '../types/room';
import type {
    AdminAnnouncement,
    AdminDashboardData,
    AdminInvoice,
    AdminRoomAssignment,
    AdminTicket,
    AdminTicketDetail,
    AdminTicketPriority,
    AdminTicketStatus,
    AdminUser,
    FeeCategory,
} from '../types/admin';

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    last: boolean;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
    const [users, invoices, announcements, openTickets, inProgressTickets] =
        await Promise.all([
            getAdminUsers(),
            getAdminInvoices(),
            getAdminAnnouncements(),
            axiosClient.get<ApiResponse<PageResponse<AdminTicket>>>(
                '/api/tickets',
                {
                    params: { status: 'OPEN', page: 0, size: 1 },
                }
            ),
            axiosClient.get<ApiResponse<PageResponse<AdminTicket>>>(
                '/api/tickets',
                {
                    params: { status: 'IN_PROGRESS', page: 0, size: 1 },
                }
            ),
        ]);

    return {
        users: users.length,
        activeUsers: users.filter((user) => user.isActive).length,
        openTickets:
            openTickets.data.result.totalElements +
            inProgressTickets.data.result.totalElements,
        invoices: invoices.length,
        unpaidInvoices: invoices.filter((invoice) => invoice.status !== 'PAID')
            .length,
        announcements: announcements.length,
    };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
    const response =
        await axiosClient.get<ApiResponse<AdminUser[]>>('/api/users');
    return response.data.result;
}

export async function toggleAdminUserStatus(id: string): Promise<AdminUser> {
    const response = await axiosClient.patch<ApiResponse<AdminUser>>(
        `/api/users/toggle/${id}`
    );
    return response.data.result;
}

export async function deleteAdminUser(id: string): Promise<void> {
    await axiosClient.delete<ApiResponse<void>>(`/api/users/${id}`);
}

export async function getAdminTickets(): Promise<AdminTicket[]> {
    const tickets: AdminTicket[] = [];
    for (let page = 0; ; page += 1) {
        const response = await axiosClient.get<
            ApiResponse<PageResponse<AdminTicket>>
        >('/api/tickets', { params: { page, size: 100 } });
        const result = response.data.result;
        tickets.push(...result.content);
        if (
            result.last ||
            result.content.length === 0 ||
            tickets.length >= result.totalElements
        )
            return tickets;
    }
}

export async function updateTicketDueDate(
    id: string,
    dueDate: string | null
): Promise<void> {
    await axiosClient.patch(`/api/tickets/${id}/due-date`, { dueDate });
}

export async function updateTicketAssignees(
    id: string,
    userIds: string[]
): Promise<void> {
    await axiosClient.put(`/api/tickets/${id}/assignees`, { userIds });
}

export async function updateAdminTicketStatus(
    id: string,
    status: AdminTicketStatus,
    resolutionNote?: string
): Promise<void> {
    await axiosClient.patch(`/api/tickets/${id}/status`, {
        status,
        resolutionNote,
    });
}

export async function updateAdminTicketPriority(
    id: string,
    priority: AdminTicketPriority
): Promise<void> {
    await axiosClient.patch(`/api/tickets/${id}/priority`, { priority });
}

export async function getAdminTicketDetail(
    id: string
): Promise<AdminTicketDetail> {
    const response = await axiosClient.get<ApiResponse<AdminTicketDetail>>(
        `/api/tickets/${id}`
    );
    return response.data.result;
}

export async function addAdminTicketComment(
    id: string,
    body: string,
    internal: boolean,
    files: { uri: string; name: string; mimeType?: string | null }[] = []
): Promise<void> {
    const formData = new FormData();
    formData.append('data', JSON.stringify({ body, internal }));
    for (const file of files) {
        if (Platform.OS === 'web') {
            const response = await fetch(file.uri);
            formData.append('files', await response.blob(), file.name);
        } else {
            formData.append('files', { uri: file.uri, name: file.name, type: file.mimeType || 'application/octet-stream' } as unknown as Blob);
        }
    }
    await axiosClient.post(`/api/tickets/${id}/comments`, formData);
}

export async function getAdminInvoices(): Promise<AdminInvoice[]> {
    const response =
        await axiosClient.get<ApiResponse<AdminInvoice[]>>('/api/invoices');
    return response.data.result;
}

export async function getInvoiceDetail(id: string): Promise<AdminInvoice> {
    const response = await axiosClient.get<ApiResponse<AdminInvoice>>(
        `/api/invoices/${id}`
    );
    return response.data.result;
}

export async function recordInvoicePayment(id: string): Promise<AdminInvoice> {
    const response = await axiosClient.post<ApiResponse<AdminInvoice>>(
        `/api/invoices/${id}/pay`
    );
    return response.data.result;
}

export async function getInvoiceAssignmentOptions(): Promise<
    AdminRoomAssignment[]
> {
    const [assignments, users, nodes] = await Promise.all([
        getAdminRoomAssignments(),
        getAdminUsers(),
        axiosClient.get<ApiResponse<BuildingNode[]>>('/api/building-nodes'),
    ]);
    const usersById = new Map(users.map((user) => [user.id, user]));
    const nodesById = new Map(nodes.data.result.map((node) => [node.id, node]));
    return assignments.map((assignment) => ({
        ...assignment,
        residentName:
            usersById.get(assignment.userId)?.fullName || assignment.userId,
        roomName:
            nodesById.get(assignment.roomNodeId)?.name || assignment.roomNodeId,
    }));
}

export async function getAdminRoomAssignments(): Promise<
    AdminRoomAssignment[]
> {
    const response = await axiosClient.get<ApiResponse<AdminRoomAssignment[]>>(
        '/api/room-assignments'
    );
    return response.data.result;
}

export async function createAdminInvoice(input: {
    roomAssignmentId: string;
    feeCategory: FeeCategory;
    amount: number;
    month: string;
    notes?: string;
}): Promise<void> {
    await axiosClient.post('/api/invoices', input);
}

export async function getAdminAnnouncements(): Promise<AdminAnnouncement[]> {
    const response =
        await axiosClient.get<ApiResponse<AdminAnnouncement[]>>(
            '/api/announcements'
        );
    return response.data.result;
}

export async function createAdminAnnouncement(input: {
    title: string;
    content: string;
    priority: string;
    author: string;
}): Promise<void> {
    await axiosClient.post('/api/announcements', input);
}

export async function deleteAdminAnnouncement(id: string): Promise<void> {
    await axiosClient.delete(`/api/announcements/${id}`);
}
