import { moveOutResident } from '@/api/roomManagementApi';
import { useRefreshRoomManagement } from '@/hooks/useRoomManagement';
import type {
    ManagedAssignment,
    RoomManagementData,
} from '@/types/roomManagement';
import { activeAssignment, nodePath } from '@/utils/room-management';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';
import { ManagementConfirm } from './ManagementFormControls';
import { managementError } from './managementError';

export default function ResidentAssignments({
    assignments,
    data,
}: {
    assignments: ManagedAssignment[];
    data: RoomManagementData;
}) {
    const router = useRouter();
    const refresh = useRefreshRoomManagement();
    const [movingOut, setMovingOut] = useState<string | null>(null);
    const mutation = useMutation({
        mutationFn: (userId: string) => moveOutResident(userId),
        onSuccess: async () => {
            await refresh();
            setMovingOut(null);
            toast.success('Resident moved out');
        },
        onError: (error) =>
            toast.error(
                managementError(error, 'Could not move out this resident')
            ),
    });
    const selectedUser = data.users.find((user) => user.id === movingOut);
    const sorted = [...assignments].sort((a, b) =>
        b.startDate.localeCompare(a.startDate)
    );
    return (
        <View className="gap-3">
            {sorted.map((assignment) => {
                const user = data.users.find(
                    (item) => item.id === assignment.userId
                );
                const room = data.nodes.find(
                    (item) => item.id === assignment.roomNodeId
                );
                const active = activeAssignment(assignment, data.asOf);
                const scheduled =
                    new Date(assignment.startDate).getTime() > data.asOf;
                return (
                    <View
                        key={assignment.id}
                        className="rounded-2xl bg-white border border-slate-100 p-4"
                    >
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/manager-details/student/[id]',
                                    params: { id: assignment.userId },
                                })
                            }
                        >
                            <Text className="font-bold text-blue-700">
                                {user?.fullName || 'Resident'}
                            </Text>
                        </TouchableOpacity>
                        {room ? (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            '/manager-details/room/[code]',
                                        params: { code: room.id },
                                    })
                                }
                            >
                                <Text className="text-slate-700 mt-1">
                                    {nodePath(room, data)}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text className="text-slate-500 mt-1">
                                Room unavailable
                            </Text>
                        )}
                        <Text
                            className={`text-xs font-bold mt-2 ${active ? 'text-emerald-700' : 'text-slate-500'}`}
                        >
                            {active
                                ? 'CURRENT'
                                : scheduled
                                  ? 'SCHEDULED'
                                  : 'ENDED'}
                        </Text>
                        <Text className="text-slate-500 text-sm mt-1">
                            {formatDate(assignment.startDate)} →{' '}
                            {assignment.endDate
                                ? formatDate(assignment.endDate)
                                : 'Open-ended'}
                        </Text>
                        {assignment.assignedBy ? (
                            <Text className="text-slate-500 text-xs mt-1">
                                Assigned by: {assignment.assignedBy}
                            </Text>
                        ) : null}
                        {assignment.notes ? (
                            <Text className="text-slate-600 text-sm mt-2">
                                {assignment.notes}
                            </Text>
                        ) : null}
                        {assignment.contractUrl &&
                        /^https?:\/\//i.test(assignment.contractUrl) ? (
                            <TouchableOpacity
                                onPress={() => {
                                    void Linking.openURL(
                                        assignment.contractUrl!
                                    ).catch(() =>
                                        toast.error('Could not open contract')
                                    );
                                }}
                                className="mt-3"
                            >
                                <Text className="text-blue-600 font-semibold">
                                    Open contract
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {active ? (
                            <TouchableOpacity
                                onPress={() => setMovingOut(assignment.userId)}
                                className="mt-3"
                            >
                                <Text className="text-red-600 font-bold">
                                    Move out resident
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                );
            })}
            {!assignments.length ? (
                <Text className="text-slate-500 bg-white rounded-2xl p-4">
                    No room assignments.
                </Text>
            ) : null}
            {movingOut ? (
                <ManagementConfirm
                    title="Move out resident?"
                    message={`End active room assignments for ${selectedUser?.fullName || 'this resident'} now? Their room history will be retained.`}
                    busy={mutation.isPending}
                    destructive
                    onConfirm={() => mutation.mutate(movingOut)}
                    onCancel={() => setMovingOut(null)}
                />
            ) : null}
        </View>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleString();
}
