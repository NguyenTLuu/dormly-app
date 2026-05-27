import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface RoomHistoryItemProps {
    roomName: string;
    floor: string | number;
    block: string | number;
    dateRange: string;
    isLast?: boolean;
}

export default function RoomHistoryItem({
    roomName,
    floor,
    block,
    dateRange,
    isLast = false,
}: RoomHistoryItemProps) {
    return (
        <View
            className={`flex-row items-center py-3.5 ${
                !isLast ? 'border-b border-gray-100' : ''
            }`}
        >
            <View className="w-[44px] h-[44px] rounded-full bg-[#E5F0FF] items-center justify-center mr-3">
                <Image
                    source={require('@/assets/icons/door-icon.png')}
                    style={{ width: '60%', height: '60%' }}
                    contentFit="contain"
                />
            </View>

            <View className="flex-1 flex-row justify-between items-center">
                <View className="flex-col">
                    <Text className="text-[15px] font-semibold text-[#1E293B]">
                        {roomName}
                    </Text>
                    <Text className="text-[13px] text-[#64748B] mt-0.5">
                        Floor {floor} <Text className="font-bold">·</Text> Block{' '}
                        {block}
                    </Text>
                </View>

                <Text className="text-[13px] text-[#64748B] font-medium">
                    {dateRange}
                </Text>
            </View>
        </View>
    );
}
