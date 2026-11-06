import { assignResident, getRoomManagementData } from '@/api/roomManagementApi';
import { useAuth } from '@/auth/AuthContext';
import { useRefreshRoomManagement } from '@/hooks/useRoomManagement';
import type { RoomManagementData } from '@/types/roomManagement';
import {
    activeAssignment,
    effectiveGender,
    hasAssignmentCapacity,
    isResidentRole,
    isRoom,
    localDateTime,
    nodePath,
    parseAssignmentDate,
    roomAllowsAssignment,
} from '@/utils/room-management';
import {
    backendCanAutoAssign,
    chooseAutomaticRoom,
} from '@/utils/automatic-room';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import {
    ManagementButton,
    ManagementChoice,
    ManagementInput,
    ManagementSheet,
} from './ManagementFormControls';
import { managementError } from './managementError';

export default function RoomAssignmentEditor({
    data,
    initialUserId,
    initialRoomId,
    onClose,
}: {
    data: RoomManagementData;
    initialUserId?: string;
    initialRoomId?: string;
    onClose: () => void;
}) {
    const { session } = useAuth();
    const refresh = useRefreshRoomManagement();
    const [userId, setUserId] = useState(initialUserId || '');
    const [roomId, setRoomId] = useState(initialRoomId || '');
    const [mode, setMode] = useState('MANUAL');
    const [start, setStart] = useState(localDateTime().slice(0, 16));
    const [end, setEnd] = useState('');
    const [notes, setNotes] = useState('');
    const [contractUrl, setContractUrl] = useState('');
    const resident = data.users.find((item) => item.id === userId);
    const current = data.assignments.find(
        (item) => item.userId === userId && activeAssignment(item, data.asOf)
    );
    const currentRoom = data.nodes.find(
        (item) => item.id === current?.roomNodeId
    );
    const rooms = data.nodes.filter(
        (item) => isRoom(item, data) && roomAllowsAssignment(item)
    );
    const selectedRoom = rooms.find((item) => item.id === roomId);
    const mutation = useMutation({
        mutationFn: async () => {
            const automatic = mode === 'AUTO';
            const startDate = automatic
                ? localDateTime()
                : parseAssignmentDate(start)!;
            const endDate = end.trim() ? parseAssignmentDate(end)! : undefined;
            if (endDate && endDate <= startDate)
                throw new Error('The assignment end must be after the start.');
            const input = {
                userId,
                startDate,
                endDate,
                assignedBy: session?.email,
                notes: notes.trim() || undefined,
                contractUrl: contractUrl.trim() || undefined,
            };
            if (!automatic)
                return assignResident({ ...input, roomNodeId: roomId }, false);
            const latest = await getRoomManagementData();
            const chosen = chooseAutomaticRoom(
                latest,
                userId,
                startDate,
                endDate
            );
            if (!chosen)
                throw new Error(
                    'No compatible room has available capacity. Check room status, capacity, gender policy, and scheduled stays.'
                );
            if (
                backendCanAutoAssign(latest, userId) &&
                (!chosen.status ||
                    ['ACTIVE', 'AVAILABLE', 'VACANT', 'OPEN'].includes(
                        chosen.status.toUpperCase()
                    ))
            ) {
                return assignResident(input, true);
            }
            // Legacy ENABLE rooms are omitted by the backend auto query. Manual
            // assignment also correctly decrements an existing room's counter.
            return assignResident({ ...input, roomNodeId: chosen.id }, false);
        },
        onSuccess: async (assignment) => {
            await refresh();
            const room = data.nodes.find(
                (item) => item.id === assignment.roomNodeId
            );
            toast.success(`Assigned to ${room?.name || 'room'}`);
            onClose();
        },
        onError: (error) =>
            toast.error(
                error instanceof Error && !('response' in error)
                    ? error.message
                    : managementError(error, 'Could not assign this resident')
            ),
    });
    const submit = () => {
        const startDate =
            mode === 'AUTO' ? localDateTime() : parseAssignmentDate(start);
        const endDate = end.trim() ? parseAssignmentDate(end) : undefined;
        if (!resident?.isActive || !isResidentRole(resident.roles)) {
            toast.error('Choose an active resident account');
            return;
        }
        if (
            !startDate ||
            (end.trim() && !endDate) ||
            (endDate && endDate <= startDate)
        ) {
            toast.error('Enter valid dates; end must be after start');
            return;
        }
        if (endDate && new Date(endDate).getTime() <= data.asOf) {
            toast.error('The assignment end must be in the future');
            return;
        }
        if (
            mode === 'AUTO' &&
            !chooseAutomaticRoom(data, userId, startDate, endDate || undefined)
        ) {
            toast.error(
                'No compatible room is available. Check status, capacity, gender policy, and scheduled stays.'
            );
            return;
        }
        if (mode === 'MANUAL') {
            if (!selectedRoom) {
                toast.error('Choose an available room');
                return;
            }
            if (!selectedRoom.maxCapacity || selectedRoom.maxCapacity <= 0) {
                toast.error('Set the room capacity before assigning residents');
                return;
            }
            if (current?.roomNodeId === roomId) {
                toast.error(
                    'This resident already occupies this room. Choose another room to move them.'
                );
                return;
            }
            if (
                !hasAssignmentCapacity(
                    data.assignments,
                    roomId,
                    userId,
                    startDate,
                    endDate || undefined,
                    selectedRoom.maxCapacity
                )
            ) {
                toast.error('This room is full during the requested stay');
                return;
            }
            const policy = effectiveGender(selectedRoom, data);
            if (
                policy &&
                policy !== 'MIXED' &&
                resident.gender &&
                resident.gender !== policy
            ) {
                toast.error('Resident gender does not match this room policy');
                return;
            }
        }
        if (
            contractUrl.trim() &&
            !/^https?:\/\/\S+$/i.test(contractUrl.trim())
        ) {
            toast.error('Enter an http or https contract URL');
            return;
        }
        mutation.mutate();
    };
    return (
        <ManagementSheet
            title="Assign resident to room"
            onClose={onClose}
            busy={mutation.isPending}
        >
            <ManagementChoice
                label="Resident"
                value={userId}
                disabled={mutation.isPending || Boolean(initialUserId)}
                options={data.users
                    .filter(
                        (item) => item.isActive && isResidentRole(item.roles)
                    )
                    .map((item) => ({
                        value: item.id,
                        label: `${item.fullName} · ${item.email}`,
                    }))}
                onChange={setUserId}
            />
            {currentRoom ? (
                <Text className="text-amber-700 bg-amber-50 p-3 rounded-xl">
                    Current room: {nodePath(currentRoom, data)}. Assigning
                    another room closes the previous assignment at the chosen
                    start time.
                </Text>
            ) : null}
            <ManagementChoice
                label="Assignment method"
                value={mode}
                disabled={mutation.isPending}
                onChange={setMode}
                options={[
                    { value: 'MANUAL', label: 'Choose a room' },
                    { value: 'AUTO', label: 'Automatically assign' },
                ]}
            />
            {mode === 'MANUAL' ? (
                <ManagementChoice
                    label="Room"
                    value={roomId}
                    disabled={mutation.isPending}
                    onChange={setRoomId}
                    options={rooms.map((item) => ({
                        value: item.id,
                        label: `${nodePath(item, data)} · ${data.assignments.filter((assignment) => assignment.roomNodeId === item.id && activeAssignment(assignment, data.asOf)).length}/${item.maxCapacity ?? '—'} · ${effectiveGender(item, data) || 'Any gender'}`,
                    }))}
                />
            ) : (
                <Text className="text-slate-600">
                    A compatible room is selected automatically. The backend
                    uses resident preferences when it supports the available
                    rooms; legacy ENABLE rooms and resident moves use safe room
                    selection in the app. The assignment starts immediately.
                </Text>
            )}
            {mode === 'MANUAL' ? (
                <ManagementInput
                    label="Start (YYYY-MM-DD or YYYY-MM-DDTHH:mm)"
                    value={start}
                    onChangeText={setStart}
                    autoCapitalize="none"
                />
            ) : null}
            <ManagementInput
                label="End (optional, same format)"
                value={end}
                onChangeText={setEnd}
                autoCapitalize="none"
            />
            <ManagementInput
                label="Contract URL (optional)"
                value={contractUrl}
                onChangeText={setContractUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            <ManagementInput
                label="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
            />
            <ManagementButton
                label={
                    mutation.isPending
                        ? 'Assigning...'
                        : mode === 'AUTO'
                          ? 'Automatically assign and save'
                          : 'Assign and save'
                }
                onPress={submit}
                disabled={mutation.isPending}
            />
        </ManagementSheet>
    );
}
