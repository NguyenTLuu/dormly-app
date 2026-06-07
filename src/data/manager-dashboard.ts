import { complaintRequests, issueRequests } from './manager-requests';

export type RoomStatus = 'Occupied' | 'Vacant' | 'Issue';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';
export type ComplaintStatus = 'New' | 'In Review' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type TransferRequestStatus =
    | 'Pending'
    | 'In Review'
    | 'Approved'
    | 'Rejected';

export interface RoomRecord {
    id: string;
    block: string;
    floor: string;
    capacity: number;
    residents: number;
    status: RoomStatus;
    hasActiveIssue: boolean;
}

export interface IncidentRecord {
    id: string;
    room: string;
    type: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    reportedAt: string;
    handlingHours: number;
}

export interface ComplaintRecord {
    id: string;
    student: string;
    room: string;
    category: string;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    rating: number;
    submittedAt: string;
}

export interface TransferRequestRecord {
    id: string;
    student: string;
    currentRoom: string;
    requestedRoom: string;
    status: TransferRequestStatus;
    reason: string;
    submittedAt: string;
}

export interface ReportSummary {
    id: string;
    title: string;
    value: string;
    description: string;
}

interface BlockFloorSummary {
    label: string;
    total: number;
    floors: {
        label: string;
        count: number;
        total: number;
    }[];
}

export const managerRooms: RoomRecord[] = [
    {
        id: 'A101',
        block: 'Block A',
        floor: 'Floor 1',
        capacity: 4,
        residents: 4,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'A102',
        block: 'Block A',
        floor: 'Floor 1',
        capacity: 4,
        residents: 3,
        status: 'Issue',
        hasActiveIssue: true,
    },
    {
        id: 'A201',
        block: 'Block A',
        floor: 'Floor 2',
        capacity: 4,
        residents: 0,
        status: 'Vacant',
        hasActiveIssue: false,
    },
    {
        id: 'A202',
        block: 'Block A',
        floor: 'Floor 2',
        capacity: 4,
        residents: 4,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'B101',
        block: 'Block B',
        floor: 'Floor 1',
        capacity: 6,
        residents: 5,
        status: 'Issue',
        hasActiveIssue: true,
    },
    {
        id: 'B102',
        block: 'Block B',
        floor: 'Floor 1',
        capacity: 6,
        residents: 6,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'B201',
        block: 'Block B',
        floor: 'Floor 2',
        capacity: 6,
        residents: 2,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'B202',
        block: 'Block B',
        floor: 'Floor 2',
        capacity: 6,
        residents: 0,
        status: 'Vacant',
        hasActiveIssue: false,
    },
    {
        id: 'C101',
        block: 'Block C',
        floor: 'Floor 1',
        capacity: 4,
        residents: 4,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'C102',
        block: 'Block C',
        floor: 'Floor 1',
        capacity: 4,
        residents: 3,
        status: 'Issue',
        hasActiveIssue: true,
    },
    {
        id: 'C201',
        block: 'Block C',
        floor: 'Floor 2',
        capacity: 4,
        residents: 4,
        status: 'Occupied',
        hasActiveIssue: false,
    },
    {
        id: 'C202',
        block: 'Block C',
        floor: 'Floor 2',
        capacity: 4,
        residents: 1,
        status: 'Occupied',
        hasActiveIssue: false,
    },
];

