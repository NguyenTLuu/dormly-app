export type InboxPriority = 'Normal' | 'Important' | 'Emergency';

export function parseNotificationPriority(
    value: unknown
): InboxPriority | undefined {
    if (typeof value !== 'string') return undefined;
    switch (value.trim().toUpperCase()) {
        case 'NORMAL':
            return 'Normal';
        case 'IMPORTANT':
            return 'Important';
        case 'EMERGENCY':
            return 'Emergency';
        default:
            return undefined;
    }
}

export function notificationPalette(priority?: InboxPriority) {
    switch (priority) {
        case 'Normal':
            return {
                background: '#EFF6FF',
                border: '#BFDBFE',
                badge: '#DBEAFE',
                color: '#1D4ED8',
                icon: 'notifications-outline' as const,
            };
        case 'Important':
            return {
                background: '#FFFBEB',
                border: '#FDE68A',
                badge: '#FEF3C7',
                color: '#92400E',
                icon: 'alert-circle-outline' as const,
            };
        case 'Emergency':
            return {
                background: '#FEF2F2',
                border: '#FECACA',
                badge: '#FEE2E2',
                color: '#B91C1C',
                icon: 'warning-outline' as const,
            };
        default:
            return {
                background: '#FFFFFF',
                border: '#E2E8F0',
                badge: '#F1F5F9',
                color: '#475569',
                icon: 'notifications-outline' as const,
            };
    }
}

export interface AppInboxItem {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    priority?: InboxPriority;
}

export function parseInboxEvent(value: unknown): AppInboxItem | null {
    if (!value || typeof value !== 'object') return null;
    const row = value as Record<string, unknown>;
    const time = row.createdAt ?? row.timestamp;
    const metadata =
        row.metadata && typeof row.metadata === 'object'
            ? (row.metadata as Record<string, unknown>)
            : undefined;
    const priority =
        parseNotificationPriority(row.priority) ??
        parseNotificationPriority(metadata?.priority);
    if (
        typeof row.eventId !== 'string' ||
        !row.eventId ||
        row.channel !== 'WEBSOCKET' ||
        typeof row.message !== 'string' ||
        typeof time !== 'string' ||
        !Number.isFinite(Date.parse(time))
    )
        return null;
    return {
        id: row.eventId,
        title:
            typeof row.subject === 'string' && row.subject
                ? row.subject
                : 'Notification',
        message: row.message,
        createdAt: time,
        ...(priority ? { priority } : {}),
    };
}

export function mergeInboxItems(...groups: AppInboxItem[][]): AppInboxItem[] {
    const unique = new Map<string, AppInboxItem>();
    groups.forEach((group) =>
        group.forEach((item) => {
            const priority = item.priority ?? unique.get(item.id)?.priority;
            unique.set(item.id, { ...item, ...(priority ? { priority } : {}) });
        })
    );
    return [...unique.values()].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
}

export function personalInboxItems(
    rows: unknown[],
    email: string
): AppInboxItem[] {
    return rows
        .filter(
            (row) =>
                row &&
                typeof row === 'object' &&
                typeof (row as Record<string, unknown>).recipient ===
                    'string' &&
                String(
                    (row as Record<string, unknown>).recipient
                ).toLowerCase() === email.toLowerCase()
        )
        .map(parseInboxEvent)
        .filter((item): item is AppInboxItem => item !== null);
}
