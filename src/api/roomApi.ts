import { axiosClient } from './axiosClient';

import type { ApiResponse } from '../types/api';
import type {
    BuildingNode,
    CurrentRoomAssignment,
    RoomAssignment,
    RoomHistoryAssignment,
    RoomUser,
    StudentRoomOverview,
} from '../types/room';

export async function getStudentRoomOverview(
    currentUserId: string
): Promise<StudentRoomOverview> {
    const [
        currentRoomResponse,
        historyResponse,
        assignmentsResponse,
        nodesResponse,
        usersResponse,
    ] = await Promise.all([
        axiosClient.get<ApiResponse<CurrentRoomAssignment>>(
            '/api/users/me/current-room'
        ),
        axiosClient.get<ApiResponse<RoomHistoryAssignment[]>>(
            '/api/users/me/room-history'
        ),
        axiosClient.get<ApiResponse<RoomAssignment[]>>('/api/room-assignments'),
        axiosClient.get<ApiResponse<BuildingNode[]>>('/api/building-nodes'),
        axiosClient.get<ApiResponse<RoomUser[]>>('/api/users'),
    ]);

    const currentRoom = currentRoomResponse.data.result;
    const history = historyResponse.data.result;
    const assignments = assignmentsResponse.data.result;
    const nodes = nodesResponse.data.result;
    const users = usersResponse.data.result;
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const userById = new Map(users.map((user) => [user.id, user]));
    const now = new Date();

    const activeAssignments = assignments.filter(
        (assignment) =>
            assignment.roomNodeId === currentRoom.roomNodeId &&
            new Date(assignment.startDate) <= now &&
            (!assignment.endDate || new Date(assignment.endDate) > now)
    );
    const currentRoomNode = nodeById.get(currentRoom.roomNodeId);
    const roomDetails = getRoomDetails(currentRoom.roomNodeId, nodeById);
    const capacity = currentRoomNode?.maxCapacity ?? activeAssignments.length;

    return {
        roomName: roomDetails.roomName,
        floor: roomDetails.floor,
        block: roomDetails.block,
        occupancy: activeAssignments.length,
        capacity,
        history: history.map((assignment) => {
            const details = getRoomDetails(assignment.roomNodeId, nodeById);
            return {
                id: assignment.roomAssignmentId,
                ...details,
                dateRange: formatDateRange(
                    assignment.startDate,
                    assignment.endDate
                ),
            };
        }),
        roommates: activeAssignments.map((assignment) => {
            const user = userById.get(assignment.userId);
            return {
                id: assignment.userId,
                name: user?.fullName || 'Dorm resident',
                subtext: user?.email || 'Resident',
                isYou: assignment.userId === currentUserId,
            };
        }),
    };
}

function getRoomDetails(
    roomNodeId: string,
    nodeById: Map<string, BuildingNode>
) {
    const room = nodeById.get(roomNodeId);
    const ancestors = getAncestors(room, nodeById);
    const floorName = ancestors.find((node) =>
        /^floor\b/i.test(node.name)
    )?.name;
    const buildingName = ancestors.find((node) =>
        /^(building|block)\b/i.test(node.name)
    )?.name;

    return {
        roomName: room?.name || 'Unknown room',
        floor: toDisplayValue(floorName, 'Floor'),
        block: toDisplayValue(buildingName, 'Building'),
    };
}

function getAncestors(
    node: BuildingNode | undefined,
    nodeById: Map<string, BuildingNode>
) {
    const ancestors: BuildingNode[] = [];
    let parentId = node?.parentId;

    while (parentId) {
        const parent = nodeById.get(parentId);
        if (!parent) break;
        ancestors.push(parent);
        parentId = parent.parentId;
    }

    return ancestors;
}

function toDisplayValue(value: string | undefined, prefix: string) {
    if (!value) return '-';
    return value.replace(new RegExp(`^${prefix}\\s*`, 'i'), '') || value;
}

function formatDateRange(startDate: string, endDate?: string | null) {
    const formatter = new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
    });
    const start = formatter.format(new Date(startDate));

    return endDate
        ? `${start} – ${formatter.format(new Date(endDate))}`
        : `Since ${start}`;
}
