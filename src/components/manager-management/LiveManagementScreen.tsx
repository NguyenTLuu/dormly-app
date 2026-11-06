import { ManagerHeader } from '@/components/manager-dashboard';
import { useRoomManagement } from '@/hooks/useRoomManagement';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { ManagedNode } from '@/types/roomManagement';
import {
    activeAssignment,
    effectiveGender,
    isResidentRole,
    isRoom,
    nodeAncestors,
    nodePath,
    nodeTypeKind,
} from '@/utils/room-management';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import BuildingNodeEditor from './BuildingNodeEditor';
import RoomAssignmentEditor from './RoomAssignmentEditor';
import {
    ManagementButton,
    ManagementQueryState,
} from './ManagementFormControls';

type ManagementView = 'rooms' | 'residents' | 'locations';

export default function LiveManagementScreen() {
    const router = useRouter();
    const query = useRoomManagement();
    const data = query.data;
    const [view, setView] = useState<ManagementView>('rooms');
    const [search, setSearch] = useState('');
    const searchTerm = useDebouncedValue(search, 300).trim().toLowerCase();
    const [blockId, setBlockId] = useState('');
    const [floorId, setFloorId] = useState('');
    const [editor, setEditor] = useState<ManagedNode | 'new' | null>(null);
    const [assigning, setAssigning] = useState(false);
    const rooms = data?.nodes.filter((node) => isRoom(node, data)) ?? [];
    const blocks =
        data?.nodes.filter((node) =>
            data.nodeTypes.some(
                (type) =>
                    type.id === node.nodeTypeId &&
                    nodeTypeKind(type, data.nodeTypes) === 'building'
            )
        ) ?? [];
    const floors =
        data?.nodes.filter(
            (node) =>
                data.nodeTypes.some(
                    (type) =>
                        type.id === node.nodeTypeId &&
                        nodeTypeKind(type, data.nodeTypes) === 'floor'
                ) &&
                (!blockId ||
                    nodeAncestors(node, data.nodes).some(
                        (ancestor) => ancestor.id === blockId
                    ))
        ) ?? [];
    const visibleRooms = data
        ? rooms.filter((node) => {
              const ancestors = nodeAncestors(node, data.nodes);
              return (
                  (!blockId || ancestors.some((item) => item.id === blockId)) &&
                  (!floorId || ancestors.some((item) => item.id === floorId)) &&
                  nodePath(node, data).toLowerCase().includes(searchTerm)
              );
          })
        : [];
    const residents =
        data?.users.filter(
            (user) =>
                isResidentRole(user.roles) &&
                `${user.fullName} ${user.email}`
                    .toLowerCase()
                    .includes(searchTerm)
        ) ?? [];
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Manage"
                subtitle="Rooms, locations, and resident assignments"
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 36, gap: 14 }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={query.isRefetching}
                        onRefresh={() => void query.refetch()}
                        tintColor="#2563EB"
                    />
                }
            >
                <View className="flex-row rounded-2xl bg-white border border-slate-100 p-1.5">
                    {(
                        ['rooms', 'residents', 'locations'] as ManagementView[]
                    ).map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => {
                                setView(item);
                                setSearch('');
                            }}
                            className={`flex-1 rounded-xl py-3 items-center ${view === item ? 'bg-blue-600' : ''}`}
                        >
                            <Text
                                className={`font-bold capitalize ${view === item ? 'text-white' : 'text-slate-600'}`}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <ManagementQueryState
                    loading={query.isLoading}
                    error={query.isError}
                    retry={() => void query.refetch()}
                />
                {data && !query.isError ? (
                    <>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder={
                                view === 'residents'
                                    ? 'Search resident name or email'
                                    : 'Search room or location'
                            }
                            className="bg-white rounded-xl border border-slate-200 p-3 text-slate-800"
                        />
                        <View className="flex-row gap-2">
                            <View className="flex-1">
                                <ManagementButton
                                    label="Assign resident"
                                    onPress={() => setAssigning(true)}
                                />
                            </View>
                            <View className="flex-1">
                                <ManagementButton
                                    label="Add location"
                                    onPress={() => setEditor('new')}
                                />
                            </View>
                        </View>
                        {view === 'rooms' ? (
                            <>
                                <LocationFilters
                                    label="Building / Block"
                                    value={blockId}
                                    items={blocks}
                                    onChange={(id) => {
                                        setBlockId(id);
                                        setFloorId('');
                                    }}
                                />
                                <LocationFilters
                                    label="Floor"
                                    value={floorId}
                                    items={floors}
                                    onChange={setFloorId}
                                />
                                <Text className="font-bold text-lg text-slate-800">
                                    Rooms ({visibleRooms.length})
                                </Text>
                                <View className="flex-row flex-wrap justify-between gap-y-3">
                                    {visibleRooms.map((room) => {
                                        const occupied =
                                            data.assignments.filter(
                                                (assignment) =>
                                                    assignment.roomNodeId ===
                                                        room.id &&
                                                    activeAssignment(
                                                        assignment,
                                                        data.asOf
                                                    )
                                            ).length;
                                        const full =
                                            room.maxCapacity != null &&
                                            occupied >= room.maxCapacity;
                                        return (
                                            <TouchableOpacity
                                                key={room.id}
                                                accessibilityRole="button"
                                                onPress={() =>
                                                    router.push({
                                                        pathname:
                                                            '/manager-details/room/[code]',
                                                        params: {
                                                            code: room.id,
                                                        },
                                                    })
                                                }
                                                className="w-[48%] rounded-2xl border border-slate-100 bg-white p-4"
                                            >
                                                <Ionicons
                                                    name="bed-outline"
                                                    size={23}
                                                    color={
                                                        occupied === 0
                                                            ? '#94A3B8'
                                                            : full
                                                              ? '#D97706'
                                                              : '#2563EB'
                                                    }
                                                />
                                                <Text className="text-slate-800 text-lg font-bold mt-2">
                                                    {room.name}
                                                </Text>
                                                <Text className="text-slate-500 text-xs mt-1">
                                                    {nodeAncestors(
                                                        room,
                                                        data.nodes
                                                    )
                                                        .reverse()
                                                        .map(
                                                            (item) => item.name
                                                        )
                                                        .join(' / ') ||
                                                        'No parent'}
                                                </Text>
                                                <Text className="text-blue-700 font-bold mt-3">
                                                    {occupied}/
                                                    {room.maxCapacity ?? '—'}{' '}
                                                    residents
                                                </Text>
                                                <Text className="text-slate-500 text-xs mt-1">
                                                    {effectiveGender(
                                                        room,
                                                        data
                                                    ) || 'Any gender'}{' '}
                                                    ·{' '}
                                                    {room.status || 'No status'}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {!visibleRooms.length ? (
                                    <EmptyText text="No rooms match these filters. Add a building, floor, and room to get started." />
                                ) : null}
                            </>
                        ) : view === 'residents' ? (
                            <>
                                <Text className="font-bold text-lg text-slate-800">
                                    Residents ({residents.length})
                                </Text>
                                {residents.map((user) => {
                                    const assignment = data.assignments.find(
                                        (item) =>
                                            item.userId === user.id &&
                                            activeAssignment(item, data.asOf)
                                    );
                                    const room = data.nodes.find(
                                        (item) =>
                                            item.id === assignment?.roomNodeId
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={user.id}
                                            onPress={() =>
                                                router.push({
                                                    pathname:
                                                        '/manager-details/student/[id]',
                                                    params: { id: user.id },
                                                })
                                            }
                                            className="rounded-2xl border border-slate-100 bg-white p-4"
                                        >
                                            <Text className="text-slate-800 font-bold text-base">
                                                {user.fullName}
                                            </Text>
                                            <Text className="text-slate-500 text-sm mt-1">
                                                {user.email} ·{' '}
                                                {user.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Text>
                                            <Text className="text-blue-700 text-sm mt-2">
                                                {room
                                                    ? nodePath(room, data)
                                                    : 'No current room'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                {!residents.length ? (
                                    <EmptyText text="No residents match this search." />
                                ) : null}
                            </>
                        ) : (
                            <>
                                <Text className="font-bold text-lg text-slate-800">
                                    Buildings, floors, and rooms
                                </Text>
                                {data.nodes
                                    .filter((item) =>
                                        nodePath(item, data)
                                            .toLowerCase()
                                            .includes(searchTerm)
                                    )
                                    .map((node) => (
                                        <View
                                            key={node.id}
                                            className="rounded-2xl bg-white border border-slate-100 p-4"
                                        >
                                            <Text className="text-slate-800 font-bold">
                                                {nodePath(node, data)}
                                            </Text>
                                            <Text className="text-slate-500 text-xs mt-1">
                                                {data.nodeTypes.find(
                                                    (item) =>
                                                        item.id ===
                                                        node.nodeTypeId
                                                )?.name || 'Unknown type'}{' '}
                                                · {node.status || 'No status'}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => setEditor(node)}
                                                className="mt-3"
                                            >
                                                <Text className="text-blue-600 font-bold">
                                                    Edit location
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    router.push({
                                                        pathname:
                                                            '/manager-details/room/[code]',
                                                        params: {
                                                            code: node.id,
                                                        },
                                                    })
                                                }
                                                className="mt-3"
                                            >
                                                <Text className="text-blue-600 font-bold">
                                                    View details / delete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                {!data.nodes.length ? (
                                    <EmptyText text="No locations yet. Add a building first, then its floors and rooms." />
                                ) : null}
                            </>
                        )}
                    </>
                ) : null}
            </ScrollView>
            {data && editor ? (
                <BuildingNodeEditor
                    data={data}
                    node={editor === 'new' ? undefined : editor}
                    onClose={() => setEditor(null)}
                />
            ) : null}
            {data && assigning ? (
                <RoomAssignmentEditor
                    data={data}
                    onClose={() => setAssigning(false)}
                />
            ) : null}
        </View>
    );
}

function LocationFilters({
    label,
    value,
    items,
    onChange,
}: {
    label: string;
    value: string;
    items: ManagedNode[];
    onChange: (id: string) => void;
}) {
    return (
        <View>
            <Text className="text-slate-500 text-xs mb-2">{label}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {[{ id: '', name: 'All' }, ...items].map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => onChange(item.id)}
                        className={`rounded-full border px-4 py-2 ${value === item.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
                    >
                        <Text
                            className={
                                value === item.id
                                    ? 'text-white font-bold'
                                    : 'text-slate-600 font-semibold'
                            }
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

function EmptyText({ text }: { text: string }) {
    return (
        <Text className="bg-white rounded-2xl p-5 text-slate-500">{text}</Text>
    );
}
