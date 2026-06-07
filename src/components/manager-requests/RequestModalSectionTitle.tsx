import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface RequestModalSectionTitleProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}

export default function RequestModalSectionTitle({
    title,
    icon,
    color,
    bgColor,
}: RequestModalSectionTitleProps) {
    return (
        <View className="flex-row items-center mb-3">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text className="text-[#1E293B] text-base font-bold">{title}</Text>
        </View>
    );
}
