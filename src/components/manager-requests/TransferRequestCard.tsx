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
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl"
        >
            <View className="flex-row items-center">
                <ReporterAvatar initials={item.reporterAvatar} size="sm" />
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] font-bold text-lg">
                        {item.student}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                        {item.id} - {item.studentId}
                    </Text>
                </View>
                {item.decision && (
                    <View
                        className={`rounded-full px-2.5 py-1 ${item.decision === 'Approved' ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                        <Text
                            className={`text-xs font-bold ${item.decision === 'Approved' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}
                        >
                            {item.decision}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-stretch mt-4">
                <View className="flex-1 bg-[#F8FAFC] rounded-2xl p-3">
                    <View className="flex-row items-center">
                        <Ionicons
                            name="home-outline"
                            size={15}
                            color="#64748B"
                        />
                        <Text className="text-[#64748B] text-xs font-bold ml-1">
                            Current room
                        </Text>
                    </View>
                    <Text className="text-[#1E293B] text-base font-bold mt-2">
                        {item.currentRoom}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-1 leading-4">
                        {item.block} - {item.floor}
                    </Text>
                </View>

                <View className="w-10 items-center justify-center">
                    <Ionicons name="arrow-forward" size={17} color="black" />
                </View>

                <View className="flex-1 bg-indigo-50 rounded-2xl p-3">
                    <View className="flex-row items-center">
                        <Ionicons
                            name="bed-outline"
                            size={15}
                            color="#7C3AED"
                        />
                        <Text className="text-[#7C3AED] text-xs font-bold ml-1">
                            Requested room
                        </Text>
                    </View>
                    <Text className="text-[#7C3AED] text-base font-bold mt-2">
                        {item.requestedRoom}
                    </Text>
                    <Text className="text-[#6D28D9] text-xs font-semibold mt-1 leading-4">
                        {item.requestedBlock} - {item.requestedFloor}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mt-3">
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text className="text-[#64748B] text-xs font-semibold ml-1">
                    {item.submittedTime}
                </Text>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#94A3B8"
                    style={{ marginLeft: 'auto' }}
                />
            </View>
        </TouchableOpacity>
    );
}