export const managerIncidents: IncidentRecord[] = [
    {
        id: 'INC-1024',
        room: 'A102',
        type: 'Electric',
        severity: 'High',
        status: 'In Progress',
        reportedAt: '04 Jun 2026',
        handlingHours: 18,
    },
    {
        id: 'INC-1023',
        room: 'B101',
        type: 'Water',
        severity: 'Critical',
        status: 'Open',
        reportedAt: '04 Jun 2026',
        handlingHours: 7,
    },
    {
        id: 'INC-1021',
        room: 'C102',
        type: 'Internet',
        severity: 'Medium',
        status: 'In Progress',
        reportedAt: '03 Jun 2026',
        handlingHours: 22,
    },
    {
        id: 'INC-1019',
        room: 'A201',
        type: 'Facility',
        severity: 'Low',
        status: 'Resolved',
        reportedAt: '02 Jun 2026',
        handlingHours: 9,
    },
    {
        id: 'INC-1018',
        room: 'B202',
        type: 'Facility',
        severity: 'Low',
        status: 'Resolved',
        reportedAt: '01 Jun 2026',
        handlingHours: 6,
    },
    {
        id: 'INC-1015',
        room: 'A102',
        type: 'Electric',
        severity: 'Medium',
        status: 'Resolved',
        reportedAt: '31 May 2026',
        handlingHours: 14,
    },
];

export const managerComplaints: ComplaintRecord[] = [
    {
        id: 'CP-2201',
        student: 'Nguyen Van A',
        room: 'A202',
        category: 'Noise',
        priority: 'High',
        status: 'New',
        rating: 2,
        submittedAt: '04 Jun 2026',
    },
    {
        id: 'CP-2198',
        student: 'Tran Phuoc',
        room: 'C102',
        category: 'Security',
        priority: 'Medium',
        status: 'In Review',
        rating: 3,
        submittedAt: '03 Jun 2026',
    },
    {
        id: 'CP-2196',
        student: 'Le Duc',
        room: 'B201',
        category: 'Order',
        priority: 'Low',
        status: 'Resolved',
        rating: 5,
        submittedAt: '02 Jun 2026',
    },
    {
        id: 'CP-2194',
        student: 'Pham Minh',
        room: 'A101',
        category: 'Security',
        priority: 'High',
        status: 'In Review',
        rating: 3,
        submittedAt: '01 Jun 2026',
    },
    {
        id: 'CP-2190',
        student: 'Hoang Linh',
        room: 'C202',
        category: 'Prohibited Items',
        priority: 'Medium',
        status: 'Resolved',
        rating: 4,
        submittedAt: '30 May 2026',
    },
];

export const managerTransferRequests: TransferRequestRecord[] = [
    {
        id: 'TR-3102',
        student: 'Nguyen Van A',
        currentRoom: 'A102',
        requestedRoom: 'B201',
        status: 'Pending',
        reason: 'Move closer to classmates for group study',
        submittedAt: '04 Jun 2026',
    },
    {
        id: 'TR-3098',
        student: 'Tran Phuoc',
        currentRoom: 'C102',
        requestedRoom: 'A201',
        status: 'In Review',
        reason: 'Roommate schedule conflict',
        submittedAt: '03 Jun 2026',
    },
    {
        id: 'TR-3091',
        student: 'Le Duc',
        currentRoom: 'B201',
        requestedRoom: 'C202',
        status: 'Approved',
        reason: 'Medical accommodation',
        submittedAt: '31 May 2026',
    },
    {
        id: 'TR-3088',
        student: 'Hoang Linh',
        currentRoom: 'C202',
        requestedRoom: 'B202',
        status: 'Rejected',
        reason: 'Preferred block change',
        submittedAt: '29 May 2026',
    },
];

export const openTransferRequests = managerTransferRequests.filter((request) =>
    ['Pending', 'In Review'].includes(request.status)
);

export const managerReportSummaries: ReportSummary[] = [
    {
        id: 'rooms',
        title: 'Room capacity',
        value: '5 full',
        description: 'Full rooms are tracked by block and floor',
    },
    {
        id: 'issues',
        title: 'Issues',
        value: `${issueRequests.filter((request) => request.status !== 'Resolved').length} open`,
        description: 'Electric, water, internet, and facility issues',
    },
    {
        id: 'complaints',
        title: 'Complaints',
        value: `${complaintRequests.filter((request) => request.status !== 'Resolved').length} open`,
        description: 'Noise, order, security, and conduct complaints',
    },
    {
        id: 'transfer-requests',
        title: 'Transfer requests',
        value: `${openTransferRequests.length} active`,
        description: 'Room transfer requests waiting for manager action',
    },
];

