export type TicketCategory =
    | 'MAINTENANCE'
    | 'FACILITY'
    | 'ROOMMATE'
    | 'SECURITY'
    | 'BILLING'
    | 'OTHER';

export interface TicketAttachment {
    id: string;
    name: string;
    size?: number;
    mimeType?: string | null;
    uri: string;
}

export interface CreateTicketRequest {
    category: TicketCategory;
    title: string;
    description: string;
    buildingNodeId?: string;
    files: TicketAttachment[];
}

export interface TicketDetail {
    id: string;
    code: string;
    category: TicketCategory;
    title: string;
    description: string;
    status: string;
    priority: string;
}
