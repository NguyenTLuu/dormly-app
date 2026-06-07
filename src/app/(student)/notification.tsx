import SectionCard from '@/components/SectionCard';
import {
    ManagerNotification,
    NotificationPriority,
} from '@/data/manager-dashboard-actions';
import { studentNotifications } from '@/data/student-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NotificationFilter = 'All' | NotificationPriority;

const priorityStyles: Record<
    NotificationPriority,
    { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
    Normal: { color: '#2563EB', bg: '#DBEAFE', icon: 'information-circle' },
    Important: { color: '#D97706', bg: '#FEF3C7', icon: 'alert-circle' },
    Emergency: { color: '#DC2626', bg: '#FEE2E2', icon: 'warning' },
};

export default function StudentNotificationScreen() {
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState<NotificationFilter>('All');
    const [readIds, setReadIds] = useState<string[]>([]);
    const [, refreshNotifications] = useState(0);

    useFocusEffect(
        useCallback(() => {
            refreshNotifications((value) => value + 1);
        }, [])
    );

    const filteredNotifications = studentNotifications.filter(
        (notification) => filter === 'All' || notification.priority === filter
    );

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View
                className="bg-blue-600 rounded-b-2xl px-6 pb-12"
                style={{ paddingTop: insets.top + 18 }}
            >
                <Text className="text-white text-2xl font-bold">
                    Notifications
                </Text>
                <Text className="text-blue-100 text-sm mt-1">
                    Resident announcements from dormitory management
                </Text>
            </View>
            <View className="-mt-8 flex-1 px-4">
                <SectionCard className="p-1.5 flex-row">
                    {(
                        [
                            'All',
                            'Normal',
                            'Important',
                            'Emergency',
                        ] as NotificationFilter[]
                    ).map((option) => {
                        const active = filter === option;
                        return (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setFilter(option)}
                                className={`flex-1 rounded-xl py-2.5 items-center ${
                                    active ? 'bg-blue-600' : 'bg-white'
                                }`}
                            >
                                <Text
                                    className={`text-[11px] font-bold ${
                                        active ? 'text-white' : 'text-[#64748B]'
                                    }`}
                                >
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </SectionCard>
                <ScrollView
                    className="flex-1 mt-4"
                    contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredNotifications.map((notification) => (
                        <StudentNotificationCard
                            key={notification.id}
                            notification={notification}
                            read={readIds.includes(notification.id)}
                            onPress={() =>
                                setReadIds((current) =>
                                    current.includes(notification.id)
                                        ? current
                                        : [...current, notification.id]
                                )
                            }
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

function StudentNotificationCard({
    notification,
    read,
    onPress,
}: {
    notification: ManagerNotification;
    read: boolean;
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
                        {!read && (
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
                <Ionicons name="people-outline" size={14} color="#2563EB" />
                <Text className="text-[#475569] text-xs font-bold ml-1.5 flex-1">
                    {notification.audience}
                </Text>
                <Text className="text-[#94A3B8] text-[10px] font-semibold">
                    {notification.createdAt}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
