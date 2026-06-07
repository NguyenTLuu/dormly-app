export type ManagementTab = 'students' | 'rooms';
export type RoomTicketType = 'issue' | 'complaint' | 'transfer';

export interface RoomTicketSummary {
    id: string;
    title: string;
    type: RoomTicketType;
    status: 'Pending' | 'In Progress';
}

export interface StudentDocument {
    number: string;
    issueDate: string;
    issuePlace: string;
    imageUri: string;
}

export interface TemporaryResidence {
    code: string;
    validUntil: string;
    imageUri: string;
}

export interface DormContract {
    code: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
}

export interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

export interface DormStudent {
    id: string;
    fullName: string;
    initials: string;
    gender: string;
    major: string;
    cohort: string;
    phone: string;
    email: string;
    block: string;
    floor: string;
    room: string;
    bedCode: string;
    citizenId: StudentDocument;
    temporaryResidence: TemporaryResidence;
    contract: DormContract;
    emergencyContact: EmergencyContact;
}

export interface DormRoom {
    code: string;
    block: string;
    floor: string;
    gender: 'Male' | 'Female';
    capacity: number;
    occupied: number;
    monthlyRent: number;
    amenities: string[];
    area: number;
    studentIds: string[];
}

export const managementBlockOptions = ['All', 'Block A', 'Block B', 'Block C'];

export const managementFloorsByBlock: Record<string, string[]> = {
    'Block A': ['All', 'Floor 1', 'Floor 2', 'Floor 3'],
    'Block B': ['All', 'Floor 1', 'Floor 2', 'Floor 3'],
    'Block C': ['All', 'Floor 1', 'Floor 2'],
};

