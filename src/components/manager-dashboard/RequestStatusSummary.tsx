import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface RequestStatusSummaryProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    backgroundColor: string;
    pending: number;
    inProgress: number;
}

export default function RequestStatusSummary({
    title,
    icon,
    color,
    backgroundColor,
    pending,
    inProgress,
}: RequestStatusSummaryProps) {
    return (
        <View className="flex-1 rounded-xl border border-gray-100 p-3">
            <View className="flex-row items-center">
                <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor }}
                >
                    <Ionicons name={icon} size={17} color={color} />
                </View>
                <Text className="text-[#1E293B] text-sm font-bold ml-2">
                    {title}
                </Text>
            </View>
            <View className="flex-row mt-3 gap-2">
                <View className="flex-1 rounded-lg bg-[#FFF7ED] p-2">
                    <Text className="text-[#9A3412] text-[11px] font-bold">
                        Pending
                    </Text>
                    <Text className="text-[#1E293B] text-xl font-bold mt-0.5">
                        {pending}
                    </Text>
                </View>
                <View className="flex-1 rounded-lg bg-[#EFF6FF] p-2">
                    <Text className="text-[#1D4ED8] text-[11px] font-bold">
                        In progress
                    </Text>
                    <Text className="text-[#1E293B] text-xl font-bold mt-0.5">
                        {inProgress}
                    </Text>
                </View>
            </View>
        </View>
    );
}