export const roomOverviewStats = {
    totalRooms: managerRooms.length,
    totalBeds: managerRooms.reduce((total, room) => total + room.capacity, 0),
    occupiedBeds: managerRooms.reduce(
        (total, room) => total + room.residents,
        0
    ),
    fullRooms: managerRooms.filter((room) => room.residents >= room.capacity)
        .length,
    vacantRooms: managerRooms.filter((room) => room.status === 'Vacant').length,
    issueRooms: managerRooms.filter((room) => room.hasActiveIssue).length,
};

export const dashboardSummary = {
    fullRooms: roomOverviewStats.fullRooms,
    totalRooms: roomOverviewStats.totalRooms,
    currentStudents: roomOverviewStats.occupiedBeds,
    openIssues: issueRequests.filter((request) => request.status !== 'Resolved')
        .length,
    openComplaints: complaintRequests.filter(
        (request) => request.status !== 'Resolved'
    ).length,
    transferRequests: openTransferRequests.length,
};

export const openIssues = issueRequests.filter(
    (request) => request.status !== 'Resolved'
);

export const openComplaints = complaintRequests.filter(
    (request) => request.status !== 'Resolved'
);

export const requestStatusSummary = {
    issues: {
        pending: issueRequests.filter((request) => request.status === 'Pending')
            .length,
        inProgress: issueRequests.filter(
            (request) => request.status === 'In Progress'
        ).length,
    },
    complaints: {
        pending: complaintRequests.filter(
            (request) => request.status === 'Pending'
        ).length,
        inProgress: complaintRequests.filter(
            (request) => request.status === 'In Progress'
        ).length,
    },
};

const resolvedIssues = managerIncidents.filter(
    (incident) => incident.status === 'Resolved'
);
const resolvedComplaints = managerComplaints.filter(
    (complaint) => complaint.status === 'Resolved'
);

const severityRatingMap: Record<IncidentSeverity, number> = {
    Critical: 2.4,
    High: 3.2,
    Medium: 4,
    Low: 4.6,
};

export const issueAverageRating =
    Math.round(
        (resolvedIssues.reduce(
            (total, issue) => total + severityRatingMap[issue.severity],
            0
        ) /
            resolvedIssues.length) *
            10
    ) / 10;

export const complaintAverageRating =
    Math.round(
        (resolvedComplaints.reduce(
            (total, complaint) => total + complaint.rating,
            0
        ) /
            resolvedComplaints.length) *
            10
    ) / 10;

export const incidentPerformance = {
    averageHandlingHours: Math.round(
        managerIncidents.reduce(
            (total, incident) => total + incident.handlingHours,
            0
        ) / managerIncidents.length
    ),
    withinSla: 4,
    overdue: 2,
};

export const roomOccupancyByBlock = ['Block A', 'Block B', 'Block C'].map(
    (block) => {
        const rooms = managerRooms.filter((room) => room.block === block);
        const capacity = rooms.reduce((total, room) => total + room.capacity, 0);
        const residents = rooms.reduce(
            (total, room) => total + room.residents,
            0
        );

        return {
            label: block,
            value: `${residents}/${capacity}`,
            percent: Math.round((residents / capacity) * 100),
        };
    }
);

export const fullRoomsByBlock: BlockFloorSummary[] = [
    'Block A',
    'Block B',
    'Block C',
].map((block) => {
    const rooms = managerRooms.filter((room) => room.block === block);
    const floors = Array.from(new Set(rooms.map((room) => room.floor))).map(
        (floor) => {
            const floorRooms = rooms.filter((room) => room.floor === floor);
            const count = floorRooms.filter(
                (room) => room.residents >= room.capacity
            ).length;

            return {
                label: floor,
                count,
                total: floorRooms.length,
            };
        }
    );

    return {
        label: block,
        total: rooms.length,
        floors,
    };
});

