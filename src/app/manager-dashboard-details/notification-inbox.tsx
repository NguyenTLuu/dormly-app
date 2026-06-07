import { ManagerHeader } from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import { NotificationPriority } from '@/data/manager-dashboard-actions';
import {
    ManagerAppNotification,
    managerAppNotifications,
} from '@/data/manager-app-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type InboxFilter = 'All' | NotificationPriority;

const priorityStyles: Record<
    NotificationPriority,
    { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
    Normal: { color: '#2563EB', bg: '#DBEAFE', icon: 'information-circle' },
    Important: { color: '#D97706', bg: '#FEF3C7', icon: 'alert-circle' },
    Emergency: { color: '#DC2626', bg: '#FEE2E2', icon: 'warning' },
};

export default function ManagerNotificationInboxScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState<InboxFilter>('All');
    const [notifications, setNotifications] = useState<
        ManagerAppNotification[]
    >(managerAppNotifications.map((item) => ({ ...item })));
    const filteredNotifications = notifications.filter((notification) => {
        return filter === 'All' || notification.priority === filter;
    });

    const markAsRead = (id: string) => {
        setNotifications((current) =>
            current.map((item) =>
                item.id === id ? { ...item, unread: false } : item
            )
        );
        const source = managerAppNotifications.find((item) => item.id === id);
        if (source) source.unread = false;
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ManagerHeader
                title="Notifications"
                subtitle="App activity and operational alerts"
                onBack={() => router.back()}
            />
            <View className="-mt-8 flex-1 px-4">
                <SectionCard className="p-1.5 flex-row">
                    {(
                        [
                            'All',
                            'Normal',
                            'Important',
                            'Emergency',
                        ] as InboxFilter[]
                    ).map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => setFilter(option)}
                            className={`flex-1 rounded-xl py-2.5 items-center ${
                                filter === option ? 'bg-blue-600' : 'bg-white'
                            }`}
                        >
                            <Text
                                className={`text-[11px] font-bold ${
                                    filter === option
                                        ? 'text-white'
                                        : 'text-[#64748B]'
                                }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </SectionCard>
                <ScrollView
                    className="flex-1 mt-4"
                    contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredNotifications.map((notification) => (
                        <ManagerNotificationCard
                            key={notification.id}
                            notification={notification}
                            onPress={() => markAsRead(notification.id)}
                        />
                    ))}
                    {filteredNotifications.length === 0 && (
                        <View className="bg-white rounded-2xl p-6 border border-gray-100 items-center">
                            <Ionicons
                                name="notifications-off-outline"
                                size={28}
                                color="#94A3B8"
                            />
                            <Text className="text-[#64748B] text-sm font-bold mt-2">
                                No notifications found.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

function ManagerNotificationCard({
    notification,
    onPress,
}: {
    notification: ManagerAppNotification;
    onPress: () => void;
}) {
    const priority = priorityStyles[notification.priority];

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl"
        >
            <View className="flex-row items-start">
                <View
                    className="w-11 h-11 rounded-full items-center justify-center"
                    style={{ backgroundColor: priority.bg }}
                >
                    <Ionicons
                        name={priority.icon}
                        size={21}
                        color={priority.color}
                    />
                </View>
                <View className="ml-3 flex-1">
                    <View className="flex-row items-start">
                        <Text className="text-[#1E293B] text-base font-bold flex-1">
                            {notification.title}
                        </Text>
                        {notification.unread && (
                            <View className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 ml-2" />
                        )}
                    </View>
                    <View
                        className="self-start rounded-full px-2.5 py-1 mt-2 flex-row items-center"
                        style={{ backgroundColor: priority.bg }}
                    >
                        <Ionicons
                            name={priority.icon}
                            size={12}
                            color={priority.color}
                        />
                        <Text
                            className="text-[10px] font-bold ml-1"
                            style={{ color: priority.color }}
                        >
                            {notification.priority}
                        </Text>
                    </View>
                    <Text className="text-[#64748B] text-sm font-medium leading-5 mt-2">
                        {notification.message}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center border-t border-gray-100 mt-3 pt-3">
                <Ionicons name="apps-outline" size={14} color="#2563EB" />
                <Text className="text-[#475569] text-xs font-bold ml-1.5 flex-1">
                    {notification.source}
                </Text>
                <Text className="text-[#94A3B8] text-[10px] font-semibold">
                    {notification.createdAt}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
