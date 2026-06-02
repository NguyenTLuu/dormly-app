import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5,
} from '@expo/vector-icons';

export interface NotificationProps {
    id: string;
    title: string;
    description: string;
    time: string;
    type:
        | 'transfer'
        | 'maintenance'
        | 'announcement'
        | 'complaint'
        | 'fee'
        | 'roommate'
        | 'contract';
    isUnread: boolean;
    isImportant: boolean;
    dateGroup: 'Today' | 'Earlier';
    isLast?: boolean;
}

export default function NotificationItem({
    data,
    isLast = false,
    onPress,
}: {
    data: NotificationProps;
    isLast?: boolean;
    onPress?: () => void;
}) {
    const getIconConfig = () => {
        switch (data.type) {
            case 'transfer':
                return {
                    icon: (
                        <FontAwesome5
                            name="exchange-alt"
                            size={16}
                            color="#F59E0B"
                        />
                    ),
                    bg: 'bg-orange-50',
                };
            case 'maintenance':
                return {
                    icon: (
                        <FontAwesome5 name="wrench" size={16} color="#65A30D" />
                    ),
                    bg: 'bg-green-50',
                };
            case 'announcement':
                return {
                    icon: (
                        <Ionicons name="megaphone" size={18} color="#2563EB" />
                    ),
                    bg: 'bg-blue-50',
                };
            case 'complaint':
                return {
                    icon: (
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={18}
                            color="#9333EA"
                        />
                    ),
                    bg: 'bg-purple-50',
                };
            case 'fee':
                return {
                    icon: (
                        <FontAwesome5
                            name="dollar-sign"
                            size={18}
                            color="#16A34A"
                        />
                    ),
                    bg: 'bg-green-50',
                };
            case 'roommate':
                return {
                    icon: <Ionicons name="people" size={18} color="#2563EB" />,
                    bg: 'bg-blue-50',
                };
            case 'contract':
                return {
                    icon: (
                        <Ionicons
                            name="document-text-outline"
                            size={18}
                            color="#EA580C"
                        />
                    ),
                    bg: 'bg-orange-50',
                };
            default:
                return {
                    icon: (
                        <Ionicons
                            name="notifications"
                            size={18}
                            color="#64748B"
                        />
                    ),
                    bg: 'bg-gray-100',
                };
        }
    };

    const config = getIconConfig();

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            className={`flex-row pt-4 pb-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
            onPress={onPress}
        >
            {/* Icon */}
            <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${config.bg}`}
            >
                {config.icon}
            </View>

            {/* Content */}
            <View className="flex-1 flex-col justify-center">
                <Text className="text-[15px] font-bold text-[#1E293B] mb-1">
                    {data.title}
                </Text>
                <Text className="text-[13px] text-[#64748B] leading-5 pr-2">
                    {data.description}
                </Text>
            </View>

            <View className="items-end justify-start pt-1">
                <View className="flex-row items-center">
                    <Text className="text-[12px] text-[#94A3B8] font-medium mr-1.5">
                        {data.time}
                    </Text>
                    {data.isUnread ? (
                        <View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    ) : (
                        <View className="w-2.5 h-2.5" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
