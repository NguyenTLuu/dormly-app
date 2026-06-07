export type NotificationStatus = 'Draft' | 'Scheduled' | 'Sent';
export type NotificationPriority = 'Normal' | 'Important' | 'Emergency';
export type NotificationAudienceScope =
    | 'All residents'
    | 'Selected blocks'
    | 'Selected floors'
    | 'Selected rooms';
export type AccountRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface NotificationDraftInput {
    title: string;
    message: string;
    priority: NotificationPriority;
    audienceScope: NotificationAudienceScope;
    audienceTargets: string[];
}

export interface ManagerNotification {
    id: string;
    title: string;
    message: string;
    audience: string;
    audienceScope: NotificationAudienceScope;
    audienceTargets: string[];
    priority: NotificationPriority;
    status: NotificationStatus;
    createdAt: string;
}

export interface AccountRequest {
    id: string;
    name: string;
    studentId: string;
    email: string;
    major: string;
    submittedAt: string;
    status: AccountRequestStatus;
    rejectionReason?: string;
}

export const managerNotifications: ManagerNotification[] = [
    {
        id: 'NTF-1008',
        title: 'Water maintenance notice',
        message:
            'Water supply in Block B will be paused for maintenance from 09:00 to 11:00.',
        audience: 'Block B residents',
        audienceScope: 'Selected blocks',
        audienceTargets: ['Block B'],
        priority: 'Important',
        status: 'Scheduled',
        createdAt: '06 Jun 2026, 08:15',
    },
    {
        id: 'NTF-1007',
        title: 'Monthly room inspection',
        message:
            'Room inspections begin next Monday. Please keep shared spaces accessible.',
        audience: 'All residents',
        audienceScope: 'All residents',
        audienceTargets: [],
        priority: 'Normal',
        status: 'Sent',
        createdAt: '05 Jun 2026, 14:30',
    },
    {
        id: 'NTF-1006',
        title: 'Quiet hour reminder',
        message:
            'Please observe quiet hours from 22:00 to 06:00 during examination week.',
        audience: 'All residents',
        audienceScope: 'All residents',
        audienceTargets: [],
        priority: 'Emergency',
        status: 'Draft',
        createdAt: '05 Jun 2026, 10:05',
    },
];

export const notificationAudienceOptions: Record<
    Exclude<NotificationAudienceScope, 'All residents'>,
    string[]
> = {
    'Selected blocks': ['Block A', 'Block B', 'Block C'],
    'Selected floors': [
        'Block A - Floor 1',
        'Block A - Floor 2',
        'Block A - Floor 3',
        'Block B - Floor 1',
        'Block B - Floor 2',
        'Block B - Floor 3',
        'Block C - Floor 1',
        'Block C - Floor 2',
    ],
    'Selected rooms': [
        'A101',
        'A102',
        'A201',
        'A202',
        'B101',
        'B102',
        'B201',
        'B202',
        'C101',
        'C102',
        'C201',
        'C202',
    ],
};

export const newAccountRequests: AccountRequest[] = [
    {
        id: 'ACC-2041',
        name: 'Vo Minh Quan',
        studentId: '2231201512',
        email: 'quan.vm@fpt.edu.vn',
        major: 'Software Engineering',
        submittedAt: '06 Jun 2026, 09:20',
        status: 'Pending',
    },
    {
        id: 'ACC-2039',
        name: 'Nguyen Thanh Truc',
        studentId: '2231201468',
        email: 'truc.nt@fpt.edu.vn',
        major: 'Digital Marketing',
        submittedAt: '05 Jun 2026, 18:45',
        status: 'Pending',
    },
    {
        id: 'ACC-2034',
        name: 'Le Gia Bao',
        studentId: '2231201390',
        email: 'bao.lg@fpt.edu.vn',
        major: 'Artificial Intelligence',
        submittedAt: '04 Jun 2026, 13:10',
        status: 'Approved',
    },
    {
        id: 'ACC-2028',
        name: 'Tran Yen Nhi',
        studentId: '2231201274',
        email: 'nhi.ty@fpt.edu.vn',
        major: 'Graphic Design',
        submittedAt: '03 Jun 2026, 16:40',
        status: 'Rejected',
        rejectionReason: 'Student ID document is unreadable.',
    },
];

export const dashboardActionSummary = {
    draftNotifications: managerNotifications.filter(
        (notification) => notification.status === 'Draft'
    ).length,
    scheduledNotifications: managerNotifications.filter(
        (notification) => notification.status === 'Scheduled'
    ).length,
    pendingAccounts: newAccountRequests.filter(
        (request) => request.status === 'Pending'
    ).length,
};
