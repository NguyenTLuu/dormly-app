import type { ManagerTransfer } from '@/api/managerRequestsApi';
import type { ManagedNode, RoomManagementData } from '@/types/roomManagement';
import {
    activeAssignment,
    effectiveGender,
    hasAssignmentCapacity,
    isResidentRole,
    isRoom,
    roomAllowsAssignment,
} from './room-management';

export function transferDestinationError(
    transfer: ManagerTransfer,
    data: RoomManagementData,
    room: ManagedNode | undefined,
    startDate: string
): string | null {
    const user = data.users.find((item) => item.id === transfer.userId);
    if (!user || !user.isActive || !isResidentRole(user.roles))
        return 'The requester must have an active USER account.';
    if (!room || !isRoom(room, data) || !roomAllowsAssignment(room))
        return 'Choose an available room.';
    if (room.id === transfer.fromRoomId)
        return 'Choose a room different from the requested current room.';

    const active = data.assignments.filter(
        (item) => item.userId === user.id && activeAssignment(item, data.asOf)
    );
    if (active.length !== 1)
        return 'The resident must have exactly one current room. Refresh room data.';
    const current = active[0];
    if (current.roomNodeId !== transfer.fromRoomId) {
        if (current.roomNodeId !== room.id)
            return 'The resident has already moved. Select their current room to finish this review.';
        return null;
    }
    if (
        data.assignments.some(
            (item) =>
                item.userId === user.id &&
                new Date(item.startDate).getTime() > data.asOf &&
                (!item.endDate || new Date(item.endDate).getTime() > data.asOf)
        )
    )
        return 'The resident has a scheduled assignment. Resolve it before approving a transfer.';
    if (!room.maxCapacity || room.maxCapacity <= 0)
        return 'Set a positive capacity for the destination room.';
    if (
        !hasAssignmentCapacity(
            data.assignments,
            room.id,
            user.id,
            startDate,
            undefined,
            room.maxCapacity
        )
    )
        return 'The destination room is full.';
    const policy = effectiveGender(room, data);
    if (policy && policy !== 'MIXED' && user.gender && user.gender !== policy)
        return 'Resident gender does not match the destination room policy.';
    return null;
}
