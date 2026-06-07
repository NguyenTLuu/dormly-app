export type RequestTab = 'issues' | 'complaints' | 'transfers';
export type WorkStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'Urgent';
export type AttachmentType = 'image' | 'video';
export type TransferDecision = 'Approved' | 'Denied';

export interface RequestAttachment {
    id: string;
    type: AttachmentType;
    title: string;
    uri: string;
}

export interface WorkRequest {
    id: string;
    title: string;
    category: string;
    block: string;
    floor: string;
    room: string;
    status: WorkStatus;
    priority: Priority;
    reportedBy: string;
    reportedAt: string;
    reportedTime: string;
    reporterAvatar: string;
    description: string;
    assignee?: string;
    note?: string;
    progress: string;
    rating?: number;
    attachments: RequestAttachment[];
}

export interface TransferRoomRequest {
    id: string;
    student: string;
    studentId: string;
    currentRoom: string;
    requestedRoom: string;
    block: string;
    floor: string;
    requestedBlock: string;
    requestedFloor: string;
    status: WorkStatus;
    submittedAt: string;
    submittedTime: string;
    reporterAvatar: string;
    reason: string;
    note?: string;
    decision?: TransferDecision;
    denialReason?: string;
}

export const statusTabs: WorkStatus[] = [
    'Pending',
    'In Progress',
    'Resolved',
];

export const blockOptions = ['All', 'Block A', 'Block B', 'Block C'];
export const floorsByBlock: Record<string, string[]> = {
    'Block A': ['All', 'Floor 1', 'Floor 2', 'Floor 3'],
    'Block B': ['All', 'Floor 1', 'Floor 2', 'Floor 3'],
    'Block C': ['All', 'Floor 1', 'Floor 2'],
};
export const priorityOptions = ['All', 'Urgent', 'Medium', 'Low'];
export const issueTypeOptions = [
    'All',
    'Electric',
    'Water',
    'Internet',
    'Facility',
];

export const handlerOptions = [
    'Unassigned',
    'Nguyen Minh',
    'Tran Bao',
    'Le Hoang',
    'Facility Team',
    'Security Team',
];

export const progressOptions = [
    'Pending',
    'In Progress',
    'Resolved',
];

