import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SectionCard from '@/components/SectionCard';
import NotificationItem, {
    NotificationProps,
} from '@/components/NotificationItem';

const MOCK_NOTIFICATIONS: NotificationProps[] = [
    {
        id: '1',
        title: 'Transfer Request Update',
        description: 'Your transfer request has been approved.',
        time: '10:30 AM',
        type: 'transfer',
        isUnread: true,
        isImportant: true,
        dateGroup: 'Today',
    },
    {
        id: '2',
        title: 'Maintenance Resolved',
        description:
            'Your issue "Water leakage in bathroom" has been resolved.',
        time: '9:15 AM',
        type: 'maintenance',
        isUnread: true,
        isImportant: false,
        dateGroup: 'Today',
    },
    {
        id: '3',
        title: 'New Room Announcement',
        description:
            'Study room B on Floor 3 will be closed for cleaning on May 18.',
        time: '8:00 AM',
        type: 'announcement',
        isUnread: true,
        isImportant: false,
        dateGroup: 'Today',
    },
    {
        id: '4',
        title: 'Complaint Reply',
        description:
            'Your complaint about "Internet connection" has a new reply.',
        time: '7:20 AM',
        type: 'complaint',
        isUnread: false,
        isImportant: false,
        dateGroup: 'Today',
    },
    {
        id: '5',
        title: 'Monthly Fee Reminder',
        description: 'Your May 2026 room fee is due on May 25.',
        time: 'Yesterday',
        type: 'fee',
        isUnread: false,
        isImportant: true,
        dateGroup: 'Earlier',
    },
    {
        id: '6',
        title: 'Roommate Update',
        description: 'Tran Phuoc has moved in as your new roommate.',
        time: 'Yesterday',
        type: 'roommate',
        isUnread: false,
        isImportant: false,
        dateGroup: 'Earlier',
    },
    {
        id: '7',
        title: 'Contract Renewal Reminder',
        description:
            'Your contract will expire on Jul 31, 2026. Please renew it soon.',
        time: 'May 15, 2026',
        type: 'contract',
        isUnread: false,
        isImportant: true,
        dateGroup: 'Earlier',
    },
];

export default function EdgeToEdgeScreen() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<
        'All' | 'Unread' | 'Important'
    >('All');
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const filteredData = notifications.filter((item) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Unread') return item.isUnread;
        if (activeFilter === 'Important') return item.isImportant;
        return true;
    });
    const todayItems = filteredData.filter(
        (item) => item.dateGroup === 'Today'
    );
    const earlierItems = filteredData.filter(
        (item) => item.dateGroup === 'Earlier'
    );

    const handlePressNotification = (id: string) => {
        const updatedNotifications = notifications.map(
            (noti: NotificationProps) => {
                if (noti.id === id) {
                    return { ...noti, isUnread: false };
                }
                return noti;
            }
        );

        setNotifications(updatedNotifications);
    };
    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View className="bg-white flex-1 relative">
                <View
                    className="bg-blue-600 rounded-b-2xl px-8"
                    style={{
                        paddingTop: insets.top + 16,
                        paddingBottom: 50,
                    }}
                >
                    <Text className="text-2xl text-white font-bold">
                        Notifications
                    </Text>
                    <Text className="text-white">
                        Stay update with room and dorm activity
                    </Text>
                </View>
                <View className="mx-4 -mt-8 bg-white rounded-2xl shadow-sm elevation-2 p-1.5 flex-row justify-between">
                    {(['All', 'Unread', 'Important'] as const).map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                className={`flex-1 flex-row items-center justify-center py-2.5 mx-0.5 rounded-xl ${isActive ? 'bg-blue-50 border border-blue-100' : 'bg-transparent'}`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                                >
                                    {filter}
                                </Text>

                                {/* Badge */}
                                <View
                                    className={`ml-2 px-1.5 py-0.5 rounded-full bg-blue-600 ${filter === 'Important' ? 'bg-red-500' : ''}`}
                                >
                                    <Text className="text-white text-[10px] font-bold">
                                        {filter === 'All'
                                            ? notifications.length
                                            : filter === 'Unread'
                                              ? notifications.filter(
                                                    (i) => i.isUnread
                                                ).length
                                              : notifications.filter(
                                                    (i) => i.isImportant
                                                ).length}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <ScrollView
                    className="flex-1 px-4 mt-2"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Today */}
                    {todayItems.length > 0 && (
                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium ml-1 mb-2">
                                Today
                            </Text>
                            <SectionCard className="p-0 px-4">
                                {todayItems.map((item, index) => (
                                    <NotificationItem
                                        key={item.id}
                                        data={item}
                                        isLast={index === todayItems.length - 1}
                                        onPress={() =>
                                            handlePressNotification(item.id)
                                        }
                                    />
                                ))}
                            </SectionCard>
                        </View>
                    )}

                    {/* Earlier */}
                    {earlierItems.length > 0 && (
                        <View className="mt-6 mb-6">
                            <Text className="text-gray-500 font-medium ml-1 mb-2">
                                Earlier
                            </Text>
                            <SectionCard className="p-0 px-4">
                                {earlierItems.map((item, index) => (
                                    <NotificationItem
                                        key={item.id}
                                        data={item}
                                        isLast={
                                            index === earlierItems.length - 1
                                        }
                                        onPress={() =>
                                            handlePressNotification(item.id)
                                        }
                                    />
                                ))}
                            </SectionCard>
                        </View>
                    )}

                    {/* No Notification */}
                    {filteredData.length === 0 && (
                        <View className="items-center mt-10">
                            <Text className="text-gray-400">
                                No notifications found.
                            </Text>
                        </View>
                    )}

                    <View className="h-10" />
                </ScrollView>
            </View>
        </>
    );
}
