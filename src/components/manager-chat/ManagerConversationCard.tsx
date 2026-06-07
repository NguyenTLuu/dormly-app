import {
    ManagerConversation,
    currentManager,
    getConversationPreview,
    getManagerChatParticipant,
} from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ManagerChatAvatar from './ManagerChatAvatar';

interface ManagerConversationCardProps {
    conversation: ManagerConversation;
    onPress: () => void;
}

export default function ManagerConversationCard({
    conversation,
    onPress,
}: ManagerConversationCardProps) {
    const directParticipant = getManagerChatParticipant(
        conversation.participantIds.find((id) => id !== currentManager.id) ?? ''
    );
    const preview = getConversationPreview(conversation);

    return (
        <TouchableOpacity
            activeOpacity={0.72}
            onPress={onPress}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center"
        >
            <ManagerChatAvatar
                participant={directParticipant}
                type={conversation.type}
                showStatus={conversation.type === 'direct'}
            />
            <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                    <Text
                        className="text-[#1E293B] text-base font-bold flex-1"
                        numberOfLines={1}
                    >
                        {conversation.name}
                    </Text>
                    <Text
                        className={`text-xs font-semibold ml-2 ${
                            conversation.unreadCount > 0
                                ? 'text-blue-600'
                                : 'text-[#94A3B8]'
                        }`}
                    >
                        {preview.time}
                    </Text>
                </View>
                <View className="flex-row items-center mt-1.5">
                    {conversation.type === 'group' && (
                        <Ionicons
                            name="people-outline"
                            size={14}
                            color="#64748B"
                        />
                    )}
                    <Text
                        className={`text-sm flex-1 ${
                            conversation.type === 'group' ? 'ml-1' : ''
                        } ${
                            conversation.unreadCount > 0
                                ? 'text-[#334155] font-semibold'
                                : 'text-[#64748B]'
                        }`}
                        numberOfLines={1}
                    >
                        {preview.text}
                    </Text>
                    {conversation.unreadCount > 0 && (
                        <View className="min-w-5 h-5 px-1 bg-blue-600 rounded-full items-center justify-center ml-2">
                            <Text className="text-white text-[10px] font-bold">
                                {conversation.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
