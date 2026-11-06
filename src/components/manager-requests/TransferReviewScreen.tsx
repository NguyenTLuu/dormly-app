import {
    getManagerTransfer,
    reviewManagerTransfer,
} from '@/api/managerRequestsApi';
import { assignResident, getRoomManagementData } from '@/api/roomManagementApi';
import { useAuth } from '@/auth/AuthContext';
import { ManagerHeader } from '@/components/manager-dashboard';
import {
    ManagementButton,
    ManagementChoice,
    ManagementConfirm,
    ManagementInput,
    ManagementQueryState,
} from '@/components/manager-management/ManagementFormControls';
import { managementError } from '@/components/manager-management/managementError';
import {
    useRefreshRoomManagement,
    useRoomManagement,
} from '@/hooks/useRoomManagement';
import {
    activeAssignment,
    isRoom,
    localDateTime,
    nodePath,
    roomAllowsAssignment,
} from '@/utils/room-management';
import { transferDestinationError } from '@/utils/transfer-review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

type Action = 'approve' | 'reject';

export default function TransferReviewScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const refreshRooms = useRefreshRoomManagement();
    const transfer = useQuery({
        queryKey: ['manager-transfer', id],
        queryFn: () => getManagerTransfer(id),
        enabled: Boolean(id),
    });
    const management = useRoomManagement();
    const [roomId, setRoomId] = useState('');
    const [note, setNote] = useState('');
    const [confirm, setConfirm] = useState<Action | null>(null);
    const data = management.data;
    const request = transfer.data;
    const resident = data?.users.find((item) => item.id === request?.userId);
    const fromRoom = data?.nodes.find(
        (item) => item.id === request?.fromRoomId
    );
    const current = data?.assignments.find(
        (item) =>
            item.userId === request?.userId && activeAssignment(item, data.asOf)
    );
    const currentRoom = data?.nodes.find(
        (item) => item.id === current?.roomNodeId
    );
    const movedWhilePending =
        request?.status === 'PENDING' &&
        currentRoom &&
        currentRoom.id !== request.fromRoomId;
    const selectedRoom = data?.nodes.find((item) => item.id === roomId);
    const rooms =
        data?.nodes.filter(
            (item) => isRoom(item, data) && roomAllowsAssignment(item)
        ) ?? [];

    const refresh = async () => {
        await Promise.all([transfer.refetch(), management.refetch()]);
    };

    const mutation = useMutation({
        mutationFn: async (action: Action) => {
            const latest = await getManagerTransfer(id);
            if (latest.status !== 'PENDING')
                throw new Error(
                    'This request has already been reviewed. Refresh to see its status.'
                );
            if (action === 'reject') {
                if (!note.trim()) throw new Error('Enter a rejection reason.');
                return reviewManagerTransfer(id, 'REJECTED', note.trim());
            }

            // Re-read the room state before committing a move. Backend capacity and
            // gender checks remain the final authority when another operator acts.
            const latestRooms = await getRoomManagementData();
            const target = latestRooms.nodes.find((item) => item.id === roomId);
            const startDate = localDateTime();
            const validation = transferDestinationError(
                latest,
                latestRooms,
                target,
                startDate
            );
            if (validation) throw new Error(validation);
            const alreadyMoved = latestRooms.assignments.some(
                (item) =>
                    item.userId === latest.userId &&
                    item.roomNodeId === roomId &&
                    activeAssignment(item, latestRooms.asOf)
            );
            if (!alreadyMoved) {
                await assignResident(
                    {
                        userId: latest.userId!,
                        roomNodeId: roomId,
                        startDate,
                        assignedBy: session?.email,
                        notes: `Approved transfer request ${id}`,
                    },
                    false
                );
            }
            // The backend's approval-with-toRoomId path swallows assignment errors.
            // Persist APPROVED only after the assignment endpoint confirms the move.
            try {
                return await reviewManagerTransfer(id, 'APPROVED', note.trim());
            } catch {
                throw new Error(
                    'The resident was moved, but the review status could not be confirmed. Refresh first; if still pending, select the current room and approve again.'
                );
            }
        },
        onSuccess: async (result) => {
            setConfirm(null);
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['manager-transfers'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['operational-insights'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['manager-transfer', id],
                }),
                refreshRooms(),
            ]);
            toast.success(
                result.status === 'APPROVED'
                    ? 'Transfer approved and room updated'
                    : 'Transfer rejected'
            );
        },
        onError: async (error) => {
            setConfirm(null);
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['manager-transfers'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['operational-insights'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['manager-transfer', id],
                }),
                refreshRooms(),
            ]);
            toast.error(
                error instanceof Error && !('response' in error)
                    ? error.message
                    : managementError(error, 'Could not review this transfer')
            );
        },
    });

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Transfer Review"
                subtitle="Review and assign a destination room"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 48, gap: 14 }}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            transfer.isRefetching || management.isRefetching
                        }
                        onRefresh={() => void refresh()}
                    />
                }
            >
                <ManagementQueryState
                    loading={transfer.isLoading || management.isLoading}
                    error={transfer.isError || management.isError}
                    retry={() => void refresh()}
                />
                {request && data ? (
                    <>
                        <View className="bg-white border border-slate-100 rounded-2xl p-4 gap-2">
                            <Text className="text-slate-900 text-lg font-bold">
                                {resident?.fullName || 'Resident'}
                            </Text>
                            <Text className="text-slate-500">
                                {resident?.email || request.userId}
                            </Text>
                            <Text className="text-slate-700 font-semibold">
                                Status: {request.status}
                            </Text>
                            <Text className="text-slate-600">
                                From:{' '}
                                {fromRoom
                                    ? nodePath(fromRoom, data)
                                    : request.fromRoomId || 'Unknown room'}
                            </Text>
                            <Text className="text-slate-600">
                                Current:{' '}
                                {currentRoom
                                    ? nodePath(currentRoom, data)
                                    : 'No current room'}
                            </Text>
                            <Text className="text-slate-500 text-xs">
                                Requested {formatDate(request.createdAt)}
                            </Text>
                        </View>
                        <View className="bg-white border border-slate-100 rounded-2xl p-4 gap-2">
                            <Text className="text-slate-800 font-bold">
                                Resident reason
                            </Text>
                            <Text className="text-slate-700 leading-6">
                                {request.reason || 'No reason provided'}
                            </Text>
                        </View>
                        {request.status === 'PENDING' ? (
                            <View className="bg-white border border-slate-100 rounded-2xl p-4 gap-4">
                                <Text className="text-slate-800 font-bold text-base">
                                    Decision
                                </Text>
                                <Text className="text-slate-600">
                                    Select the destination for approval.
                                    Rejection requires a reason.
                                </Text>
                                {currentRoom &&
                                currentRoom.id !== request.fromRoomId ? (
                                    <Text className="text-amber-700 bg-amber-50 p-3 rounded-xl">
                                        The resident has already moved. Choose
                                        their current room to finish this
                                        review.
                                    </Text>
                                ) : null}
                                <ManagementChoice
                                    label="Destination room"
                                    value={roomId}
                                    onChange={setRoomId}
                                    disabled={mutation.isPending}
                                    options={rooms
                                        .filter(
                                            (item) =>
                                                item.id !== request.fromRoomId
                                        )
                                        .map((item) => ({
                                            value: item.id,
                                            label: `${nodePath(item, data)} · ${data.assignments.filter((assignment) => assignment.roomNodeId === item.id && activeAssignment(assignment, data.asOf)).length}/${item.maxCapacity ?? '—'}`,
                                        }))}
                                />
                                <ManagementInput
                                    label="Review note (required for rejection)"
                                    value={note}
                                    onChangeText={setNote}
                                    editable={!mutation.isPending}
                                    multiline
                                />
                                <ManagementButton
                                    label="Approve and move resident"
                                    disabled={mutation.isPending}
                                    onPress={() => {
                                        if (!data || !request) return;
                                        const error = transferDestinationError(
                                            request,
                                            data,
                                            selectedRoom,
                                            localDateTime()
                                        );
                                        if (error) return toast.error(error);
                                        setConfirm('approve');
                                    }}
                                />
                                {!movedWhilePending ? (
                                    <ManagementButton
                                        label="Reject request"
                                        destructive
                                        disabled={mutation.isPending}
                                        onPress={() => {
                                            if (!note.trim())
                                                return toast.error(
                                                    'Enter a rejection reason.'
                                                );
                                            setConfirm('reject');
                                        }}
                                    />
                                ) : null}
                            </View>
                        ) : (
                            <View className="bg-white border border-slate-100 rounded-2xl p-4 gap-2">
                                <Text className="text-slate-800 font-bold">
                                    Review outcome
                                </Text>
                                <Text className="text-slate-600">
                                    Reviewed by {request.reviewedBy || 'Staff'}{' '}
                                    · {formatDate(request.reviewedAt)}
                                </Text>
                                {request.reviewNote ? (
                                    <Text className="text-slate-700">
                                        {request.reviewNote}
                                    </Text>
                                ) : null}
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={() => void refresh()}
                            className="items-center py-3"
                        >
                            <Text className="text-blue-600 font-bold">
                                Refresh request and rooms
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : null}
            </ScrollView>
            {confirm ? (
                <ManagementConfirm
                    title={
                        confirm === 'approve'
                            ? 'Approve transfer?'
                            : 'Reject transfer?'
                    }
                    message={
                        confirm === 'approve'
                            ? movedWhilePending
                                ? `Confirm ${resident?.fullName || 'this resident'} is now in ${selectedRoom?.name || 'the selected room'} and mark this request approved?`
                                : `Move ${resident?.fullName || 'this resident'} from ${fromRoom?.name || 'the current room'} to ${selectedRoom?.name || 'the selected room'}, then mark this request approved?`
                            : `Reject this request with reason: ${note.trim()}`
                    }
                    onConfirm={() => mutation.mutate(confirm)}
                    onCancel={() => setConfirm(null)}
                    busy={mutation.isPending}
                    destructive={confirm === 'reject'}
                />
            ) : null}
        </View>
    );
}

function formatDate(value?: string | null) {
    if (!value) return 'Unknown date';
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : value;
}