export const issueRequests: WorkRequest[] = [
    {
        id: 'ISS-1042',
        title: 'Water leak near bathroom',
        category: 'Water',
        block: 'Block A',
        floor: 'Floor 1',
        room: 'A102',
        status: 'Pending',
        priority: 'Urgent',
        reportedBy: 'Nguyen Van A',
        reportedAt: '05 Jun 2026',
        reportedTime: '05 Jun 2026, 08:35',
        reporterAvatar: 'NA',
        description:
            'Water is leaking from the bathroom pipe and spreading to the room entrance.',
        progress: 'Pending',
        attachments: [
            {
                id: 'att-iss-1042-1',
                type: 'image',
                title: 'Leak photo',
                uri: 'mock://issues/ISS-1042/leak-photo.jpg',
            },
            {
                id: 'att-iss-1042-2',
                type: 'video',
                title: 'Leak video',
                uri: 'mock://issues/ISS-1042/leak-video.mp4',
            },
        ],
    },
    {
        id: 'ISS-1038',
        title: 'Internet outage',
        category: 'Internet',
        block: 'Block C',
        floor: 'Floor 1',
        room: 'C102',
        status: 'In Progress',
        priority: 'Medium',
        reportedBy: 'Pham Minh',
        reportedAt: '04 Jun 2026',
        reportedTime: '04 Jun 2026, 20:15',
        reporterAvatar: 'PM',
        description:
            'Room internet connection is unstable and disconnects every few minutes.',
        assignee: 'Facility Team',
        note: 'Network device inspection scheduled.',
        progress: 'In Progress',
        attachments: [
            {
                id: 'att-iss-1038-1',
                type: 'image',
                title: 'Router indicator',
                uri: 'mock://issues/ISS-1038/router.jpg',
            },
        ],
    },
    {
        id: 'ISS-1035',
        title: 'Broken desk chair',
        category: 'Facility',
        block: 'Block B',
        floor: 'Floor 2',
        room: 'B201',
        status: 'Resolved',
        priority: 'Low',
        reportedBy: 'Le Duc',
        reportedAt: '02 Jun 2026',
        reportedTime: '02 Jun 2026, 14:10',
        reporterAvatar: 'LD',
        description: 'One chair in the room is broken and cannot be used.',
        assignee: 'Tran Bao',
        note: 'Chair replaced.',
        progress: 'Resolved',
        rating: 5,
        attachments: [
            {
                id: 'att-iss-1035-1',
                type: 'image',
                title: 'Damaged chair',
                uri: 'mock://issues/ISS-1035/chair.jpg',
            },
        ],
    },
    {
        id: 'ISS-1031',
        title: 'Electrical outlet not working',
        category: 'Electric',
        block: 'Block B',
        floor: 'Floor 1',
        room: 'B101',
        status: 'Resolved',
        priority: 'Urgent',
        reportedBy: 'Tran Phuoc',
        reportedAt: '01 Jun 2026',
        reportedTime: '01 Jun 2026, 09:45',
        reporterAvatar: 'TP',
        description: 'The outlet near the study desk has no power.',
        assignee: 'Nguyen Minh',
        note: 'Outlet repaired and tested.',
        progress: 'Resolved',
        rating: 4,
        attachments: [],
    },
    {
        id: 'ISS-1029',
        title: 'Air conditioner dripping water',
        category: 'Facility',
        block: 'Block A',
        floor: 'Floor 3',
        room: 'A302',
        status: 'Pending',
        priority: 'Medium',
        reportedBy: 'Dang Khoa',
        reportedAt: '05 Jun 2026',
        reportedTime: '05 Jun 2026, 11:05',
        reporterAvatar: 'DK',
        description:
            'Air conditioner leaks water after running for more than one hour and wets the study area.',
        progress: 'Pending',
        attachments: [
            {
                id: 'att-iss-1029-1',
                type: 'image',
                title: 'AC leak photo',
                uri: 'mock://issues/ISS-1029/ac-leak.jpg',
            },
        ],
    },
    {
        id: 'ISS-1027',
        title: 'Ceiling light flickering',
        category: 'Electric',
        block: 'Block B',
        floor: 'Floor 3',
        room: 'B303',
        status: 'In Progress',
        priority: 'Low',
        reportedBy: 'Mai Anh',
        reportedAt: '05 Jun 2026',
        reportedTime: '05 Jun 2026, 07:20',
        reporterAvatar: 'MA',
        description:
            'The ceiling light flickers at night and makes it difficult to study.',
        assignee: 'Nguyen Minh',
        note: 'Replacement bulb prepared, waiting for room access.',
        progress: 'In Progress',
        attachments: [],
    },
    {
        id: 'ISS-1024',
        title: 'Main door lock stuck',
        category: 'Facility',
        block: 'Block C',
        floor: 'Floor 2',
        room: 'C204',
        status: 'Pending',
        priority: 'Urgent',
        reportedBy: 'Vo Thanh',
        reportedAt: '04 Jun 2026',
        reportedTime: '04 Jun 2026, 23:10',
        reporterAvatar: 'VT',
        description:
            'Students cannot lock the main room door securely from outside.',
        progress: 'Pending',
        attachments: [
            {
                id: 'att-iss-1024-1',
                type: 'video',
                title: 'Door lock video',
                uri: 'mock://issues/ISS-1024/door-lock.mp4',
            },
        ],
    },
    {
        id: 'ISS-1019',
        title: 'Bathroom exhaust fan broken',
        category: 'Facility',
        block: 'Block A',
        floor: 'Floor 2',
        room: 'A205',
        status: 'Resolved',
        priority: 'Medium',
        reportedBy: 'Bui Minh',
        reportedAt: '30 May 2026',
        reportedTime: '30 May 2026, 18:35',
        reporterAvatar: 'BM',
        description:
            'Bathroom exhaust fan stopped working and caused humidity inside the room.',
        assignee: 'Facility Team',
        note: 'Fan motor replaced and ventilation checked.',
        progress: 'Resolved',
        rating: 4,
        attachments: [],
    },
    {
        id: 'ISS-1014',
        title: 'Low water pressure',
        category: 'Water',
        block: 'Block C',
        floor: 'Floor 2',
        room: 'C202',
        status: 'In Progress',
        priority: 'Medium',
        reportedBy: 'Pham Gia',
        reportedAt: '03 Jun 2026',
        reportedTime: '03 Jun 2026, 06:45',
        reporterAvatar: 'PG',
        description:
            'Water pressure is weak during morning hours and affects multiple students in the room.',
        assignee: 'Facility Team',
        note: 'Checking shared water line with maintenance.',
        progress: 'In Progress',
        attachments: [
            {
                id: 'att-iss-1014-1',
                type: 'image',
                title: 'Water pressure evidence',
                uri: 'mock://issues/ISS-1014/water-pressure.jpg',
            },
        ],
    },
];

