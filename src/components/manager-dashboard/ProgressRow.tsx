import React from 'react';
import { Text, View } from 'react-native';

interface ProgressRowProps {
    label: string;
    value: string;
    percent: number;
    color?: string;
}

export default function ProgressRow({
    label,
    value,
    percent,
    color = '#2365E7',
}: ProgressRowProps) {
    return (
        <View className="py-2">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[#475569] text-sm font-semibold">
                    {label}
                </Text>
                <Text className="text-[#64748B] text-xs font-bold">
                    {value}
                </Text>
            </View>
            <View className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${Math.max(0, Math.min(percent, 100))}%`,
                        backgroundColor: color,
                    }}
                />
            </View>
        </View>
    );
}
