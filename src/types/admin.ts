export type AdminTicketStatus =
    'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CLOSED';

export type AdminTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    isActive: boolean;
    roles: string[];
    gender?: string | null;
    dateOfBirth?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface AdminTicket {
    id: string;
    code: string;
    title: string;
    category: string;
    status: AdminTicketStatus;
    priority: AdminTicketPriority;
    dueDate?: string | null;
    reporterName?: string | null;
    createdAt?: string | null;
}

export interface AdminTicketAssignee {
    id: string;
    fullName: string;
    email: string;
}

export interface AdminTicketAttachment {
    id: string;
    originalFilename: string;
    contentType?: string | null;
    sizeBytes: number;
    url?: string | null;
    createdAt?: string | null;
}

export interface AdminTicketComment {
    attachments?: AdminTicketAttachment[];
    id: string;
    authorName: string;
    body: string;
    internal: boolean;
    createdAt?: string | null;
}

export interface AdminTicketDetail extends AdminTicket {
    description: string;
    buildingNodeName?: string | null;
    assignees: AdminTicketAssignee[];
    resolutionNote?: string | null;
    attachments: AdminTicketAttachment[];
    comments: AdminTicketComment[];
}

export interface AdminInvoice {
    id: string;
    roomAssignmentId: string;
    roomName?: string | null;
    blockName?: string | null;
    studentName?: string | null;
    feeCategory: FeeCategory;
    amount: number;
    status: string;
    month: string;
    dueDate?: string | null;
    notes?: string | null;
    paidAt?: string | null;
    paymentQrCodeUrl?: string | null;
}

export type FeeCategory =
    'ROOM_RENT' | 'ELECTRICITY' | 'WATER' | 'SERVICE' | 'OTHER';

export interface AdminAnnouncement {
    id: string;
    title: string;
    content: string;
    priority: string;
    author: string;
    createdAt?: string | null;
}

export interface AdminRoomAssignment {
    id: string;
    userId: string;
    roomNodeId: string;
    startDate: string;
    endDate?: string | null;
    residentName?: string;
    roomName?: string;
}

export interface AdminDashboardData {
    users: number;
    activeUsers: number;
    openTickets: number;
    invoices: number;
    unpaidInvoices: number;
    announcements: number;
}
