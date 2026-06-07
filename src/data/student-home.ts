import { Ionicons } from '@expo/vector-icons';

export interface StudentHomeOverview {
    greeting: string;
    fullName: string;
    studentId: string;
    major: string;
    room: {
        code: string;
        location: string;
        occupancy: number;
        capacity: number;
        monthlyFee: string;
    };
}

export interface StudentWeather {
    location: string;
    temperature: number;
    condition: string;
    high: number;
    low: number;
    rainChance: number;
    icon: keyof typeof Ionicons.glyphMap;
    activitySuggestion: string;
}

export interface StudentHomeStatus {
    issues: { total: number; active: number };
    complaints: { total: number; active: number };
    transferStatus: 'Pending' | 'Approved' | 'Rejected';
}

export const studentHomeOverview: StudentHomeOverview = {
    greeting: 'Good morning,',
    fullName: 'Nguyen Van A',
    studentId: '2231200123',
    major: 'Software Engineer',
    room: {
        code: 'Room A365',
        location: 'Block 1 - Floor 2',
        occupancy: 3,
        capacity: 4,
        monthlyFee: '800K VND',
    },
};

export const studentWeather: StudentWeather = {
    location: 'Thu Dau Mot',
    temperature: 31,
    condition: 'Partly cloudy',
    high: 33,
    low: 26,
    rainChance: 30,
    icon: 'partly-sunny-outline',
    activitySuggestion: 'Study outside before the late-afternoon rain.',
};

export const studentHomeStatus: StudentHomeStatus = {
    issues: { total: 2, active: 1 },
    complaints: { total: 1, active: 1 },
    transferStatus: 'Pending',
};
