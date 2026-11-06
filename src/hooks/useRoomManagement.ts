import { getRoomManagementData } from '@/api/roomManagementApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useRoomManagement() {
    return useQuery({
        queryKey: ['room-management'],
        queryFn: getRoomManagementData,
    });
}

export function useRefreshRoomManagement() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all(
            [
                ['room-management'],
                ['student-room-overview'],
                ['admin-room-assignments'],
                ['invoice-assignment-options'],
                ['admin-dashboard'],
                ['room-analytics'],
                ['operational-insights'],
            ].map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        );
}
