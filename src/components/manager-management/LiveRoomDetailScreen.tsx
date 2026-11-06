import { deleteManagedNode } from '@/api/roomManagementApi';
import { ManagerHeader } from '@/components/manager-dashboard';
import {
    useRefreshRoomManagement,
    useRoomManagement,
} from '@/hooks/useRoomManagement';
import {
    activeAssignment,
    effectiveGender,
    isRoom,
    nodePath,
} from '@/utils/room-management';
import { useMutation } from '@tanstack/react-query';
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
import BuildingNodeEditor from './BuildingNodeEditor';
import RoomAssignmentEditor from './RoomAssignmentEditor';
import ResidentAssignments from './ResidentAssignments';
import {
    ManagementButton,
    ManagementConfirm,
    ManagementQueryState,
} from './ManagementFormControls';
import { managementError } from './managementError';

export default function LiveRoomDetailScreen() {
    const { code } = useLocalSearchParams<{ code: string }>();
    const router = useRouter();
    const query = useRoomManagement();
    const refresh = useRefreshRoomManagement();
    const data = query.data;
    const node = data?.nodes.find((item) => item.id === code);
    const [editing, setEditing] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [history, setHistory] = useState(false);
    const assignments =
        data?.assignments.filter((item) => item.roomNodeId === node?.id) ?? [];
    const current = assignments.filter((item) =>
        activeAssignment(item, data?.asOf)
    );
    const children =
        data?.nodes.filter((item) => item.parentId === node?.id) ?? [];
    const canDelete =
        !children.length &&
        !assignments.length &&
        !(node?.currentOccupancy && node.currentOccupancy > 0);
    const remove = useMutation({
        mutationFn: () => deleteManagedNode(node!.id),
        onSuccess: async () => {
            setDeleting(false);
            await refresh();
            toast.success('Location deleted');
            router.back();
        },
        onError: (error) =>
            toast.error(
                managementError(error, 'Could not delete this location')
            ),
    });
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title={node?.name || 'Location Detail'}
                subtitle="Room information and assignments"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 36, gap: 14 }}
                refreshControl={
                    <RefreshControl
                        refreshing={query.isRefetching}
                        onRefresh={() => void query.refetch()}
                        tintColor="#2563EB"
                    />
                }
            >
                <ManagementQueryState
                    loading={query.isLoading}
                    error={query.isError}
                    retry={() => void query.refetch()}
                />
                {!query.isLoading && !query.isError && !node ? (
                    <Text className="text-slate-600 bg-white p-5 rounded-2xl">
                        Location not found.
                    </Text>
                ) : null}
                {node && data ? (
                    <>
                        <View className="bg-white border border-slate-100 rounded-2xl p-5 gap-3">
                            <Text className="text-slate-800 font-bold text-xl">
                                {node.name}
                            </Text>
                            <Text className="text-slate-500">
                                {nodePath(node, data)}
                            </Text>
                            <Text className="text-slate-700">
                                Type:{' '}
                                {data.nodeTypes.find(
                                    (item) => item.id === node.nodeTypeId
                                )?.name || 'Unknown'}
                            </Text>
                            <Text className="text-slate-700">
                                Status: {node.status || 'Not set'}
                            </Text>
                            <Text className="text-slate-700">
                                Gender policy:{' '}
                                {effectiveGender(node, data) ||
                                    'No restriction'}
                            </Text>
                            {isRoom(node, data) ? (
                                <Text className="text-blue-700 font-bold">
                                    {current.length}/{node.maxCapacity ?? '—'}{' '}
                                    current residents
                                </Text>
                            ) : null}
                            {node.description ? (
                                <Text className="text-slate-600">
                                    {node.description}
                                </Text>
                            ) : null}
                            <ManagementButton
                                label="Edit location"
                                onPress={() => setEditing(true)}
                            />
                            {isRoom(node, data) ? (
                                <ManagementButton
                                    label="Assign resident"
                                    onPress={() => setAssigning(true)}
                                />
                            ) : null}
                            <TouchableOpacity
                                disabled={!canDelete}
                                onPress={() => setDeleting(true)}
                                className="p-3 items-center"
                            >
                                <Text
                                    className={
                                        canDelete
                                            ? 'text-red-600 font-bold'
                                            : 'text-slate-400'
                                    }
                                >
                                    Delete location
                                </Text>
                            </TouchableOpacity>
                            {!canDelete ? (
                                <Text className="text-slate-500 text-xs">
                                    Locations with child locations, occupancy,
                                    or assignment history cannot be deleted
                                    here. Disable the location to retain its
                                    records.
                                </Text>
                            ) : null}
                        </View>
                        {children.length ? (
                            <View className="bg-white rounded-2xl p-4 gap-3">
                                <Text className="text-slate-800 font-bold">
                                    Child locations
                                </Text>
                                {children.map((child) => (
                                    <TouchableOpacity
                                        key={child.id}
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    '/manager-details/room/[code]',
                                                params: { code: child.id },
                                            })
                                        }
                                    >
                                        <Text className="text-blue-600 font-semibold">
                                            {child.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}
                        {isRoom(node, data) ? (
                            <>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-slate-800 font-bold text-lg">
                                        {history
                                            ? 'Assignment history'
                                            : 'Current residents'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setHistory(!history)}
                                    >
                                        <Text className="text-blue-600 font-semibold">
                                            {history
                                                ? 'Current only'
                                                : 'View history'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <ResidentAssignments
                                    data={data}
                                    assignments={
                                        history ? assignments : current
                                    }
                                />
                            </>
                        ) : null}
                    </>
                ) : null}
            </ScrollView>
            {node && data && editing ? (
                <BuildingNodeEditor
                    data={data}
                    node={node}
                    onClose={() => setEditing(false)}
                />
            ) : null}
            {node && data && assigning ? (
                <RoomAssignmentEditor
                    data={data}
                    initialRoomId={node.id}
                    onClose={() => setAssigning(false)}
                />
            ) : null}
            {node && deleting ? (
                <ManagementConfirm
                    title="Delete location?"
                    message={`Delete ${node.name}? This action removes the location from the database.`}
                    destructive
                    busy={remove.isPending}
                    onConfirm={() => remove.mutate()}
                    onCancel={() => setDeleting(false)}
                />
            ) : null}
        </View>
    );
}
