import { TransferRoomRequest } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ReporterAvatar from './ReporterAvatar';

interface TransferRequestCardProps {
    item: TransferRoomRequest;
    onPress: (item: TransferRoomRequest) => void;
}

export default function TransferRequestCard({
    item,
    onPress,
}: TransferRequestCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onPress(item)}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-200"
        >
            <View className="flex-row items-start">
                <View className="flex-1">
                    <Text className="text-[#1E293B] font-bold text-lg">
                        {item.student}
                    </Text>
                    <Text className="text-[#64748B] text-sm font-medium mt-1">
                        {item.id} - {item.studentId}
                    </Text>
                </View>
                {item.decision && (
                    <Text
                        className={`text-sm font-bold ${item.decision === 'Approved' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}
                    >
                        {item.decision}
                    </Text>
                )}
            </View>
            <View className="flex-row items-center mt-4">
                <ReporterAvatar initials={item.reporterAvatar} size="sm" />
                <View className="flex-1 ml-2">
                    <Text className="text-[#1E293B] text-sm font-bold">
                        {item.student}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                        {item.submittedTime}
                    </Text>
                </View>
            </View>
            <View className="self-start bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mt-3">
                <View className="flex-row items-center">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {item.currentRoom}
                    </Text>
                    <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#7C3AED"
                        style={{ marginHorizontal: 8 }}
                    />
                    <Text className="text-[#7C3AED] text-base font-bold">
                        {item.requestedRoom}
                    </Text>
                </View>
            </View>
            <Text className="text-[#64748B] text-sm font-medium mt-2">
                {item.block} - {item.floor}
            </Text>
        </TouchableOpacity>
    );
}
