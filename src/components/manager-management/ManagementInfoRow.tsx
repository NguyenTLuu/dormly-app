import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ManagementInfoRowProps {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
    color?: string;
    bgColor?: string;
}

export default function ManagementInfoRow({
    label,
    value,
    icon,
    color = '#2566E2',
    bgColor = '#DBEAFE',
}: ManagementInfoRowProps) {
    return (
        <View className="py-2 border-b border-gray-100 flex-row items-start">
            {icon && (
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: bgColor }}
                >
                    <Ionicons name={icon} size={17} color={color} />
                </View>
            )}
            <View className="flex-1">
                <Text className="text-[#64748B] text-xs font-bold">
                    {label}
                </Text>
                <Text className="text-[#1E293B] text-sm font-semibold mt-1">
                    {value}
                </Text>
            </View>
        </View>
    );
}
