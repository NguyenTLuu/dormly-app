import { saveManagedNode } from '@/api/roomManagementApi';
import { useRefreshRoomManagement } from '@/hooks/useRoomManagement';
import type {
    ManagedNode,
    RoomGender,
    RoomManagementData,
} from '@/types/roomManagement';
import {
    effectiveGender,
    isRoom,
    nodeAncestors,
    nodePath,
    nodeTypeKind,
} from '@/utils/room-management';
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

export default function BuildingNodeEditor({
    data,
    node,
    onClose,
}: {
    data: RoomManagementData;
    node?: ManagedNode;
    onClose: () => void;
}) {
    const refresh = useRefreshRoomManagement();
    const [name, setName] = useState(node?.name || '');
    const [description, setDescription] = useState(node?.description || '');
    const [typeId, setTypeId] = useState(
        node?.nodeTypeId ||
            data.nodeTypes.find(
                (type) => nodeTypeKind(type, data.nodeTypes) === 'room'
            )?.id ||
            data.nodeTypes[0]?.id ||
            ''
    );
    const [parentId, setParentId] = useState(node?.parentId || '');
    const [capacity, setCapacity] = useState(
        node?.maxCapacity?.toString() || ''
    );
    const [gender, setGender] = useState(node?.genderPolicy || 'INHERIT');
    const [status, setStatus] = useState(
        node?.status ||
            (data.nodeTypes.some(
                (item) =>
                    item.id === typeId &&
                    nodeTypeKind(item, data.nodeTypes) === 'room'
            )
                ? 'ACTIVE'
                : 'ENABLE')
    );
    const type = data.nodeTypes.find((item) => item.id === typeId);
    const room = type ? nodeTypeKind(type, data.nodeTypes) === 'room' : false;
    const parentLevel = Math.max(
        ...data.nodeTypes
            .filter((item) => item.level < (type?.level ?? 0))
            .map((item) => item.level)
    );
    const needsParent = Number.isFinite(parentLevel);
    const parents = data.nodes.filter(
        (item) =>
            item.id !== node?.id &&
            !nodeAncestors(item, data.nodes).some(
                (ancestor) => ancestor.id === node?.id
            ) &&
            data.nodeTypes.find((candidate) => candidate.id === item.nodeTypeId)
                ?.level === parentLevel
    );
    const mutation = useMutation({
        mutationFn: () =>
            saveManagedNode(
                {
                    name: name.trim(),
                    description: description.trim(),
                    nodeTypeId: typeId,
                    parentId: parentId || null,
                    maxCapacity: capacity.trim() ? Number(capacity) : null,
                    genderPolicy:
                        gender === 'INHERIT' ? null : (gender as RoomGender),
                    status,
                },
                node?.id
            ),
        onSuccess: async () => {
            await refresh();
            toast.success(node ? 'Location updated' : 'Location created');
            onClose();
        },
        onError: (error) =>
            toast.error(managementError(error, 'Could not save this location')),
    });
    const submit = () => {
        if (
            !name.trim() ||
            !typeId ||
            (needsParent && !parents.some((item) => item.id === parentId))
        ) {
            toast.error('Enter a name, type, and valid parent location');
            return;
        }
        const parsedCapacity = Number(capacity);
        if (
            (room || capacity.trim()) &&
            (!Number.isSafeInteger(parsedCapacity) || parsedCapacity <= 0)
        ) {
            toast.error('Capacity must be a positive whole number');
            return;
        }
        const occupied = node
            ? data.assignments.filter(
                  (item) =>
                      item.roomNodeId === node.id &&
                      (!item.endDate ||
                          new Date(item.endDate).getTime() > data.asOf)
              ).length
            : 0;
        if (
            room &&
            parsedCapacity < Math.max(occupied, node?.currentOccupancy ?? 0)
        ) {
            toast.error(
                'Capacity cannot be lower than existing or reserved occupancy'
            );
            return;
        }
        if (node && gender !== (node.genderPolicy || 'INHERIT')) {
            const nextData = {
                ...data,
                nodes: data.nodes.map((item) =>
                    item.id === node.id
                        ? {
                              ...item,
                              genderPolicy:
                                  gender === 'INHERIT'
                                      ? null
                                      : (gender as RoomGender),
                          }
                        : item
                ),
            };
            const incompatible = data.assignments.some((assignment) => {
                if (
                    assignment.endDate &&
                    new Date(assignment.endDate).getTime() <= data.asOf
                )
                    return false;
                const assignedRoom = nextData.nodes.find(
                    (item) => item.id === assignment.roomNodeId
                );
                const resident = data.users.find(
                    (item) => item.id === assignment.userId
                );
                const policy = assignedRoom
                    ? effectiveGender(assignedRoom, nextData)
                    : null;
                const affected =
                    assignedRoom &&
                    (assignedRoom.id === node.id ||
                        nodeAncestors(assignedRoom, nextData.nodes).some(
                            (ancestor) => ancestor.id === node.id
                        ));
                return (
                    affected &&
                    policy &&
                    policy !== 'MIXED' &&
                    resident?.gender &&
                    resident.gender !== policy
                );
            });
            if (incompatible) {
                toast.error(
                    'This policy conflicts with current or scheduled residents'
                );
                return;
            }
        }
        mutation.mutate();
    };
    return (
        <ManagementSheet
            title={node ? `Edit ${node.name}` : 'Add building, floor, or room'}
            onClose={onClose}
            busy={mutation.isPending}
        >
            <ManagementInput
                label="Name"
                value={name}
                onChangeText={setName}
                maxLength={255}
            />
            <ManagementChoice
                label="Location type"
                value={typeId}
                options={data.nodeTypes.map((item) => ({
                    value: item.id,
                    label: item.name,
                }))}
                disabled={Boolean(node) || mutation.isPending}
                onChange={(value) => {
                    setTypeId(value);
                    setParentId('');
                    const selected = data.nodeTypes.find(
                        (item) => item.id === value
                    );
                    setStatus(
                        selected &&
                            nodeTypeKind(selected, data.nodeTypes) === 'room'
                            ? 'ACTIVE'
                            : 'ENABLE'
                    );
                }}
            />
            {needsParent ? (
                <ManagementChoice
                    label="Parent location"
                    value={parentId}
                    options={parents.map((item) => ({
                        value: item.id,
                        label: nodePath(item, data),
                    }))}
                    disabled={Boolean(node) || mutation.isPending}
                    onChange={setParentId}
                />
            ) : null}
            <ManagementInput
                label={room ? 'Room capacity' : 'Capacity (optional)'}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="number-pad"
            />
            <ManagementChoice
                label="Gender policy"
                value={gender}
                onChange={setGender}
                options={[
                    { value: 'INHERIT', label: 'Inherit from parent' },
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'MIXED', label: 'Mixed' },
                ]}
            />
            <ManagementChoice
                label="Status"
                value={status}
                onChange={setStatus}
                options={Array.from(
                    new Set([
                        room ? 'ACTIVE' : 'ENABLE',
                        'DISABLED',
                        ...(node?.status ? [node.status] : []),
                    ])
                ).map((value) => ({ value, label: value }))}
            />
            <ManagementInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={5000}
            />
            {node && isRoom(node, data) ? (
                <Text className="text-slate-500 text-sm">
                    Occupancy is maintained by room assignments.
                </Text>
            ) : null}
            <ManagementButton
                label={mutation.isPending ? 'Saving...' : 'Save location'}
                onPress={submit}
                disabled={mutation.isPending || !data.nodeTypes.length}
            />
        </ManagementSheet>
    );
}