export const complaintRequests: WorkRequest[] = [
    {
        id: 'CMP-2204',
        title: 'Noise after quiet hours',
        category: 'Noise',
        block: 'Block A',
        floor: 'Floor 2',
        room: 'A205',
        status: 'Pending',
        priority: 'Medium',
        reportedBy: 'Hoang Linh',
        reportedAt: '05 Jun 2026',
        reportedTime: '05 Jun 2026, 22:40',
        reporterAvatar: 'HL',
        description:
            'Loud music and group conversation continued after quiet hours.',
        progress: 'Pending',
        attachments: [
            {
                id: 'att-cmp-2204-1',
                type: 'video',
                title: 'Noise recording',
                uri: 'mock://complaints/CMP-2204/noise.mp4',
            },
        ],
    },
    {
        id: 'CMP-2199',
        title: 'Security concern in hallway',
        category: 'Security',
        block: 'Block C',
        floor: 'Floor 1',
        room: 'C102',
        status: 'In Progress',
        priority: 'Urgent',
        reportedBy: 'Nguyen Van A',
        reportedAt: '03 Jun 2026',
        reportedTime: '03 Jun 2026, 19:05',
        reporterAvatar: 'NA',
        description:
            'Unknown visitor stayed near the hallway for a long time without registration.',
        assignee: 'Security Team',
        note: 'Checking entrance logs.',
        progress: 'In Progress',
        attachments: [
            {
                id: 'att-cmp-2199-1',
                type: 'image',
                title: 'Hallway snapshot',
                uri: 'mock://complaints/CMP-2199/hallway.jpg',
            },
        ],
    },
    {
        id: 'CMP-2194',
        title: 'Room conflict resolved',
        category: 'Order',
        block: 'Block B',
        floor: 'Floor 2',
        room: 'B202',
        status: 'Resolved',
        priority: 'Low',
        reportedBy: 'Tran Bao',
        reportedAt: '29 May 2026',
        reportedTime: '29 May 2026, 16:30',
        reporterAvatar: 'TB',
        description: 'Roommates reported schedule and cleanliness conflicts.',
        assignee: 'Le Hoang',
        note: 'Mediation completed with written agreement.',
        progress: 'Resolved',
        rating: 4,
        attachments: [],
    },
    {
        id: 'CMP-2188',
        title: 'Prohibited items report',
        category: 'Prohibited Items',
        block: 'Block A',
        floor: 'Floor 1',
        room: 'A101',
        status: 'Resolved',
        priority: 'Urgent',
        reportedBy: 'Anonymous',
        reportedAt: '26 May 2026',
        reportedTime: '26 May 2026, 21:20',
        reporterAvatar: 'AN',
        description: 'Student reported suspected prohibited items in room.',
        assignee: 'Security Team',
        note: 'Inspection completed. No further escalation required.',
        progress: 'Resolved',
        rating: 3,
        attachments: [
            {
                id: 'att-cmp-2188-1',
                type: 'image',
                title: 'Submitted evidence',
                uri: 'mock://complaints/CMP-2188/evidence.jpg',
            },
        ],
    },
    {
        id: 'CMP-2184',
        title: 'Repeated hallway shouting',
        category: 'Noise',
        block: 'Block B',
        floor: 'Floor 1',
        room: 'B104',
        status: 'Pending',
        priority: 'Low',
        reportedBy: 'Do Quyen',
        reportedAt: '05 Jun 2026',
        reportedTime: '05 Jun 2026, 12:15',
        reporterAvatar: 'DQ',
        description:
            'Students reported repeated shouting in the hallway during rest time.',
        progress: 'Pending',
        attachments: [],
    },
    {
        id: 'CMP-2181',
        title: 'Unregistered guest report',
        category: 'Security',
        block: 'Block A',
        floor: 'Floor 3',
        room: 'A301',
        status: 'In Progress',
        priority: 'Urgent',
        reportedBy: 'Tran Nam',
        reportedAt: '04 Jun 2026',
        reportedTime: '04 Jun 2026, 21:55',
        reporterAvatar: 'TN',
        description:
            'Resident reported an unregistered guest entering the floor after visitor hours.',
        assignee: 'Security Team',
        note: 'Security is checking camera logs and visitor records.',
        progress: 'In Progress',
        attachments: [
            {
                id: 'att-cmp-2181-1',
                type: 'image',
                title: 'Entrance snapshot',
                uri: 'mock://complaints/CMP-2181/entrance.jpg',
            },
        ],
    },
    {
        id: 'CMP-2178',
        title: 'Common area cleanliness complaint',
        category: 'Order',
        block: 'Block C',
        floor: 'Floor 2',
        room: 'C203',
        status: 'Pending',
        priority: 'Medium',
        reportedBy: 'Ly An',
        reportedAt: '04 Jun 2026',
        reportedTime: '04 Jun 2026, 09:25',
        reporterAvatar: 'LA',
        description:
            'Shared hallway area has trash left overnight several days in a row.',
        progress: 'Pending',
        attachments: [
            {
                id: 'att-cmp-2178-1',
                type: 'image',
                title: 'Hallway trash photo',
                uri: 'mock://complaints/CMP-2178/trash.jpg',
            },
        ],
    },
    {
        id: 'CMP-2171',
        title: 'Quiet hour violation resolved',
        category: 'Noise',
        block: 'Block B',
        floor: 'Floor 3',
        room: 'B302',
        status: 'Resolved',
        priority: 'Medium',
        reportedBy: 'Ngoc Han',
        reportedAt: '28 May 2026',
        reportedTime: '28 May 2026, 23:05',
        reporterAvatar: 'NH',
        description:
            'Complaint about repeated loud calls after quiet hours was resolved after warning.',
        assignee: 'Le Hoang',
        note: 'Warning issued and follow-up completed.',
        progress: 'Resolved',
        rating: 5,
        attachments: [],
    },
    {
        id: 'CMP-2167',
        title: 'Suspicious package concern',
        category: 'Security',
        block: 'Block C',
        floor: 'Floor 1',
        room: 'C103',
        status: 'Resolved',
        priority: 'Urgent',
        reportedBy: 'Pham Minh',
        reportedAt: '27 May 2026',
        reportedTime: '27 May 2026, 17:40',
        reporterAvatar: 'PM',
        description:
            'Student reported an unattended package near the stairway entrance.',
        assignee: 'Security Team',
        note: 'Package owner identified, no violation found.',
        progress: 'Resolved',
        rating: 4,
        attachments: [
            {
                id: 'att-cmp-2167-1',
                type: 'image',
                title: 'Package location',
                uri: 'mock://complaints/CMP-2167/package.jpg',
            },
        ],
    },
];

