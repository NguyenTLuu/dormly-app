import { useQuery } from '@tanstack/react-query';

import { getStudentRoomOverview } from '../api/roomApi';
import { useAuth } from '../auth/AuthContext';

export function useStudentRoomOverview() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['student-room-overview', session?.userId],
        queryFn: () => getStudentRoomOverview(session!.userId),
        enabled: Boolean(session?.userId),
        staleTime: 30_000,
    });
}
