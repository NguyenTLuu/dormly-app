import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StudentStatCardProps {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    suffix?: string;
}

export default function StudentStatCard({
    label,
    value,
    icon,
    color,
    bgColor,
    suffix,
}: StudentStatCardProps) {
    return (
        <View className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 shadow-xl">
            <View className="flex-row items-center">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center mr-2"
                    style={{ backgroundColor: bgColor }}
                >
                    <Ionicons name={icon} size={18} color={color} />
                </View>
                <View className="flex-1">
                    <Text className="text-[#64748B] text-[10px] font-bold">
                        {label}
                    </Text>
                    <Text className="text-[#1E293B] text-sm font-bold mt-0.5">
                        {value}
                        {suffix && (
                            <Text className="text-[#16A34A]"> {suffix}</Text>
                        )}
                    </Text>
                </View>
            </View>
        </View>
    );
}
