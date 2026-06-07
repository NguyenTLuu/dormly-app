import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface InfoGridItemProps {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}

export default function InfoGridItem({
    label,
    value,
    icon,
    color,
    bgColor,
}: InfoGridItemProps) {
    return (
        <View className="w-1/2 flex-row items-center p-3 border-gray-100">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-[#64748B] text-xs font-bold">
                    {label}
                </Text>
                <Text
                    numberOfLines={1}
                    className="text-[#1E293B] text-sm font-bold mt-1"
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}
