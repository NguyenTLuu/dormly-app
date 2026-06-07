import { WorkRequest } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ReporterAvatar from './ReporterAvatar';

interface WorkRequestCardProps {
    item: WorkRequest;
    onPress: (item: WorkRequest) => void;
}

const priorityColor: Record<string, string> = {
    Low: '#22C55E',
    Medium: '#2566E2',
    Urgent: '#EF4444',
};

export default function WorkRequestCard({
    item,
    onPress,
}: WorkRequestCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onPress(item)}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl"
        >
            <View className="flex-row items-start">
                <View className="flex-1">
                    <Text className="text-[#1E293B] font-bold text-lg">
                        {item.title}
                    </Text>
                    <View className="self-start bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mt-2">
                        <Text className="text-[#2566E2] text-sm font-bold">
                            {item.block} - {item.floor} - Room {item.room}
                        </Text>
                    </View>
                    <Text className="text-[#64748B] text-sm font-medium mt-2">
                        {item.id} - {item.reportedAt}
                    </Text>
                </View>
                <View
                    className="px-2.5 py-1 rounded-full flex-row items-center"
                    style={{
                        backgroundColor: `${priorityColor[item.priority]}18`,
                    }}
                >
                    <Ionicons
                        name="flag-outline"
                        size={13}
                        color={priorityColor[item.priority]}
                    />
                    <Text
                        className="text-xs font-bold ml-1"
                        style={{ color: priorityColor[item.priority] }}
                    >
                        {item.priority}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center mt-4">
                <ReporterAvatar initials={item.reporterAvatar} size="sm" />
                <View className="flex-1 ml-2">
                    <Text className="text-[#1E293B] text-sm font-bold">
                        {item.reportedBy}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                        {item.reportedTime}
                    </Text>
                </View>
                {item.rating && (
                    <View className="flex-row items-center">
                        <Ionicons name="star" size={14} color="#FACC15" />
                        <Text className="text-[#1E293B] text-sm font-bold ml-1">
                            {item.rating}/5
                        </Text>
                    </View>
                )}
            </View>
            <View className="flex-row items-center mt-3">
                <Ionicons name="person-outline" size={15} color="#64748B" />
                <Text className="text-[#64748B] text-sm font-semibold ml-1">
                    {item.assignee || 'Unassigned'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