export const dormStudents: DormStudent[] = [
    {
        id: '2231200123',
        fullName: 'Nguyen Van A',
        initials: 'NA',
        gender: 'Male',
        major: 'Software Engineering',
        cohort: 'K22',
        phone: '0901 234 567',
        email: 'nguyenvana@student.edu.vn',
        block: 'Block A',
        floor: 'Floor 1',
        room: 'A102',
        bedCode: 'A102-B1',
        citizenId: {
            number: '079203012345',
            issueDate: '12 Mar 2022',
            issuePlace: 'Ho Chi Minh City Police',
            imageUri: 'mock://documents/citizen-id/2231200123.jpg',
        },
        temporaryResidence: {
            code: 'TR-A102-001',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231200123.jpg',
        },
        contract: {
            code: 'CT-A102-2026-01',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1200000,
        },
        emergencyContact: {
            name: 'Nguyen Thi Hoa',
            phone: '0918 111 222',
            relationship: 'Mother',
        },
    },
    {
        id: '2231200456',
        fullName: 'Tran Phuoc',
        initials: 'TP',
        gender: 'Male',
        major: 'Information Systems',
        cohort: 'K22',
        phone: '0902 456 789',
        email: 'tranphuoc@student.edu.vn',
        block: 'Block C',
        floor: 'Floor 1',
        room: 'C102',
        bedCode: 'C102-B2',
        citizenId: {
            number: '075203045678',
            issueDate: '04 Jul 2021',
            issuePlace: 'Da Nang Police',
            imageUri: 'mock://documents/citizen-id/2231200456.jpg',
        },
        temporaryResidence: {
            code: 'TR-C102-004',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231200456.jpg',
        },
        contract: {
            code: 'CT-C102-2026-04',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1150000,
        },
        emergencyContact: {
            name: 'Tran Minh Duc',
            phone: '0933 456 222',
            relationship: 'Father',
        },
    },
    {
        id: '2231200789',
        fullName: 'Le Duc',
        initials: 'LD',
        gender: 'Male',
        major: 'Computer Science',
        cohort: 'K22',
        phone: '0903 789 123',
        email: 'leduc@student.edu.vn',
        block: 'Block B',
        floor: 'Floor 2',
        room: 'B201',
        bedCode: 'B201-B1',
        citizenId: {
            number: '083203078901',
            issueDate: '22 May 2021',
            issuePlace: 'Can Tho Police',
            imageUri: 'mock://documents/citizen-id/2231200789.jpg',
        },
        temporaryResidence: {
            code: 'TR-B201-003',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231200789.jpg',
        },
        contract: {
            code: 'CT-B201-2026-03',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1250000,
        },
        emergencyContact: {
            name: 'Le Thi Lan',
            phone: '0988 789 333',
            relationship: 'Sister',
        },
    },
    {
        id: '2231200888',
        fullName: 'Hoang Linh',
        initials: 'HL',
        gender: 'Female',
        major: 'Business Analytics',
        cohort: 'K22',
        phone: '0904 888 456',
        email: 'hoanglinh@student.edu.vn',
        block: 'Block C',
        floor: 'Floor 2',
        room: 'C202',
        bedCode: 'C202-B3',
        citizenId: {
            number: '077203088812',
            issueDate: '17 Sep 2022',
            issuePlace: 'Binh Duong Police',
            imageUri: 'mock://documents/citizen-id/2231200888.jpg',
        },
        temporaryResidence: {
            code: 'TR-C202-002',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231200888.jpg',
        },
        contract: {
            code: 'CT-C202-2026-02',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1150000,
        },
        emergencyContact: {
            name: 'Hoang Van Minh',
            phone: '0977 222 555',
            relationship: 'Father',
        },
    },
    {
        id: '2231200991',
        fullName: 'Dang Khoa',
        initials: 'DK',
        gender: 'Male',
        major: 'Software Engineering',
        cohort: 'K23',
        phone: '0905 991 223',
        email: 'dangkhoa@student.edu.vn',
        block: 'Block A',
        floor: 'Floor 3',
        room: 'A302',
        bedCode: 'A302-B2',
        citizenId: {
            number: '079204099145',
            issueDate: '10 Jan 2023',
            issuePlace: 'Ho Chi Minh City Police',
            imageUri: 'mock://documents/citizen-id/2231200991.jpg',
        },
        temporaryResidence: {
            code: 'TR-A302-002',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231200991.jpg',
        },
        contract: {
            code: 'CT-A302-2026-02',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1300000,
        },
        emergencyContact: {
            name: 'Dang Thanh Son',
            phone: '0966 123 900',
            relationship: 'Father',
        },
    },
    {
        id: '2231201010',
        fullName: 'Mai Anh',
        initials: 'MA',
        gender: 'Female',
        major: 'Digital Marketing',
        cohort: 'K23',
        phone: '0906 010 111',
        email: 'maianh@student.edu.vn',
        block: 'Block B',
        floor: 'Floor 3',
        room: 'B303',
        bedCode: 'B303-B1',
        citizenId: {
            number: '031204101010',
            issueDate: '19 Dec 2022',
            issuePlace: 'Hai Phong Police',
            imageUri: 'mock://documents/citizen-id/2231201010.jpg',
        },
        temporaryResidence: {
            code: 'TR-B303-001',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231201010.jpg',
        },
        contract: {
            code: 'CT-B303-2026-01',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1280000,
        },
        emergencyContact: {
            name: 'Mai Thu Ha',
            phone: '0955 010 101',
            relationship: 'Mother',
        },
    },
    {
        id: '2231201033',
        fullName: 'Ly An',
        initials: 'LA',
        gender: 'Female',
        major: 'Accounting',
        cohort: 'K23',
        phone: '0907 033 444',
        email: 'lyan@student.edu.vn',
        block: 'Block C',
        floor: 'Floor 2',
        room: 'C203',
        bedCode: 'C203-B4',
        citizenId: {
            number: '086204103366',
            issueDate: '08 Aug 2022',
            issuePlace: 'Vinh Long Police',
            imageUri: 'mock://documents/citizen-id/2231201033.jpg',
        },
        temporaryResidence: {
            code: 'TR-C203-004',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231201033.jpg',
        },
        contract: {
            code: 'CT-C203-2026-04',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1150000,
        },
        emergencyContact: {
            name: 'Ly Thanh Phong',
            phone: '0944 033 999',
            relationship: 'Brother',
        },
    },
    {
        id: '2231201050',
        fullName: 'Bui Minh',
        initials: 'BM',
        gender: 'Male',
        major: 'Network Engineering',
        cohort: 'K23',
        phone: '0908 050 333',
        email: 'buiminh@student.edu.vn',
        block: 'Block A',
        floor: 'Floor 2',
        room: 'A205',
        bedCode: 'A205-B1',
        citizenId: {
            number: '092204105077',
            issueDate: '05 Feb 2023',
            issuePlace: 'Quang Nam Police',
            imageUri: 'mock://documents/citizen-id/2231201050.jpg',
        },
        temporaryResidence: {
            code: 'TR-A205-001',
            validUntil: '30 Sep 2026',
            imageUri: 'mock://documents/temporary-residence/2231201050.jpg',
        },
        contract: {
            code: 'CT-A205-2026-01',
            startDate: '01 Feb 2026',
            endDate: '31 Jan 2027',
            monthlyRent: 1300000,
        },
        emergencyContact: {
            name: 'Bui Thi Loan',
            phone: '0939 050 121',
            relationship: 'Mother',
        },
    },
];

