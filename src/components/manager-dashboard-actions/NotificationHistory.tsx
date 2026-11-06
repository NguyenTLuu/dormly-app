import {
    getNotificationLog,
    getNotificationLogs,
    type NotificationLog,
} from '@/api/notificationApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import NotificationPriorityBadge from '@/components/NotificationPriorityBadge';
import {
    notificationPalette,
    parseNotificationPriority,
} from '@/utils/app-notifications';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NotificationHistory() {
    const [recipientInput, setRecipientInput] = useState('');
    const [recipient, setRecipient] = useState('');
    const [channel, setChannel] = useState('All');
    const [status, setStatus] = useState('All');
    const filters = {
        ...(recipient ? { recipient } : {}),
        ...(channel !== 'All' ? { channel } : {}),
        ...(status !== 'All' ? { status } : {}),
    };
    const logs = useInfiniteQuery({
        queryKey: ['notification-logs', filters],
        queryFn: ({ pageParam }) => getNotificationLogs(filters, pageParam),
        initialPageParam: 0,
        getNextPageParam: (page) => (page.last ? undefined : page.number + 1),
    });
    const entries = logs.data?.pages.flatMap((page) => page.content) ?? [];
    return (
        <View className="gap-3">
            <View className="flex-row items-center justify-between">
                <Text className="text-slate-800 text-lg font-bold">
                    Send history ({logs.data?.pages[0]?.totalElements ?? 0})
                </Text>
                <TouchableOpacity
                    onPress={() => void logs.refetch()}
                    disabled={logs.isFetching}
                >
                    <Text className="text-blue-700 font-bold">Refresh</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-slate-500 text-xs">
                Each entry represents one recipient and channel. Server status
                does not confirm receipt or reading.
            </Text>
            <View className="flex-row gap-2">
                <TextInput
                    value={recipientInput}
                    onChangeText={setRecipientInput}
                    placeholder="Exact recipient email / identifier"
                    autoCapitalize="none"
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-slate-800"
                />
                <TouchableOpacity
                    onPress={() => setRecipient(recipientInput.trim())}
                    className="bg-blue-600 rounded-xl p-3 justify-center"
                >
                    <Text className="text-white font-bold">Filter</Text>
                </TouchableOpacity>
            </View>
            <Choices
                label="Channel"
                values={['All', 'EMAIL', 'PUSH', 'SMS', 'WEBSOCKET']}
                value={channel}
                onChange={setChannel}
            />
            <Choices
                label="Server status"
                values={['All', 'QUEUED', 'SUCCESS', 'FAILED', 'DEAD']}
                value={status}
                onChange={setStatus}
            />
            {logs.isLoading ? <ActivityIndicator color="#2563EB" /> : null}
            {logs.isError ? (
                <Text
                    onPress={() => void logs.refetch()}
                    className="bg-red-50 p-4 text-red-700 rounded-xl"
                >
                    Could not load history. Tap to retry.
                </Text>
            ) : null}
            {entries.map((entry) => (
                <LogCard key={entry.eventId} entry={entry} />
            ))}
            {!logs.isLoading && !logs.isError && entries.length === 0 ? (
                <Text className="bg-white p-5 rounded-xl text-slate-500">
                    No matching notification records.
                </Text>
            ) : null}
            {logs.hasNextPage ? (
                <TouchableOpacity
                    disabled={logs.isFetchingNextPage}
                    onPress={() => void logs.fetchNextPage()}
                    className="bg-blue-50 rounded-xl p-3 items-center"
                >
                    <Text className="text-blue-700 font-bold">
                        {logs.isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

function Choices({
    label,
    values,
    value,
    onChange,
}: {
    label: string;
    values: string[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <View className="gap-2">
            <Text className="text-slate-600 text-xs font-bold">{label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                    {values.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => onChange(item)}
                            className={
                                value === item
                                    ? 'bg-blue-600 rounded-xl px-3 py-2'
                                    : 'bg-white rounded-xl px-3 py-2'
                            }
                        >
                            <Text
                                className={
                                    value === item
                                        ? 'text-white text-xs font-bold'
                                        : 'text-slate-600 text-xs font-bold'
                                }
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function LogCard({ entry }: { entry: NotificationLog }) {
    const [expanded, setExpanded] = useState(false);
    const detail = useQuery({
        queryKey: ['notification-log', entry.eventId],
        queryFn: () => getNotificationLog(entry.eventId),
        enabled: expanded,
        staleTime: 0,
    });
    const item = detail.data ?? entry;
    const priority =
        parseNotificationPriority(item.priority) ??
        parseNotificationPriority(item.metadata?.priority);
    const palette = notificationPalette(priority);
    return (
        <View
            className="rounded-2xl p-4 border gap-2"
            style={{
                backgroundColor: palette.background,
                borderColor: palette.border,
            }}
        >
            <NotificationPriorityBadge priority={priority} />
            <TouchableOpacity
                onPress={() => setExpanded((current) => !current)}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
            >
                <Text className="text-slate-800 font-bold">
                    {entry.subject || 'Notification'}
                </Text>
                <Text className="text-slate-600 mt-1">{entry.recipient}</Text>
                <Text className="text-blue-700 text-xs font-bold mt-2">
                    {entry.channel} · {item.status}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                    {new Date(entry.createdAt).toLocaleString()}
                </Text>
                <Text className="text-blue-600 text-xs mt-2">
                    {expanded ? 'Hide details' : 'View details'}
                </Text>
            </TouchableOpacity>
            {expanded ? (
                <View className="gap-2 border-t border-slate-100 pt-3">
                    {detail.isFetching ? (
                        <ActivityIndicator color="#2563EB" />
                    ) : null}
                    {detail.isError ? (
                        <Text
                            className="text-red-700"
                            onPress={() => void detail.refetch()}
                        >
                            Could not refresh details. Tap to retry.
                        </Text>
                    ) : null}
                    <Text className="text-slate-700">
                        {item.message || 'No message'}
                    </Text>
                    <Text selectable className="text-slate-500 text-xs">
                        Event: {item.eventId}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                        Source: {item.sourceService} · Retries:{' '}
                        {item.retryCount}
                    </Text>
                    {item.processedAt ? (
                        <Text className="text-slate-500 text-xs">
                            Processed:{' '}
                            {new Date(item.processedAt).toLocaleString()}
                        </Text>
                    ) : null}
                    {item.errorMessage ? (
                        <Text selectable className="text-red-700 text-sm">
                            {item.errorMessage}
                        </Text>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}
