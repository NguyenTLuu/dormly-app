import { NotificationPriority } from './manager-dashboard-actions';

export interface ManagerAppNotification {
    id: string;
    title: string;
    message: string;
    priority: NotificationPriority;
    source: 'Request' | 'Account' | 'Room' | 'System';
    createdAt: string;
    unread: boolean;
}

export const managerAppNotifications: ManagerAppNotification[] = [
    {
        id: 'MAN-NOT-01',
        title: 'New emergency issue',
        message:
            'A critical water issue was reported for Room B101 and requires review.',
        priority: 'Emergency',
        source: 'Request',
        createdAt: '07 Jun 2026, 10:15',
        unread: true,
    },
    {
        id: 'MAN-NOT-02',
        title: 'New account request',
        message:
            'Vo Minh Quan submitted a student account registration request.',
        priority: 'Important',
        source: 'Account',
        createdAt: '07 Jun 2026, 09:20',
        unread: true,
    },
    {
        id: 'MAN-NOT-03',
        title: 'Room capacity updated',
        message: 'Room A102 information was updated by Nguyen Minh Manager.',
        priority: 'Normal',
        source: 'Room',
        createdAt: '07 Jun 2026, 08:45',
        unread: false,
    },
    {
        id: 'MAN-NOT-04',
        title: 'Scheduled notification ready',
        message:
            'Water maintenance notice is ready for its scheduled audience.',
        priority: 'Important',
        source: 'System',
        createdAt: '06 Jun 2026, 16:00',
        unread: false,
    },
    {
        id: 'MAN-NOT-05',
        title: 'Daily summary generated',
        message: 'The latest room occupancy and request summary is available.',
        priority: 'Normal',
        source: 'System',
        createdAt: '06 Jun 2026, 08:00',
        unread: false,
    },
];

export const managerUnreadNotificationCount = () =>
    managerAppNotifications.filter((notification) => notification.unread)
        .length;
