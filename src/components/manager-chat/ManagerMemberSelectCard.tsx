import { ManagerChatParticipant } from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ManagerChatAvatar from './ManagerChatAvatar';

interface ManagerMemberSelectCardProps {
    participant: ManagerChatParticipant;
    selected: boolean;
    onPress: () => void;
}

export default function ManagerMemberSelectCard({
    participant,
    selected,
    onPress,
}: ManagerMemberSelectCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className={`rounded-2xl p-3 border flex-row items-center ${
                selected
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-100'
            }`}
        >
            <ManagerChatAvatar participant={participant} showStatus />
            <View className="ml-3 flex-1">
                <Text className="text-[#1E293B] text-sm font-bold">
                    {participant.name}
                </Text>
                <Text className="text-[#64748B] text-xs font-semibold mt-1">
                    {participant.detail}
                </Text>
            </View>
            <View
                className={`w-6 h-6 rounded-full items-center justify-center border ${
                    selected
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                }`}
            >
                {selected && (
                    <Ionicons name="checkmark" size={16} color="white" />
                )}
            </View>
        </TouchableOpacity>
    );
}
