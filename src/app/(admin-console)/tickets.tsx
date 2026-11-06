import {
    getAdminTickets,
    updateAdminTicketPriority,
    updateAdminTicketStatus,
} from '@/api/adminApi';
import { AdminHeader } from '@/components/admin';
import type {
    AdminTicket,
    AdminTicketPriority,
    AdminTicketStatus,
} from '@/types/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';

const statuses: ('ALL' | AdminTicketStatus)[] = [
    'ALL',
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'REJECTED',
    'CLOSED',
];
const priorities: ('ALL' | AdminTicketPriority)[] = [
    'ALL',
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
];

export default function AdminTicketsScreen() {
    const [filter, setFilter] = useState<(typeof statuses)[number]>('ALL');
    const [priorityFilter, setPriorityFilter] =
        useState<(typeof priorities)[number]>('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [filterVisible, setFilterVisible] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();
    const tickets = useQuery({
        queryKey: ['admin-tickets'],
        queryFn: getAdminTickets,
    });
    const refresh = () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
        ]);
    const updateStatus = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: AdminTicketStatus;
        }) =>
            updateAdminTicketStatus(
                id,
                status,
                status === 'RESOLVED' ? 'Resolved by admin review.' : undefined
            ),
        onSuccess: () => {
            toast.success('Ticket status updated');
            refresh();
        },
        onError: () => toast.error('Could not update ticket status'),
    });
    const updatePriority = useMutation({
        mutationFn: ({
            id,
            priority,
        }: {
            id: string;
            priority: AdminTicketPriority;
        }) => updateAdminTicketPriority(id, priority),
        onSuccess: () => {
            toast.success('Ticket priority updated');
            refresh();
        },
        onError: () => toast.error('Could not update ticket priority'),
    });
    const visibleTickets = useMemo(
        () =>
            (tickets.data ?? []).filter(
                (ticket) =>
                    (filter === 'ALL' || ticket.status === filter) &&
                    (priorityFilter === 'ALL' ||
                        ticket.priority === priorityFilter) &&
                    (categoryFilter === 'ALL' ||
                        ticket.category === categoryFilter)
            ),
        [categoryFilter, filter, priorityFilter, tickets.data]
    );
    const categories = Array.from(
        new Set((tickets.data ?? []).map((ticket) => ticket.category))
    );
    const countFor = (status: AdminTicketStatus) =>
        (tickets.data ?? []).filter((ticket) => ticket.status === status)
            .length;

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                title="Tickets"
                subtitle="System-wide incident administration"
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={tickets.isRefetching}
                        onRefresh={() => void tickets.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <View className="flex-row gap-2 mb-4">
                    {(
                        [
                            ['OPEN', countFor('OPEN'), 'blue'],
                            ['IN_PROGRESS', countFor('IN_PROGRESS'), 'orange'],
                            ['RESOLVED', countFor('RESOLVED'), 'green'],
                            ['REJECTED', countFor('REJECTED'), 'red'],
                            ['CLOSED', countFor('CLOSED'), 'purple'],
                        ] as const
                    ).map(([status, count, tone]) => (
                        <View
                            key={status}
                            className="flex-1 bg-white rounded-2xl border border-slate-100 p-3"
                        >
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${tone === 'blue' ? 'bg-blue-50' : tone === 'orange' ? 'bg-orange-50' : tone === 'green' ? 'bg-emerald-50' : tone === 'red' ? 'bg-red-50' : 'bg-purple-50'}`}
                            >
                                <Ionicons
                                    name={
                                        status === 'OPEN'
                                            ? 'ticket-outline'
                                            : status === 'IN_PROGRESS'
                                              ? 'time-outline'
                                              : status === 'RESOLVED'
                                                ? 'checkmark-circle-outline'
                                                : status === 'REJECTED'
                                                  ? 'close-circle-outline'
                                                  : 'lock-closed-outline'
                                    }
                                    size={17}
                                    color={
                                        tone === 'blue'
                                            ? '#2563EB'
                                            : tone === 'orange'
                                              ? '#EA580C'
                                              : tone === 'green'
                                                ? '#16A34A'
                                                : tone === 'red'
                                                  ? '#DC2626'
                                                  : '#7C3AED'
                                    }
                                />
                            </View>
                            <Text className="text-[#1E293B] text-xl font-bold mt-2">
                                {count}
                            </Text>
                            <Text className="text-slate-500 text-[9px] font-bold mt-1">
                                {status.replace('_', ' ')}
                            </Text>
                        </View>
                    ))}
                </View>
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        All tickets
                    </Text>
                    <TouchableOpacity
                        onPress={() => setFilterVisible(true)}
                        className="flex-row items-center border border-blue-200 rounded-xl bg-white px-3 py-2"
                    >
                        <Ionicons
                            name="options-outline"
                            size={17}
                            color="#2563EB"
                        />
                        <Text className="text-blue-600 text-xs font-bold ml-1">
                            Filter
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4"
                >
                    <View className="flex-row gap-2">
                        {statuses.map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => setFilter(status)}
                                className={`px-3 py-2 rounded-full ${filter === status ? 'bg-blue-600' : 'bg-white border border-slate-200'}`}
                            >
                                <Text
                                    className={`text-xs font-bold ${filter === status ? 'text-white' : 'text-slate-600'}`}
                                >
                                    {status.replace('_', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                {tickets.isLoading ? (
                    <ActivityIndicator color="#0F172A" />
                ) : null}
                {tickets.isError ? (
                    <Text className="text-red-600 font-semibold">
                        Could not load tickets.
                    </Text>
                ) : null}
                <View className="gap-3">
                    {visibleTickets.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            busy={
                                updateStatus.isPending ||
                                updatePriority.isPending
                            }
                            onStatus={(status) =>
                                updateStatus.mutate({ id: ticket.id, status })
                            }
                            onPriority={(priority) =>
                                updatePriority.mutate({
                                    id: ticket.id,
                                    priority,
                                })
                            }
                            onOpen={() =>
                                router.push(
                                    `/admin-details/ticket/${ticket.id}` as Href
                                )
                            }
                        />
                    ))}
                </View>
            </ScrollView>
            <FilterModal
                visible={filterVisible}
                status={filter}
                priority={priorityFilter}
                category={categoryFilter}
                categories={categories}
                onStatusChange={setFilter}
                onPriorityChange={setPriorityFilter}
                onCategoryChange={setCategoryFilter}
                onClose={() => setFilterVisible(false)}
            />
        </View>
    );
}

function TicketCard({
    ticket,
    onStatus,
    onPriority,
    onOpen,
    busy,
}: {
    ticket: AdminTicket;
    onStatus: (status: AdminTicketStatus) => void;
    onPriority: (priority: AdminTicketPriority) => void;
    onOpen: () => void;
    busy: boolean;
}) {
    const nextStatus: Partial<Record<AdminTicketStatus, AdminTicketStatus>> = {
        OPEN: 'IN_PROGRESS',
        IN_PROGRESS: 'RESOLVED',
        RESOLVED: 'CLOSED',
    };
    const nextPriority: Record<AdminTicketPriority, AdminTicketPriority> = {
        LOW: 'MEDIUM',
        MEDIUM: 'HIGH',
        HIGH: 'URGENT',
        URGENT: 'LOW',
    };
    return (
        <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <View className="flex-row justify-between gap-3">
                <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center mr-1">
                    <Ionicons name="ticket-outline" size={23} color="#2563EB" />
                </View>
                <View className="flex-1">
                    <Text className="text-xs font-bold text-blue-600">
                        {ticket.code}
                    </Text>
                    <Text className="text-[#1E293B] font-bold mt-1">
                        {ticket.title}
                    </Text>
                    <Text className="text-[#64748B] text-xs mt-1">
                        {ticket.category} ·{' '}
                        {ticket.reporterName || 'Unknown reporter'}
                    </Text>
                </View>
                <View className="items-end gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                </View>
            </View>
            <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-3">
                <Meta
                    icon="person-outline"
                    value={ticket.reporterName || 'Unknown reporter'}
                />
                <Meta
                    icon="calendar-outline"
                    value={
                        ticket.createdAt
                            ? formatDate(ticket.createdAt)
                            : 'No date'
                    }
                />
                {ticket.dueDate ? (
                    <Meta
                        icon="alarm-outline"
                        value={`Due ${formatDate(ticket.dueDate)}`}
                    />
                ) : null}
            </View>
            <View className="flex-row gap-2 mt-4">
                {nextStatus[ticket.status] ? (
                    <TouchableOpacity
                        disabled={busy}
                        onPress={() => onStatus(nextStatus[ticket.status]!)}
                        className="flex-1 bg-blue-600 rounded-xl py-2.5 items-center"
                    >
                        <Text className="text-white text-xs font-bold">
                            Mark {nextStatus[ticket.status]!.replace('_', ' ')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View className="flex-1 bg-slate-100 rounded-xl py-2.5 items-center">
                        <Text className="text-slate-500 text-xs font-bold">
                            Final status
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    disabled={busy}
                    onPress={() => onPriority(nextPriority[ticket.priority])}
                    className="bg-amber-50 rounded-xl px-3 py-2.5"
                >
                    <Text className="text-amber-700 text-xs font-bold">
                        {ticket.priority}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={onOpen}
                className="border-t border-slate-100 mt-3 pt-3 flex-row items-center justify-end"
            >
                <Text className="text-blue-600 text-xs font-bold">
                    View details
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#2563EB" />
            </TouchableOpacity>
        </View>
    );
}

function StatusBadge({ status }: { status: AdminTicketStatus }) {
    const style: Record<AdminTicketStatus, string> = {
        OPEN: 'bg-blue-50 text-blue-600',
        IN_PROGRESS: 'bg-orange-50 text-orange-600',
        RESOLVED: 'bg-emerald-50 text-emerald-600',
        REJECTED: 'bg-red-50 text-red-600',
        CLOSED: 'bg-purple-50 text-purple-600',
    };
    const colors = style[status].split(' ');
    return (
        <View className={`px-2.5 py-1 rounded-lg ${colors[0]}`}>
            <Text className={`text-[10px] font-bold ${colors[1]}`}>
                {status.replace('_', ' ')}
            </Text>
        </View>
    );
}

function PriorityBadge({ priority }: { priority: AdminTicketPriority }) {
    const style: Record<AdminTicketPriority, string> = {
        LOW: 'bg-emerald-50 text-emerald-600',
        MEDIUM: 'bg-orange-50 text-orange-600',
        HIGH: 'bg-red-50 text-red-600',
        URGENT: 'bg-purple-50 text-purple-600',
    };
    const colors = style[priority].split(' ');
    return (
        <View className={`px-2.5 py-1 rounded-lg ${colors[0]}`}>
            <Text className={`text-[10px] font-bold ${colors[1]}`}>
                {priority}
            </Text>
        </View>
    );
}

function Meta({
    icon,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
}) {
    return (
        <View className="flex-row items-center">
            <Ionicons name={icon} size={14} color="#64748B" />
            <Text className="text-[#64748B] text-xs ml-1">{value}</Text>
        </View>
    );
}

function FilterModal({
    visible,
    status,
    priority,
    category,
    categories,
    onStatusChange,
    onPriorityChange,
    onCategoryChange,
    onClose,
}: {
    visible: boolean;
    status: 'ALL' | AdminTicketStatus;
    priority: 'ALL' | AdminTicketPriority;
    category: string;
    categories: string[];
    onStatusChange: (value: 'ALL' | AdminTicketStatus) => void;
    onPriorityChange: (value: 'ALL' | AdminTicketPriority) => void;
    onCategoryChange: (value: string) => void;
    onClose: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-slate-900/35 justify-end">
                <View className="bg-white rounded-t-3xl px-5 pt-3 pb-8">
                    <View className="w-12 h-1.5 rounded-full bg-slate-300 self-center mb-5" />
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[#1E293B] text-xl font-bold">
                            Filter Tickets
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <FilterSection
                        title="Status"
                        values={statuses}
                        selected={status}
                        onSelect={onStatusChange}
                    />
                    <FilterSection
                        title="Priority"
                        values={priorities}
                        selected={priority}
                        onSelect={onPriorityChange}
                    />
                    <FilterSection
                        title="Category"
                        values={['ALL', ...categories]}
                        selected={category}
                        onSelect={onCategoryChange}
                    />
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-blue-600 rounded-xl py-3.5 items-center mt-5"
                    >
                        <Text className="text-white font-bold">
                            Apply Filters
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function FilterSection<T extends string>({
    title,
    values,
    selected,
    onSelect,
}: {
    title: string;
    values: T[];
    selected: T;
    onSelect: (value: T) => void;
}) {
    return (
        <View className="mt-5">
            <Text className="text-[#1E293B] font-bold mb-2">{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                    {values.map((value) => (
                        <TouchableOpacity
                            key={value}
                            onPress={() => onSelect(value)}
                            className={`px-3 py-2 rounded-xl border ${selected === value ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
                        >
                            <Text
                                className={`text-xs font-bold ${selected === value ? 'text-blue-600' : 'text-slate-600'}`}
                            >
                                {value.replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
