import type { AdminRoomAssignment, AdminUser } from './admin';

export type RoomGender = 'MALE' | 'FEMALE' | 'MIXED';

export interface ManagedNode {
    id: string;
    name: string;
    nodeTypeId: string;
    parentId?: string | null;
    description?: string | null;
    maxCapacity?: number | null;
    currentOccupancy?: number | null;
    genderPolicy?: RoomGender | null;
    status?: string | null;
}

export interface ManagedNodeType {
    id: string;
    name: string;
    level: number;
}

export interface ManagedAssignment extends AdminRoomAssignment {
    assignedBy?: string | null;
    contractUrl?: string | null;
    notes?: string | null;
}

export interface RoomManagementData {
    asOf: number;
    nodes: ManagedNode[];
    nodeTypes: ManagedNodeType[];
    users: AdminUser[];
    assignments: ManagedAssignment[];
}

export interface SaveManagedNode {
    name: string;
    nodeTypeId: string;
    parentId: string | null;
    description: string;
    maxCapacity: number | null;
    genderPolicy: RoomGender | null;
    status: string;
}

export interface AssignResidentInput {
    userId: string;
    roomNodeId?: string;
    startDate: string;
    endDate?: string;
    assignedBy?: string;
    contractUrl?: string;
    notes?: string;
}
