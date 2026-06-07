import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface RequestDetailStatProps {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}

export default function RequestDetailStat({
    label,
    value,
    icon,
    color,
    bgColor,
}: RequestDetailStatProps) {
    return (
        <View className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 shadow-xl shadow-gray-200">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text className="text-[#64748B] text-[10px] font-bold">
                {label}
            </Text>
            <Text
                numberOfLines={1}
                className="text-[#1E293B] text-sm font-bold mt-1"
            >
                {value}
            </Text>
        </View>
    );
}
