import {
    getManagerTickets,
    getManagerTransfers,
    ManagerTicket,
    ManagerTicketStatus,
    ManagerTransfer,
    ManagerTransferStatus,
} from '@/api/managerRequestsApi';
import { ManagerHeader } from '@/components/manager-dashboard';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type RequestGroup = 'tickets' | 'transfers';

const ticketStatuses: ManagerTicketStatus[] = [
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'REJECTED',
    'CLOSED',
];
const transferStatuses: ManagerTransferStatus[] = [
    'PENDING',
    'APPROVED',
    'REJECTED',
];

export default function RequestScreen() {
    const [group, setGroup] = useState<RequestGroup>('tickets');
    const [ticketStatus, setTicketStatus] =
        useState<ManagerTicketStatus>('OPEN');
    const [transferStatus, setTransferStatus] =
        useState<ManagerTransferStatus>('PENDING');
    const [category, setCategory] = useState('ALL');
    const [priority, setPriority] = useState('ALL');
    const tickets = useQuery({
        queryKey: ['manager-tickets'],
        queryFn: getManagerTickets,
    });
    const transfers = useQuery({
        queryKey: ['manager-transfers'],
        queryFn: getManagerTransfers,
    });
    const categories = useMemo(
        () => [
            'ALL',
            ...Array.from(
                new Set((tickets.data ?? []).map((item) => item.category))
            ),
        ],
        [tickets.data]
    );
    const ticketItems = (tickets.data ?? []).filter(
        (item) =>
            item.status === ticketStatus &&
            (category === 'ALL' || item.category === category) &&
            (priority === 'ALL' || item.priority === priority)
    );
    const transferItems = (transfers.data ?? []).filter(
        (item) => item.status === transferStatus
    );
    const loading = tickets.isLoading || transfers.isLoading;
    const error = tickets.isError || transfers.isError;

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Requests"
                subtitle="Manage tickets and room transfers"
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            tickets.isRefetching || transfers.isRefetching
                        }
                        onRefresh={() => {
                            void tickets.refetch();
                            void transfers.refetch();
                        }}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <View className="bg-white rounded-2xl p-1.5 flex-row border border-slate-100">
                    <GroupTab
                        label="Tickets"
                        icon="ticket-outline"
                        active={group === 'tickets'}
                        activeColor="#2563EB"
                        inactiveColor="#2563EB"
                        onPress={() => setGroup('tickets')}
                    />
                    <GroupTab
                        label="Transfers"
                        icon="swap-horizontal-outline"
                        active={group === 'transfers'}
                        activeColor="#7C3AED"
                        inactiveColor="#7C3AED"
                        onPress={() => setGroup('transfers')}
                    />
                </View>

                {group === 'tickets' ? (
                    <>
                        <FilterRow
                            options={categories}
                            value={category}
                            onChange={setCategory}
                        />
                        <PriorityFilterRow
                            value={priority}
                            onChange={setPriority}
                        />
                    </>
                ) : null}
                <StatusRow
                    options={
                        group === 'tickets' ? ticketStatuses : transferStatuses
                    }
                    value={group === 'tickets' ? ticketStatus : transferStatus}
                    onChange={(value) => {
                        if (group === 'tickets') {
                            setTicketStatus(value as ManagerTicketStatus);
                        } else {
                            setTransferStatus(value as ManagerTransferStatus);
                        }
                    }}
                    counts={
                        group === 'tickets'
                            ? (tickets.data ?? [])
                            : (transfers.data ?? [])
                    }
                />

                {loading ? (
                    <ActivityIndicator className="mt-8" color="#2563EB" />
                ) : null}
                {error ? (
                    <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-4">
                        <Text className="text-red-700 font-semibold">
                            Could not load requests. Ticket access currently
                            requires an ADMIN or STAFF backend role.
                        </Text>
                    </View>
                ) : null}

                <Text className="text-[#1E293B] text-lg font-bold mt-5 mb-3">
                    {group === 'tickets' ? 'Tickets' : 'Room transfer requests'}
                </Text>
                <View className="gap-3">
                    {group === 'tickets'
                        ? ticketItems.map((item) => (
                              <TicketCard key={item.id} item={item} />
                          ))
                        : transferItems.map((item) => (
                              <TransferCard key={item.id} item={item} />
                          ))}
                    {!loading &&
                    !error &&
                    (group === 'tickets' ? ticketItems : transferItems)
                        .length === 0 ? (
                        <EmptyState
                            label={
                                group === 'tickets'
                                    ? 'No tickets match this view.'
                                    : 'No room transfers match this view.'
                            }
                        />
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

function GroupTab({
    label,
    icon,
    active,
    activeColor,
    inactiveColor,
    onPress,
}: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    active: boolean;
    activeColor: string;
    inactiveColor: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-1 rounded-xl py-3 flex-row justify-center items-center"
            style={{ backgroundColor: active ? activeColor : 'transparent' }}
        >
            <Ionicons
                name={icon}
                size={18}
                color={active ? 'white' : inactiveColor}
            />
            <Text
                className={`ml-2 font-bold ${active ? 'text-white' : ''}`}
                style={active ? undefined : { color: inactiveColor }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const ticketPriorities: ManagerTicket['priority'][] = [
    'URGENT',
    'HIGH',
    'MEDIUM',
    'LOW',
];

function PriorityFilterRow({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
        >
            <View className="flex-row gap-2">
                <TouchableOpacity
                    onPress={() => onChange('ALL')}
                    className="rounded-full px-3 py-2 border"
                    style={{
                        backgroundColor:
                            value === 'ALL' ? '#E0F2FE' : '#FFFFFF',
                        borderColor: value === 'ALL' ? '#38BDF8' : '#E2E8F0',
                    }}
                >
                    <Text
                        className="text-xs font-bold"
                        style={{
                            color: value === 'ALL' ? '#0369A1' : '#64748B',
                        }}
                    >
                        All priorities
                    </Text>
                </TouchableOpacity>
                {ticketPriorities.map((option) => {
                    const palette = priorityPalette(option);
                    const active = value === option;

                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => onChange(option)}
                            className="rounded-full px-3 py-2 border"
                            style={{
                                backgroundColor: active
                                    ? palette.background
                                    : '#FFFFFF',
                                borderColor: active
                                    ? palette.border
                                    : '#E2E8F0',
                            }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{
                                    color: active ? palette.text : '#64748B',
                                }}
                            >
                                {formatLabel(option)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

function FilterRow({
    options,
    value,
    onChange,
}: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
        >
            <View className="flex-row gap-2">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onChange(option)}
                        className={`rounded-full px-3 py-2 border ${value === option ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'}`}
                    >
                        <Text
                            className={`text-xs font-bold ${value === option ? 'text-blue-700' : 'text-slate-600'}`}
                        >
                            {formatLabel(option)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

function StatusRow({
    options,
    value,
    onChange,
    counts,
}: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    counts: { status: string }[];
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
        >
            <View className="flex-row gap-2">
                {options.map((option) => {
                    const palette = statusPalette(option);
                    const active = value === option;

                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => onChange(option)}
                            className="rounded-xl px-3 py-2.5 border"
                            style={{
                                backgroundColor: active
                                    ? palette.solid
                                    : palette.background,
                                borderColor: active
                                    ? palette.solid
                                    : palette.border,
                            }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{
                                    color: active ? '#FFFFFF' : palette.text,
                                }}
                            >
                                {formatLabel(option)} ({' '}
                                {
                                    counts.filter(
                                        (item) => item.status === option
                                    ).length
                                }
                                )
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

function TicketCard({ item }: { item: ManagerTicket }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: '/admin-details/ticket/[id]',
                    params: { id: item.id },
                })
            }
            accessibilityRole="button"
            accessibilityLabel={`Open ticket ${item.code}`}
            className="bg-white rounded-2xl p-4 border border-slate-100"
        >
            <View className="flex-row items-start">
                <View className="flex-1">
                    <Text className="text-[#1E293B] font-bold text-base">
                        {item.title}
                    </Text>
                    <Text className="text-blue-600 text-xs font-bold mt-1">
                        {item.code} · {formatLabel(item.category)}
                    </Text>
                </View>
                <Pill label={formatLabel(item.priority)} type="priority" />
            </View>
            <Text className="text-[#64748B] text-sm mt-3">
                Reporter: {item.reporterName || 'Dorm resident'}
            </Text>
            <Text className="text-[#64748B] text-xs mt-1">
                {formatDate(item.createdAt)}
            </Text>
        </TouchableOpacity>
    );
}

function TransferCard({ item }: { item: ManagerTransfer }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: '/manager-details/transfer/[id]',
                    params: { id: item.id },
                })
            }
            accessibilityRole="button"
            accessibilityLabel={`Review room transfer ${item.id.slice(0, 8)}`}
            className="bg-white rounded-2xl p-4 border border-slate-100"
        >
            <View className="flex-row">
                <View className="flex-1">
                    <Text className="text-[#1E293B] font-bold text-base">
                        Room transfer request
                    </Text>
                    <Text className="text-blue-600 text-xs font-bold mt-1">
                        {item.id.slice(0, 8).toUpperCase()}
                    </Text>
                </View>
                <Pill label={formatLabel(item.status)} type="status" />
            </View>
            <Text className="text-[#475569] text-sm leading-5 mt-3">
                {item.reason}
            </Text>
            <Text className="text-[#64748B] text-xs mt-3">
                Requested {formatDate(item.createdAt)}
            </Text>
        </TouchableOpacity>
    );
}

function Pill({ label, type }: { label: string; type: 'priority' | 'status' }) {
    const value = label.toUpperCase().replace(/ /g, '_');
    const palette =
        type === 'priority' ? priorityPalette(value) : statusPalette(value);

    return (
        <View
            className="self-start rounded-full px-2.5 py-1 mt-0.5"
            style={{ backgroundColor: palette.background }}
        >
            <Text
                className="text-[10px] font-bold"
                style={{ color: palette.text }}
            >
                {label}
            </Text>
        </View>
    );
}

function priorityPalette(priority: string) {
    switch (priority) {
        case 'URGENT':
            return {
                background: '#FEE2E2',
                border: '#FCA5A5',
                text: '#B91C1C',
            };
        case 'HIGH':
            return {
                background: '#FFEDD5',
                border: '#FDBA74',
                text: '#C2410C',
            };
        case 'LOW':
            return {
                background: '#CCFBF1',
                border: '#5EEAD4',
                text: '#0F766E',
            };
        default:
            return {
                background: '#FEF3C7',
                border: '#FCD34D',
                text: '#A16207',
            };
    }
}

function statusPalette(status: string) {
    switch (status) {
        case 'OPEN':
        case 'PENDING':
            return {
                background: '#FEF3C7',
                border: '#FCD34D',
                text: '#A16207',
                solid: '#D97706',
            };
        case 'IN_PROGRESS':
            return {
                background: '#DBEAFE',
                border: '#93C5FD',
                text: '#1D4ED8',
                solid: '#2563EB',
            };
        case 'RESOLVED':
        case 'APPROVED':
            return {
                background: '#DCFCE7',
                border: '#86EFAC',
                text: '#15803D',
                solid: '#16A34A',
            };
        case 'REJECTED':
            return {
                background: '#FEE2E2',
                border: '#FCA5A5',
                text: '#B91C1C',
                solid: '#DC2626',
            };
        default:
            return {
                background: '#E2E8F0',
                border: '#CBD5E1',
                text: '#475569',
                solid: '#64748B',
            };
    }
}
function EmptyState({ label }: { label: string }) {
    return (
        <View className="bg-white rounded-2xl p-6 items-center border border-dashed border-slate-300">
            <Ionicons name="file-tray-outline" size={30} color="#94A3B8" />
            <Text className="text-slate-500 text-sm font-semibold mt-2">
                {label}
            </Text>
        </View>
    );
}
function formatLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDate(value?: string | null) {
    return value
        ? new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(new Date(value))
        : 'No date';
}
