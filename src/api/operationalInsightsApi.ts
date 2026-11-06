import { getManagerTickets, getManagerTransfers } from './managerRequestsApi';
import { getRoomManagementData } from './roomManagementApi';
import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/api';
import type {
    AnalyticsOperations,
    AnalyticsOverview,
    AnalyticsResidents,
    AuditLogPage,
    OperationalInsights,
} from '@/types/operationalInsights';

export async function getOperationalInsights(): Promise<OperationalInsights> {
    const [rooms, tickets, transfers] = await Promise.all([
        getRoomManagementData(),
        getManagerTickets(),
        getManagerTransfers(),
    ]);
    const [overview, residents, operations] = await Promise.allSettled([
        axiosClient.get<ApiResponse<AnalyticsOverview>>(
            '/api/analytics/overview'
        ),
        axiosClient.get<ApiResponse<AnalyticsResidents>>(
            '/api/analytics/residents'
        ),
        axiosClient.get<ApiResponse<AnalyticsOperations>>(
            '/api/analytics/operations'
        ),
    ]);
    return {
        rooms,
        tickets,
        transfers,
        overview:
            overview.status === 'fulfilled'
                ? overview.value.data.result
                : undefined,
        residents:
            residents.status === 'fulfilled'
                ? residents.value.data.result
                : undefined,
        operations:
            operations.status === 'fulfilled'
                ? operations.value.data.result
                : undefined,
    };
}

export async function getAuditLogPage(
    page: number,
    action?: string,
    entityType?: string,
    size = 20
): Promise<AuditLogPage> {
    const response = await axiosClient.get<ApiResponse<AuditLogPage>>(
        '/api/audit-logs',
        {
            params: {
                page,
                size,
                ...(action ? { action } : {}),
                ...(entityType ? { entityType } : {}),
            },
        }
    );
    return response.data.result;
}

export async function getAuditLogFilterOptions(): Promise<{
    actions: string[];
    entityTypes: string[];
}> {
    const actions = new Set<string>();
    const entityTypes = new Set<string>();
    const collect = (page: AuditLogPage) => {
        for (const entry of page.content) {
            if (entry.action) actions.add(entry.action);
            if (entry.entityType) entityTypes.add(entry.entityType);
        }
    };

    // The backend has no distinct-values endpoint. Read its unfiltered pages
    // so the selects include codes outside the currently visible log page.
    const first = await getAuditLogPage(0, undefined, undefined, 100);
    collect(first);
    for (let start = 1; start < first.totalPages; start += 4) {
        const indices = Array.from(
            { length: Math.min(4, first.totalPages - start) },
            (_, index) => start + index
        );
        const pages = await Promise.all(
            indices.map((page) =>
                getAuditLogPage(page, undefined, undefined, 100)
            )
        );
        pages.forEach(collect);
    }

    return {
        actions: [...actions].sort(),
        entityTypes: [...entityTypes].sort(),
    };
}