export const transferRoomRequests: TransferRoomRequest[] = [
    {
        id: 'TR-3102',
        student: 'Nguyen Van A',
        studentId: '2231200123',
        currentRoom: 'A102',
        requestedRoom: 'B201',
        block: 'Block A',
        floor: 'Floor 1',
        requestedBlock: 'Block B',
        requestedFloor: 'Floor 2',
        status: 'Pending',
        submittedAt: '05 Jun 2026',
        submittedTime: '05 Jun 2026, 10:25',
        reporterAvatar: 'NA',
        reason: 'Move closer to classmates for group study.',
    },
    {
        id: 'TR-3098',
        student: 'Tran Phuoc',
        studentId: '2231200456',
        currentRoom: 'C102',
        requestedRoom: 'A201',
        block: 'Block C',
        floor: 'Floor 1',
        requestedBlock: 'Block A',
        requestedFloor: 'Floor 2',
        status: 'In Progress',
        submittedAt: '04 Jun 2026',
        submittedTime: '04 Jun 2026, 13:50',
        reporterAvatar: 'TP',
        reason: 'Roommate schedule conflict affects sleep and study time.',
        note: 'Waiting for available bed confirmation.',
    },
    {
        id: 'TR-3091',
        student: 'Le Duc',
        studentId: '2231200789',
        currentRoom: 'B201',
        requestedRoom: 'C202',
        block: 'Block B',
        floor: 'Floor 2',
        requestedBlock: 'Block C',
        requestedFloor: 'Floor 2',
        status: 'Resolved',
        submittedAt: '31 May 2026',
        submittedTime: '31 May 2026, 11:05',
        reporterAvatar: 'LD',
        reason: 'Medical accommodation request.',
        note: 'Approved after document review.',
        decision: 'Approved',
    },
    {
        id: 'TR-3088',
        student: 'Hoang Linh',
        studentId: '2231200888',
        currentRoom: 'C202',
        requestedRoom: 'B202',
        block: 'Block C',
        floor: 'Floor 2',
        requestedBlock: 'Block B',
        requestedFloor: 'Floor 2',
        status: 'Resolved',
        submittedAt: '29 May 2026',
        submittedTime: '29 May 2026, 15:45',
        reporterAvatar: 'HL',
        reason: 'Preferred block change.',
        note: 'Denied because requested room has no available bed.',
        decision: 'Denied',
        denialReason: 'Requested room is currently unavailable.',
    },
    {
        id: 'TR-3084',
        student: 'Dang Khoa',
        studentId: '2231200991',
        currentRoom: 'A302',
        requestedRoom: 'C202',
        block: 'Block A',
        floor: 'Floor 3',
        requestedBlock: 'Block C',
        requestedFloor: 'Floor 2',
        status: 'Pending',
        submittedAt: '05 Jun 2026',
        submittedTime: '05 Jun 2026, 15:30',
        reporterAvatar: 'DK',
        reason: 'Current room has conflicting sleep schedules with roommates.',
    },
    {
        id: 'TR-3079',
        student: 'Mai Anh',
        studentId: '2231201010',
        currentRoom: 'B303',
        requestedRoom: 'A205',
        block: 'Block B',
        floor: 'Floor 3',
        requestedBlock: 'Block A',
        requestedFloor: 'Floor 2',
        status: 'In Progress',
        submittedAt: '03 Jun 2026',
        submittedTime: '03 Jun 2026, 08:20',
        reporterAvatar: 'MA',
        reason: 'Needs a room closer to assigned study group.',
        note: 'Checking available bed in requested block.',
    },
    {
        id: 'TR-3074',
        student: 'Ly An',
        studentId: '2231201033',
        currentRoom: 'C203',
        requestedRoom: 'B104',
        block: 'Block C',
        floor: 'Floor 2',
        requestedBlock: 'Block B',
        requestedFloor: 'Floor 1',
        status: 'Resolved',
        submittedAt: '25 May 2026',
        submittedTime: '25 May 2026, 10:10',
        reporterAvatar: 'LA',
        reason: 'Approved mutual transfer request.',
        note: 'Approved after both students confirmed the transfer.',
        decision: 'Approved',
    },
];
