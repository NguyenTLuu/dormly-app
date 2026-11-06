import { axiosClient } from './axiosClient';

import type { NotificationPriority } from '@/data/manager-dashboard-actions';

export interface PublishNotificationInput {
    recipients: string[];
    channels: ('EMAIL' | 'WEBSOCKET')[];
    audience: string;
    title: string;
    message: string;
    priority: NotificationPriority;
}

export async function publishNotification(input: PublishNotificationInput) {
    const failed: string[] = [];
    const multi = input.channels.length > 1;
    const recipients = [
        ...new Map(
            input.recipients.map((email) => [email.toLowerCase(), email])
        ).values(),
    ];

    // The backend accepts one email per request. Bound concurrent requests for large audiences.
    for (let index = 0; index < recipients.length; index += 5) {
        const batch = recipients.slice(index, index + 5);
        const results = await Promise.allSettled(
            batch.map(async (recipient) => {
                const { data } = await axiosClient.post<{
                    count: string | number;
                }>(
                    multi ? '/api/notifications/multi' : '/api/notifications',
                    {
                        recipient,
                        subject: input.title,
                        message: input.message,
                        channel: input.channels[0],
                        metadata: {
                            priority: input.priority,
                            audience: input.audience,
                        },
                    },
                    multi
                        ? { params: { channels: input.channels.join(',') } }
                        : undefined
                );
                return Number(data.count) === 1;
            })
        );
        results.forEach((result, offset) => {
            if (result.status === 'rejected' || !result.value)
                failed.push(batch[offset]);
        });
    }
    return { accepted: recipients.length - failed.length, failed };
}

export interface NotificationLog {
    id: number;
    eventId: string;
    recipient: string;
    channel: string;
    subject?: string | null;
    message?: string | null;
    priority?: string | null;
    metadata?: Record<string, string> | null;
    status: string;
    errorMessage?: string | null;
    retryCount: number;
    sourceService: string;
    createdAt: string;
    processedAt?: string | null;
}

export interface NotificationLogFilters {
    recipient?: string;
    channel?: string;
    status?: string;
}

export async function getNotificationLogs(
    filters: NotificationLogFilters,
    page: number
) {
    const response = await axiosClient.get<{
        content: NotificationLog[];
        number: number;
        last: boolean;
        totalElements: number;
    }>('/api/notifications/logs', {
        params: { ...filters, page, size: 20 },
    });
    return response.data;
}

export async function getNotificationLog(
    eventId: string
): Promise<NotificationLog> {
    const response = await axiosClient.get<NotificationLog>(
        '/api/notifications/logs/' + encodeURIComponent(eventId)
    );
    return response.data;
}
