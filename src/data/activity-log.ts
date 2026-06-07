export type ActivityActorRole = 'Manager' | 'Student' | 'System';

export interface ActivityLogItem {
    id: string;
    action: string;
    detail: string;
    actorName: string;
    actorRole: ActivityActorRole;
    time: string;
    icon:
        | 'ticket-outline'
        | 'git-compare-outline'
        | 'notifications-outline'
        | 'business-outline'
        | 'person-outline'
        | 'settings-outline';
    color: string;
}

export const activityLog: ActivityLogItem[] = [
    {
        id: 'activity-1',
        action: 'Updated room information',
        detail: 'Changed Room A102 capacity and amenities.',
        actorName: 'Nguyen Minh Manager',
        actorRole: 'Manager',
        time: '07 Jun 2026, 09:45',
        icon: 'business-outline',
        color: '#2563EB',
    },
    {
        id: 'activity-2',
        action: 'Changed ticket progress',
        detail: 'Issue INC-1024 moved to In Progress.',
        actorName: 'Nguyen Minh Manager',
        actorRole: 'Manager',
        time: '07 Jun 2026, 09:20',
        icon: 'git-compare-outline',
        color: '#7C3AED',
    },
    {
        id: 'activity-3',
        action: 'Submitted issue ticket',
        detail: 'Reported water leakage in Room C102.',
        actorName: 'Tran Phuoc',
        actorRole: 'Student',
        time: '07 Jun 2026, 08:50',
        icon: 'ticket-outline',
        color: '#F97316',
    },
    {
        id: 'activity-4',
        action: 'Sent resident notification',
        detail: 'Monthly room inspection sent to all residents.',
        actorName: 'Nguyen Minh Manager',
        actorRole: 'Manager',
        time: '06 Jun 2026, 14:30',
        icon: 'notifications-outline',
        color: '#0EA5E9',
    },
    {
        id: 'activity-5',
        action: 'Approved account request',
        detail: 'Student account ACC-2034 was approved.',
        actorName: 'Dormly System',
        actorRole: 'System',
        time: '06 Jun 2026, 13:10',
        icon: 'settings-outline',
        color: '#16A34A',
    },
    {
        id: 'activity-6',
        action: 'Updated display name',
        detail: 'Manager profile information was updated.',
        actorName: 'Nguyen Minh Manager',
        actorRole: 'Manager',
        time: '05 Jun 2026, 17:15',
        icon: 'person-outline',
        color: '#DB2777',
    },
];

export const addActivityLog = (item: Omit<ActivityLogItem, 'id'>) => {
    activityLog.unshift({ ...item, id: `activity-${Date.now()}` });
};
