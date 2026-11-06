import {
    getAuditLogFilterOptions,
    getAuditLogPage,
} from '@/api/operationalInsightsApi';
import { ManagerHeader } from '@/components/manager-dashboard';
import {
    ManagementChoice,
    ManagementSheet,
} from '@/components/manager-management/ManagementFormControls';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ManagerActivityLogScreen() {
    const router = useRouter();
    const [action, setAction] = useState('');
    const [entity, setEntity] = useState('');
    const [openSelect, setOpenSelect] = useState<'action' | 'entity' | null>(
        null
    );
    const filterOptions = useQuery({
        queryKey: ['audit-log-filter-options'],
        queryFn: getAuditLogFilterOptions,
        staleTime: 60_000,
    });
    const query = useInfiniteQuery({
        queryKey: ['audit-logs', action, entity],
        initialPageParam: 0,
        queryFn: ({ pageParam }) => getAuditLogPage(pageParam, action, entity),
        getNextPageParam: (last) =>
            last.last || last.number + 1 >= last.totalPages
                ? undefined
                : last.number + 1,
    });
    const entries = query.data?.pages.flatMap((page) => page.content) ?? [];
    const total = query.data?.pages[0]?.totalElements ?? 0;
    const refresh = () => {
        void query.refetch();
        void filterOptions.refetch();
    };
    const actionOptions = [
        { value: '', label: 'All actions' },
        ...(filterOptions.data?.actions ?? []).map((value) => ({
            value,
            label: value,
        })),
    ];
    const entityOptions = [
        { value: '', label: 'All entity types' },
        ...(filterOptions.data?.entityTypes ?? []).map((value) => ({
            value,
            label: value,
        })),
    ];
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Audit Log"
                subtitle="Recorded backend activity"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 40, gap: 14 }}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            query.isRefetching || filterOptions.isRefetching
                        }
                        onRefresh={refresh}
                    />
                }
            >
                <View className="bg-white border border-slate-100 rounded-2xl p-4 gap-3">
                    <Text className="text-slate-800 font-bold">
                        Filter audit records
                    </Text>
                    <AuditFilterSelect
                        label="Action code"
                        value={action || 'All actions'}
                        disabled={
                            filterOptions.isLoading || filterOptions.isError
                        }
                        onPress={() => setOpenSelect('action')}
                    />
                    <AuditFilterSelect
                        label="Entity type"
                        value={entity || 'All entity types'}
                        disabled={
                            filterOptions.isLoading || filterOptions.isError
                        }
                        onPress={() => setOpenSelect('entity')}
                    />
                    {filterOptions.isLoading ? (
                        <Text className="text-slate-500 text-xs">
                            Loading available filter values...
                        </Text>
                    ) : null}
                    {filterOptions.isError ? (
                        <TouchableOpacity
                            onPress={() => void filterOptions.refetch()}
                        >
                            <Text className="text-red-700 text-xs font-semibold">
                                Could not load filter values. Tap to retry.
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    <Text className="text-slate-400 text-xs">
                        Select a code to filter immediately. Values come from
                        recorded events.
                    </Text>
                </View>
                {query.isLoading ? <ActivityIndicator color="#2563EB" /> : null}
                {query.isError ? (
                    <TouchableOpacity
                        onPress={() => void query.refetch()}
                        className="bg-red-50 rounded-2xl p-4"
                    >
                        <Text className="text-red-700">
                            Could not load audit records. Tap to retry.
                        </Text>
                    </TouchableOpacity>
                ) : null}
                {query.data ? (
                    <>
                        <Text className="text-slate-700 font-bold">
                            {total} recorded events
                        </Text>
                        {entries.map((entry) => (
                            <View
                                key={entry.id}
                                className="bg-white border border-slate-100 rounded-2xl p-4 gap-1"
                            >
                                <Text className="text-slate-800 font-bold">
                                    {formatCode(entry.action)}
                                </Text>
                                <Text className="text-blue-700 text-xs font-semibold">
                                    Action code: {entry.action}
                                </Text>
                                <Text className="text-violet-700 text-xs font-semibold">
                                    Entity type: {entry.entityType || '—'}
                                </Text>
                                <Text className="text-slate-600">
                                    {entry.userFullName ||
                                        entry.userEmail ||
                                        'System'}
                                    {entry.userFullName && entry.userEmail
                                        ? ` · ${entry.userEmail}`
                                        : ''}
                                </Text>
                                {entry.entityId ? (
                                    <Text className="text-slate-500 text-sm">
                                        Entity ID: {entry.entityId}
                                    </Text>
                                ) : null}
                                <Text className="text-slate-400 text-xs">
                                    {formatDate(entry.createdAt)}
                                </Text>
                            </View>
                        ))}
                        {!entries.length ? (
                            <Text className="bg-white rounded-2xl p-5 text-slate-500">
                                No audit records match these filters.
                            </Text>
                        ) : null}
                        {query.hasNextPage ? (
                            <TouchableOpacity
                                disabled={query.isFetchingNextPage}
                                onPress={() => void query.fetchNextPage()}
                                className="bg-blue-50 rounded-xl p-3 items-center"
                            >
                                <Text className="text-blue-700 font-bold">
                                    {query.isFetchingNextPage
                                        ? 'Loading...'
                                        : 'Load more'}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </>
                ) : null}
            </ScrollView>
            {openSelect ? (
                <ManagementSheet
                    title={
                        openSelect === 'action'
                            ? 'Select action code'
                            : 'Select entity type'
                    }
                    onClose={() => setOpenSelect(null)}
                >
                    <ManagementChoice
                        label={
                            openSelect === 'action'
                                ? 'Action code'
                                : 'Entity type'
                        }
                        value={openSelect === 'action' ? action : entity}
                        options={
                            openSelect === 'action'
                                ? actionOptions
                                : entityOptions
                        }
                        onChange={(value) => {
                            if (openSelect === 'action') setAction(value);
                            else setEntity(value);
                            setOpenSelect(null);
                        }}
                    />
                </ManagementSheet>
            ) : null}
        </View>
    );
}

function AuditFilterSelect({
    label,
    value,
    disabled,
    onPress,
}: {
    label: string;
    value: string;
    disabled: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${value}`}
            className={`rounded-xl border border-slate-200 p-3 flex-row items-center justify-between ${disabled ? 'opacity-50' : ''}`}
        >
            <View>
                <Text className="text-slate-500 text-xs font-semibold">
                    {label}
                </Text>
                <Text className="text-slate-800 font-bold mt-1">{value}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
        </TouchableOpacity>
    );
}

function formatCode(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : value;
}