export const dormRooms: DormRoom[] = [
    {
        code: 'A102',
        block: 'Block A',
        floor: 'Floor 1',
        gender: 'Male',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1200000,
        amenities: ['Wi-Fi', 'AC', 'Private bathroom'],
        area: 24,
        studentIds: ['2231200123'],
    },
    {
        code: 'A205',
        block: 'Block A',
        floor: 'Floor 2',
        gender: 'Female',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1300000,
        amenities: ['Wi-Fi', 'AC', 'Balcony'],
        area: 26,
        studentIds: ['2231201050'],
    },
    {
        code: 'A302',
        block: 'Block A',
        floor: 'Floor 3',
        gender: 'Male',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1300000,
        amenities: ['Wi-Fi', 'AC', 'Study desk'],
        area: 25,
        studentIds: ['2231200991'],
    },
    {
        code: 'B201',
        block: 'Block B',
        floor: 'Floor 2',
        gender: 'Male',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1250000,
        amenities: ['Wi-Fi', 'AC', 'Wardrobe'],
        area: 24,
        studentIds: ['2231200789'],
    },
    {
        code: 'B303',
        block: 'Block B',
        floor: 'Floor 3',
        gender: 'Female',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1280000,
        amenities: ['Wi-Fi', 'AC', 'Shared pantry'],
        area: 26,
        studentIds: ['2231201010'],
    },
    {
        code: 'C102',
        block: 'Block C',
        floor: 'Floor 1',
        gender: 'Male',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1150000,
        amenities: ['Wi-Fi', 'Fan', 'Private bathroom'],
        area: 23,
        studentIds: ['2231200456'],
    },
    {
        code: 'C202',
        block: 'Block C',
        floor: 'Floor 2',
        gender: 'Female',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1150000,
        amenities: ['Wi-Fi', 'AC', 'Study desk'],
        area: 23,
        studentIds: ['2231200888'],
    },
    {
        code: 'C203',
        block: 'Block C',
        floor: 'Floor 2',
        gender: 'Female',
        capacity: 4,
        occupied: 1,
        monthlyRent: 1150000,
        amenities: ['Wi-Fi', 'AC', 'Wardrobe'],
        area: 23,
        studentIds: ['2231201033'],
    },
    {
        code: 'A202',
        block: 'Block A',
        floor: 'Floor 2',
        gender: 'Female',
        capacity: 4,
        occupied: 0,
        monthlyRent: 1300000,
        amenities: ['Wi-Fi', 'AC', 'Balcony'],
        area: 26,
        studentIds: [],
    },
    {
        code: 'C101',
        block: 'Block C',
        floor: 'Floor 1',
        gender: 'Male',
        capacity: 4,
        occupied: 0,
        monthlyRent: 1150000,
        amenities: ['Wi-Fi', 'Fan', 'Private bathroom'],
        area: 23,
        studentIds: [],
    },
    {
        code: 'B105',
        block: 'Block B',
        floor: 'Floor 1',
        gender: 'Male',
        capacity: 4,
        occupied: 0,
        monthlyRent: 1200000,
        amenities: ['Wi-Fi', 'Fan', 'Wardrobe'],
        area: 23,
        studentIds: [],
    },
];
