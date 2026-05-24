import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type BadgeType = 'success' | 'warning' | 'danger' | 'default';

interface StatusBadgeProps {
    text: string;
    type?: BadgeType;
}

export default function StatusBadge({
    text,
    type = 'success',
}: StatusBadgeProps) {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';
    let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline';
    let iconColor = '#4B5563';

    if (type === 'success') {
        bgColor = 'bg-[#E8F5E9]';
        textColor = 'text-[#22C55E]';
        iconName = 'checkmark-circle-outline';
        iconColor = '#22C55E';
    } else if (type === 'danger') {
        bgColor = 'bg-[#FEE2E2]';
        textColor = 'text-[#EF4444]';
        iconName = 'close-circle-outline';
        iconColor = '#EF4444';
    } else if (type === 'warning') {
        bgColor = 'bg-[#FFEDD5]';
        textColor = 'text-[#F97316]';
        iconName = 'warning-outline';
        iconColor = '#F97316';
    }

    return (
        <View
            className={`${bgColor} flex-row items-center px-2 py-1 rounded-full`}
        >
            <Ionicons name={iconName} size={14} color={iconColor} />
            <Text className={`${textColor} text-[11px] font-bold ml-1`}>
                {text}
            </Text>
        </View>
    );
}
