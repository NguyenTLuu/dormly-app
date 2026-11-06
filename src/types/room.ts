export interface CurrentRoomAssignment {
    roomAssignmentId: string;
    roomNodeId: string;
    startDate: string;
    endDate?: string | null;
}

export type RoomHistoryAssignment = CurrentRoomAssignment;

export interface RoomAssignment {
    id: string;
    userId: string;
    roomNodeId: string;
    startDate: string;
    endDate?: string | null;
}

export interface BuildingNode {
    id: string;
    parentId?: string | null;
    name: string;
    maxCapacity?: number | null;
}

export interface RoomUser {
    id: string;
    fullName: string;
    email: string;
}

export interface StudentRoomHistoryItem {
    id: string;
    roomName: string;
    floor: string;
    block: string;
    dateRange: string;
}

export interface StudentRoommate {
    id: string;
    name: string;
    subtext: string;
    isYou: boolean;
}

export interface StudentRoomOverview {
    roomName: string;
    floor: string;
    block: string;
    occupancy: number;
    capacity: number;
    history: StudentRoomHistoryItem[];
    roommates: StudentRoommate[];
}
