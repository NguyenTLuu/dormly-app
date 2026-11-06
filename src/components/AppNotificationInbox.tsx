import FeatureInfo from '@/components/FeatureInfo';
import { ManagerHeader } from '@/components/manager-dashboard';
import { useAppNotifications } from '@/contexts/AppNotificationsContext';
import {
    notificationPalette,
    type AppInboxItem,
} from '@/utils/app-notifications';
import NotificationPriorityBadge from '@/components/NotificationPriorityBadge';
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

export default function AppNotificationInbox({
    showBack = false,
}: {
    showBack?: boolean;
}) {
    const inbox = useAppNotifications();
    const router = useRouter();
    const [unreadOnly, setUnreadOnly] = useState(false);
    const items = unreadOnly
        ? inbox.items.filter((item) => !inbox.readIds.includes(item.id))
        : inbox.items;
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Notifications"
                subtitle="Messages sent to your account"
                onBack={showBack ? () => router.back() : undefined}
            />
            <ScrollView
                className="px-4 -mt-8"
                contentContainerStyle={{ paddingBottom: 32, gap: 12 }}
                refreshControl={
                    <RefreshControl
                        refreshing={inbox.refreshing}
                        onRefresh={inbox.refresh}
                        tintColor="#2563EB"
                    />
                }
            >
                <FeatureInfo icon="notifications-outline">
                    Your in-app messages appear here. Tap a message to read it.
                    Read status is saved on this device only. Unread counts
                    cover the loaded messages; load older messages to include
                    them.
                </FeatureInfo>
                <View className="flex-row gap-3 items-center">
                    {[false, true].map((unread) => (
                        <TouchableOpacity
                            key={String(unread)}
                            onPress={() => setUnreadOnly(unread)}
                            className={
                                unreadOnly === unread
                                    ? 'bg-blue-600 rounded-xl px-4 py-3'
                                    : 'bg-white rounded-xl px-4 py-3'
                            }
                        >
                            <Text
                                className={
                                    unreadOnly === unread
                                        ? 'text-white font-bold'
                                        : 'text-slate-600 font-bold'
                                }
                            >
                                {unread
                                    ? 'Unread (' + inbox.unread + ')'
                                    : 'All'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        disabled={!inbox.readReady || inbox.unread === 0}
                        onPress={() =>
                            inbox.markRead(inbox.items.map((item) => item.id))
                        }
                    >
                        <Text className="text-blue-700 text-xs font-bold">
                            Read loaded messages
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-slate-500 text-xs">
                    {inbox.connected
                        ? 'Live updates connected'
                        : 'Automatic refresh while the app is open'}
                </Text>
                {inbox.loading ? <ActivityIndicator color="#2563EB" /> : null}
                {inbox.error ? (
                    <Text
                        onPress={inbox.refresh}
                        className="bg-red-50 rounded-xl p-4 text-red-700"
                    >
                        Could not refresh notifications. Tap to retry.
                    </Text>
                ) : null}
                {items.map((item) => (
                    <InboxCard
                        key={item.id}
                        item={item}
                        read={inbox.readIds.includes(item.id)}
                        onRead={() => inbox.markRead([item.id])}
                    />
                ))}
                {!inbox.loading && !inbox.error && items.length === 0 ? (
                    <Text className="bg-white rounded-xl p-5 text-slate-500">
                        {unreadOnly
                            ? 'No unread messages in the loaded list.'
                            : 'No notifications yet.'}
                    </Text>
                ) : null}
                {inbox.more ? (
                    <TouchableOpacity
                        disabled={inbox.loadingMore}
                        onPress={inbox.loadMore}
                        className="bg-blue-50 rounded-xl p-3 items-center"
                    >
                        <Text className="text-blue-700 font-bold">
                            {inbox.loadingMore
                                ? 'Loading...'
                                : 'Load older messages'}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </ScrollView>
        </View>
    );
}

function InboxCard({
    item,
    read,
    onRead,
}: {
    item: AppInboxItem;
    read: boolean;
    onRead: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const palette = notificationPalette(item.priority);
    return (
        <TouchableOpacity
            onPress={() => {
                setExpanded((current) => !current);
                onRead();
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            className="rounded-2xl border p-4 gap-2"
            style={{
                backgroundColor: palette.background,
                borderColor: palette.border,
            }}
        >
            <View className="flex-row items-start gap-3">
                <Text className="flex-1 font-bold text-slate-800">
                    {item.title}
                </Text>
                {!read ? (
                    <View className="w-2.5 h-2.5 mt-1 rounded-full bg-blue-600" />
                ) : null}
            </View>
            <NotificationPriorityBadge priority={item.priority} />
            <Text
                numberOfLines={expanded ? undefined : 3}
                className="text-slate-600 leading-5"
            >
                {item.message}
            </Text>
            <Text className="text-slate-400 text-xs">
                {new Date(item.createdAt).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );
}
