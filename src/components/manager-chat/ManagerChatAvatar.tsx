import {
    ManagerConversationType,
    ManagerChatParticipant,
} from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ManagerChatAvatarProps {
    participant?: ManagerChatParticipant;
    type?: ManagerConversationType;
    size?: 'sm' | 'md' | 'lg';
    showStatus?: boolean;
}

export default function ManagerChatAvatar({
    participant,
    type = 'direct',
    size = 'md',
    showStatus = false,
}: ManagerChatAvatarProps) {
    const dimension =
        size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
    const iconSize = size === 'lg' ? 28 : size === 'sm' ? 15 : 22;
    const textSize =
        size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-[10px]' : 'text-sm';

    if (type === 'group') {
        return (
            <View
                className={`${dimension} rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center`}
            >
                <Ionicons name="people" size={iconSize} color="#4F46E5" />
            </View>
        );
    }

    const color = participant?.color ?? '#2563EB';

    return (
        <View
            className={`${dimension} rounded-full items-center justify-center border border-white`}
            style={{ backgroundColor: `${color}18` }}
        >
            <Text className={`${textSize} font-bold`} style={{ color }}>
                {participant?.initials ?? 'U'}
            </Text>
            {showStatus && (
                <View
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        participant?.online ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                />
            )}
        </View>
    );
}
