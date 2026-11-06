import type { ManagerTicket } from '@/api/managerRequestsApi';
import type { ManagedNode, RoomManagementData } from '@/types/roomManagement';
import { activeAssignment, isRoom, nodeAncestors } from './room-management';

export function roomInsights(data: RoomManagementData) {
    const rooms = data.nodes.filter((item) => isRoom(item, data));
    const current = data.assignments.filter((item) =>
        activeAssignment(item, data.asOf)
    );
    const occupants = (room: ManagedNode) =>
        current.filter((item) => item.roomNodeId === room.id).length;
    const capacity = (room: ManagedNode) => Math.max(0, room.maxCapacity ?? 0);
    const totalBeds = rooms.reduce((sum, room) => sum + capacity(room), 0);
    const occupiedBeds = rooms.reduce((sum, room) => sum + occupants(room), 0);
    const fullRooms = rooms.filter(
        (room) => capacity(room) > 0 && occupants(room) >= capacity(room)
    ).length;
    const buildings = data.nodes.filter((item) => !item.parentId);
    const byBuilding = buildings.map((building) => {
        const buildingRooms = rooms.filter((room) =>
            nodeAncestors(room, data.nodes).some(
                (item) => item.id === building.id
            )
        );
        const beds = buildingRooms.reduce(
            (sum, room) => sum + capacity(room),
            0
        );
        const occupied = buildingRooms.reduce(
            (sum, room) => sum + occupants(room),
            0
        );
        const floors = data.nodes
            .filter((item) => item.parentId === building.id)
            .map((floor) => {
                const floorRooms = buildingRooms.filter((room) =>
                    nodeAncestors(room, data.nodes).some(
                        (item) => item.id === floor.id
                    )
                );
                return {
                    id: floor.id,
                    name: floor.name,
                    rooms: floorRooms.length,
                    fullRooms: floorRooms.filter(
                        (room) =>
                            capacity(room) > 0 &&
                            occupants(room) >= capacity(room)
                    ).length,
                    beds: floorRooms.reduce(
                        (sum, room) => sum + capacity(room),
                        0
                    ),
                    occupied: floorRooms.reduce(
                        (sum, room) => sum + occupants(room),
                        0
                    ),
                };
            });
        return {
            id: building.id,
            name: building.name,
            rooms: buildingRooms.length,
            beds,
            occupied,
            floors,
        };
    });
    return {
        totalRooms: rooms.length,
        fullRooms,
        totalBeds,
        occupiedBeds,
        vacantBeds: Math.max(0, totalBeds - occupiedBeds),
        occupancyPercent:
            totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        byBuilding,
    };
}

export function ticketInsights(tickets: ManagerTicket[]) {
    const statuses = [
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
        'REJECTED',
    ].map((status) => ({
        label: status,
        count: tickets.filter((ticket) => ticket.status === status).length,
    }));
    const categories = [...new Set(tickets.map((item) => item.category))]
        .sort()
        .map((category) => ({
            label: category,
            count: tickets.filter((item) => item.category === category).length,
        }));
    return { statuses, categories };
}
