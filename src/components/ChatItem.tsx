import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ChatType = 'manager' | 'group' | 'roommate' | 'bot';

export interface ChatProps {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    type: ChatType;
    initials?: string;
}

export default function ChatItem({
    data,
    isLast,
    onPress,
}: {
    data: ChatProps;
    isLast: boolean;
    onPress: () => void;
}) {
    const renderAvatar = () => {
        if (data.type === 'manager') {
            return (
                <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center">
                    <MaterialCommunityIcons
                        name="shield-account"
                        size={24}
                        color="#EA580C"
                    />
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                </View>
            );
        } else if (data.type === 'group') {
            return (
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <MaterialCommunityIcons
                        name="account-group"
                        size={24}
                        color="#2563EB"
                    />
                </View>
            );
        } else if (data.type === 'bot') {
            return (
                <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center">
                    <MaterialCommunityIcons
                        name="robot-outline"
                        size={24}
                        color="#9333EA"
                    />
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                </View>
            );
        } else {
            return (
                <View className="w-12 h-12 rounded-full bg-[#EFF6FF] items-center justify-center">
                    <Text className="text-blue-600 font-bold text-[16px]">
                        {data.initials}
                    </Text>
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full" />
                </View>
            );
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            {renderAvatar()}
            <View className="flex-1 ml-3 justify-center">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[16px] font-bold text-[#1E293B]">
                        {data.name}
                    </Text>
                    <Text
                        className={`text-[12px] font-medium ${data.unreadCount > 0 ? 'text-blue-600' : 'text-[#94A3B8]'}`}
                    >
                        {data.time}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text
                        className={`text-[14px] flex-1 mr-4 ${data.unreadCount > 0 ? 'text-[#1E293B] font-semibold' : 'text-[#64748B]'}`}
                        numberOfLines={1}
                    >
                        {data.lastMessage}
                    </Text>
                    {data.unreadCount > 0 && (
                        <View className="w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">
                                {data.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
