import React from 'react';
import { Text, View } from 'react-native';

interface InfoListRowProps {
    title: string;
    subtitle: string;
    value: string;
    statusColor?: string;
    isLast?: boolean;
}

export default function InfoListRow({
    title,
    subtitle,
    value,
    statusColor = '#2365E7',
    isLast = false,
}: InfoListRowProps) {
    return (
        <View
            className={`flex-row items-center py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            <View
                className="w-2.5 h-2.5 rounded-full mr-3"
                style={{ backgroundColor: statusColor }}
            />
            <View className="flex-1">
                <Text className="text-[#1E293B] text-sm font-bold">
                    {title}
                </Text>
                <Text className="text-[#64748B] text-xs font-medium mt-1">
                    {subtitle}
                </Text>
            </View>
            <Text className="text-[#334155] text-sm font-bold">{value}</Text>
        </View>
    );
}