export const vacantBedsByBlock: BlockFloorSummary[] = [
    'Block A',
    'Block B',
    'Block C',
].map((block) => {
    const rooms = managerRooms.filter((room) => room.block === block);
    const floors = Array.from(new Set(rooms.map((room) => room.floor))).map(
        (floor) => {
            const floorRooms = rooms.filter((room) => room.floor === floor);
            const count = floorRooms.reduce(
                (total, room) => total + (room.capacity - room.residents),
                0
            );
            const total = floorRooms.reduce(
                (sum, room) => sum + room.capacity,
                0
            );

            return {
                label: floor,
                count,
                total,
            };
        }
    );

    return {
        label: block,
        total: floors.reduce((sum, floor) => sum + floor.count, 0),
        floors,
    };
});

export const roomOccupancyByFloor = ['Floor 1', 'Floor 2'].map((floor) => {
    const rooms = managerRooms.filter((room) => room.floor === floor);
    const capacity = rooms.reduce((total, room) => total + room.capacity, 0);
    const residents = rooms.reduce(
        (total, room) => total + room.residents,
        0
    );

    return {
        label: floor,
        value: `${residents}/${capacity}`,
        percent: Math.round((residents / capacity) * 100),
    };
});

export const incidentTypeBreakdown = [
    'Electric',
    'Water',
    'Internet',
    'Facility',
].map((type) => {
    const count = openIssues.filter((request) => request.category === type).length;

    return {
        label: type,
        value: `${count} cases`,
        percent: Math.round((count / openIssues.length) * 100),
    };
});

export const issueLocationBreakdown: BlockFloorSummary[] = [
    'Block A',
    'Block B',
    'Block C',
].map((block) => {
    const blockIssues = openIssues.filter((request) => request.block === block);
    const floors = Array.from(new Set(blockIssues.map((request) => request.floor))).map(
        (floor) => {
            const count = blockIssues.filter(
                (request) => request.floor === floor
            ).length;

            return {
                label: floor,
                count,
                total: count,
            };
        }
    );

    return {
        label: block,
        total: blockIssues.length,
        floors,
    };
});

export const complaintLocationBreakdown: BlockFloorSummary[] = [
    'Block A',
    'Block B',
    'Block C',
].map((block) => {
    const blockComplaints = openComplaints.filter(
        (request) => request.block === block
    );
    const floors = Array.from(
        new Set(blockComplaints.map((request) => request.floor))
    ).map(
        (floor) => {
            const count = blockComplaints.filter(
                (request) => request.floor === floor
            ).length;

            return {
                label: floor,
                count,
                total: count,
            };
        }
    );

    return {
        label: block,
        total: blockComplaints.length,
        floors,
    };
});

export const incidentSeverityBreakdown = [
    'Critical',
    'High',
    'Medium',
    'Low',
].map((severity) => {
    const count = managerIncidents.filter(
        (incident) => incident.severity === severity
    ).length;

    return {
        label: severity,
        value: `${count} cases`,
        percent: Math.round((count / managerIncidents.length) * 100),
    };
});

export const feedbackStatusBreakdown = ['Pending', 'In Progress'].map(
    (status) => {
        const count = openComplaints.filter(
            (request) => request.status === status
        ).length;

        return {
            label: status,
            value: `${count} items`,
            percent: Math.round((count / openComplaints.length) * 100),
        };
    }
);

export const feedbackCategoryBreakdown = [
    'Noise',
    'Security',
    'Order',
    'Prohibited Items',
].map((category) => {
    const count = openComplaints.filter(
        (request) => request.category === category
    ).length;

    return {
        label: category,
        value: `${count} items`,
        percent: Math.round((count / openComplaints.length) * 100),
    };
});
