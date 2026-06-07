import { ManagerNotification } from './manager-dashboard-actions';

export const studentNotifications: ManagerNotification[] = [
    {
        id: 'NTF-STU-01',
        title: 'Water maintenance notice',
        message:
            'Water supply in Block B will be paused for maintenance from 09:00 to 11:00.',
        audience: 'Block B residents',
        audienceScope: 'Selected blocks',
        audienceTargets: ['Block B'],
        priority: 'Important',
        status: 'Sent',
        createdAt: '07 Jun 2026, 08:15',
    },
    {
        id: 'NTF-STU-02',
        title: 'Monthly room inspection',
        message:
            'Room inspections begin next Monday. Please keep shared spaces accessible.',
        audience: 'All residents',
        audienceScope: 'All residents',
        audienceTargets: [],
        priority: 'Normal',
        status: 'Sent',
        createdAt: '06 Jun 2026, 14:30',
    },
    {
        id: 'NTF-STU-03',
        title: 'Emergency fire drill',
        message:
            'A mandatory fire drill will begin at 16:00. Follow staff instructions and use the nearest safe exit.',
        audience: 'All residents',
        audienceScope: 'All residents',
        audienceTargets: [],
        priority: 'Emergency',
        status: 'Sent',
        createdAt: '05 Jun 2026, 10:05',
    },
    {
        id: 'NTF-STU-04',
        title: 'Quiet hour reminder',
        message:
            'Please observe quiet hours from 22:00 to 06:00 during examination week.',
        audience: 'Block C residents',
        audienceScope: 'Selected blocks',
        audienceTargets: ['Block C'],
        priority: 'Important',
        status: 'Sent',
        createdAt: '04 Jun 2026, 19:00',
    },
];

export const getLatestStudentNotifications = (limit = 3) =>
    studentNotifications.slice(0, limit);

export const publishStudentNotification = (
    notification: ManagerNotification
) => {
    const sentNotification: ManagerNotification = {
        ...notification,
        status: 'Sent',
        createdAt: 'Just now',
    };
    const existingIndex = studentNotifications.findIndex(
        (item) => item.id === notification.id
    );

    if (existingIndex >= 0) {
        studentNotifications[existingIndex] = sentNotification;
        return;
    }

    studentNotifications.unshift(sentNotification);
};
