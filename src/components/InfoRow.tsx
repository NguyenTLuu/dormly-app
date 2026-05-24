import React from 'react';
import { View, Text } from 'react-native';

interface InfoRowProps {
    label: string;
    value: string;
    children: React.ReactNode;
    isLast?: boolean;
}

export default function InfoRow({
    label,
    value,
    children,
    isLast = false,
}: InfoRowProps) {
    return (
        <View
            className={`flex-row items-center py-3.5 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            <View className="w-8 items-start justify-center">{children}</View>

            <Text className="text-[#64748B] text-sm font-medium">{label}</Text>

            <Text
                className="flex-1 text-[#1E293B] text-sm font-medium text-right ml-4"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {value}
            </Text>
        </View>
    );
}
