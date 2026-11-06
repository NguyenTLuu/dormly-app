import type { ManagedNode, RoomManagementData } from '@/types/roomManagement';
import {
    effectiveGender,
    hasAssignmentCapacity,
    isResidentRole,
    isRoom,
    nodePath,
    roomAllowsAssignment,
} from './room-management';

export function chooseAutomaticRoom(
    data: RoomManagementData,
    userId: string,
    startDate: string,
    endDate?: string
): ManagedNode | null {
    const user = data.users.find((item) => item.id === userId);
    if (!user?.isActive || !isResidentRole(user.roles)) return null;
    if (
        data.assignments.some(
            (item) =>
                item.userId === userId &&
                new Date(item.startDate).getTime() > data.asOf &&
                (!item.endDate || new Date(item.endDate).getTime() > data.asOf)
        )
    )
        return null;
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    const currentRoomIds = new Set(
        data.assignments
            .filter(
                (item) =>
                    item.userId === userId &&
                    new Date(item.startDate).getTime() <= data.asOf &&
                    (!item.endDate ||
                        new Date(item.endDate).getTime() > data.asOf)
            )
            .map((item) => item.roomNodeId)
    );
    const candidates = data.nodes.filter((room) => {
        if (
            !isRoom(room, data) ||
            !roomAllowsAssignment(room) ||
            currentRoomIds.has(room.id)
        )
            return false;
        if (!room.maxCapacity || room.maxCapacity <= 0) return false;
        if ((room.currentOccupancy ?? 0) >= room.maxCapacity) return false;
        if (
            !hasAssignmentCapacity(
                data.assignments,
                room.id,
                userId,
                startDate,
                endDate,
                room.maxCapacity
            )
        )
            return false;
        const occupants = data.assignments.filter(
            (item) =>
                item.roomNodeId === room.id &&
                item.userId !== userId &&
                new Date(item.startDate).getTime() < end &&
                (!item.endDate || new Date(item.endDate).getTime() > start)
        );
        const policy = effectiveGender(room, data);
        if (policy === 'MALE' || policy === 'FEMALE')
            return user.gender === policy;
        if (policy === 'MIXED' || occupants.length === 0) return true;
        if (!user.gender) return false;
        return occupants.every(
            (item) =>
                data.users.find((person) => person.id === item.userId)
                    ?.gender === user.gender
        );
    });
    candidates.sort((a, b) => {
        const occupancy = (room: ManagedNode) =>
            data.assignments.filter(
                (item) =>
                    item.roomNodeId === room.id &&
                    new Date(item.startDate).getTime() <= start &&
                    (!item.endDate || new Date(item.endDate).getTime() > start)
            ).length;
        return (
            Math.max(occupancy(a), a.currentOccupancy ?? 0) -
                Math.max(occupancy(b), b.currentOccupancy ?? 0) ||
            nodePath(a, data).localeCompare(nodePath(b, data)) ||
            a.id.localeCompare(b.id)
        );
    });
    return candidates[0] ?? null;
}

export function backendCanAutoAssign(data: RoomManagementData, userId: string) {
    const hasExisting = data.assignments.some(
        (item) =>
            item.userId === userId &&
            (!item.endDate || new Date(item.endDate).getTime() > data.asOf)
    );
    const hasBackendRoom = data.nodes.some(
        (room) =>
            isRoom(room, data) &&
            (!room.status ||
                ['ACTIVE', 'AVAILABLE', 'VACANT', 'OPEN'].includes(
                    room.status.toUpperCase()
                ))
    );
    return !hasExisting && hasBackendRoom;
}
