import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/api';
import type { AdminUser } from '@/types/admin';
import type {
    AssignResidentInput,
    ManagedAssignment,
    ManagedNode,
    ManagedNodeType,
    RoomManagementData,
    SaveManagedNode,
} from '@/types/roomManagement';

export async function getRoomManagementData(): Promise<RoomManagementData> {
    const [nodes, nodeTypes, users, assignments] = await Promise.all([
        axiosClient.get<ApiResponse<ManagedNode[]>>('/api/building-nodes'),
        axiosClient.get<ApiResponse<ManagedNodeType[]>>('/api/node-types'),
        axiosClient.get<ApiResponse<AdminUser[]>>('/api/users'),
        axiosClient.get<ApiResponse<ManagedAssignment[]>>(
            '/api/room-assignments'
        ),
    ]);
    return {
        asOf: Date.now(),
        nodes: nodes.data.result,
        nodeTypes: nodeTypes.data.result,
        users: users.data.result,
        assignments: assignments.data.result,
    };
}

export async function saveManagedNode(
    input: SaveManagedNode,
    id?: string
): Promise<ManagedNode> {
    // PUT maps every field. Preserve the latest server occupancy instead of resetting it.
    const occupancy = id
        ? (
              await axiosClient.get<ApiResponse<ManagedNode>>(
                  `/api/building-nodes/${id}`
              )
          ).data.result.currentOccupancy
        : 0;
    const payload = { ...input, currentOccupancy: occupancy ?? 0 };
    const response = id
        ? await axiosClient.put<ApiResponse<ManagedNode>>(
              `/api/building-nodes/${id}`,
              payload
          )
        : await axiosClient.post<ApiResponse<ManagedNode>>(
              '/api/building-nodes',
              payload
          );
    return response.data.result;
}

export async function deleteManagedNode(id: string): Promise<void> {
    await axiosClient.delete(`/api/building-nodes/${id}`);
}

export async function assignResident(
    input: AssignResidentInput,
    automatic: boolean
): Promise<ManagedAssignment> {
    if (automatic) {
        const { userId, startDate, endDate, assignedBy, contractUrl, notes } =
            input;
        const params = {
            userId,
            startDate,
            endDate,
            assignedBy,
            contractUrl,
            notes,
        };
        const response = await axiosClient.post<ApiResponse<ManagedAssignment>>(
            '/api/room-assignments/assign-auto',
            null,
            { params }
        );
        return response.data.result;
    }
    const response = await axiosClient.post<ApiResponse<ManagedAssignment>>(
        '/api/room-assignments/assign-manual',
        input
    );
    return response.data.result;
}

export async function moveOutResident(userId: string): Promise<void> {
    await axiosClient.post('/api/room-assignments/move-out', null, {
        params: { userId },
    });
}
