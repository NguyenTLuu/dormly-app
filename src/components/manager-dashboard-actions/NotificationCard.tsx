import {
    ManagerNotification,
    NotificationPriority,
    NotificationStatus,
} from '@/data/manager-dashboard-actions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const statusStyle: Record<
    NotificationStatus,
    { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
    Draft: { color: '#64748B', bg: '#F1F5F9', icon: 'document-outline' },
    Scheduled: { color: '#D97706', bg: '#FEF3C7', icon: 'time-outline' },
    Sent: { color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-circle-outline' },
};

const priorityStyle: Record<
    NotificationPriority,
    { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
    Normal: { color: '#2563EB', bg: '#DBEAFE', icon: 'information-circle' },
    Important: { color: '#D97706', bg: '#FEF3C7', icon: 'alert-circle' },
    Emergency: { color: '#DC2626', bg: '#FEE2E2', icon: 'warning' },
};

interface NotificationCardProps {
    notification: ManagerNotification;
    onSend: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationCard({
    notification,
    onSend,
    onDelete,
}: NotificationCardProps) {
    const style = statusStyle[notification.status];
    const priority = priorityStyle[notification.priority];

    return (
        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
            <View className="flex-row items-start">
                <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: style.bg }}
                >
                    <Ionicons name={style.icon} size={20} color={style.color} />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {notification.title}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-2">
                        <View
                            className="rounded-full px-2.5 py-1"
                            style={{ backgroundColor: style.bg }}
                        >
                            <Text
                                className="text-[11px] font-bold"
                                style={{ color: style.color }}
                            >
                                {notification.status}
                            </Text>
                        </View>
                        <View
                            className="rounded-full px-2.5 py-1 flex-row items-center"
                            style={{ backgroundColor: priority.bg }}
                        >
                            <Ionicons
                                name={priority.icon}
                                size={12}
                                color={priority.color}
                            />
                            <Text
                                className="text-[11px] font-bold ml-1"
                                style={{ color: priority.color }}
                            >
                                {notification.priority}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-[#64748B] text-sm font-medium mt-2 leading-5">
                        {notification.message}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                <Ionicons name="people-outline" size={15} color="#2563EB" />
                <Text className="text-[#475569] text-xs font-bold ml-1.5 flex-1">
                    {notification.audience}
                </Text>
                <Text className="text-[#94A3B8] text-[11px] font-semibold">
                    {notification.createdAt}
                </Text>
            </View>
            {notification.status !== 'Sent' ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onSend(notification.id)}
                    className="bg-[#EFF6FF] rounded-xl py-2.5 mt-3 flex-row items-center justify-center"
                >
                    <Ionicons name="send-outline" size={16} color="#2563EB" />
                    <Text className="text-[#2563EB] text-sm font-bold ml-2">
                        Send now
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onDelete(notification.id)}
                    className="bg-[#FEF2F2] rounded-xl py-2.5 mt-3 flex-row items-center justify-center"
                >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                    <Text className="text-[#DC2626] text-sm font-bold ml-2">
                        Delete sent notification
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
