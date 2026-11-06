import type { ManagerTicket, ManagerTransfer } from '@/api/managerRequestsApi';
import type { RoomManagementData } from './roomManagement';

export interface AnalyticsOverview {
    totalStudents: number;
    activeTickets: number;
    ticketVolume: { month: string; created: number; resolved: number }[];
}

export interface AnalyticsResidents {
    byBlock: { block: string; students: number }[];
    registrationTrends: { month: string; count: number }[];
}

export interface AnalyticsOperations {
    statusDistribution: { name: string; value: number }[];
    resolutionTrends: { month: string; created: number; resolved: number }[];
}

export interface OperationalInsights {
    rooms: RoomManagementData;
    tickets: ManagerTicket[];
    transfers: ManagerTransfer[];
    overview?: AnalyticsOverview;
    residents?: AnalyticsResidents;
    operations?: AnalyticsOperations;
}

export interface AuditLogEntry {
    id: string;
    userId?: string | null;
    userEmail?: string | null;
    userFullName?: string | null;
    action: string;
    entityType?: string | null;
    entityId?: string | null;
    createdAt: string;
}

export interface AuditLogPage {
    content: AuditLogEntry[];
    number: number;
    totalPages: number;
    totalElements: number;
    last: boolean;
}
