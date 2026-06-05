import React from 'react';
import { Text, View } from 'react-native';

interface TinyBadgeProps {
    text: string;
    type?: 'success' | 'warning' | 'danger' | 'default';
}

export default function TinyBadge({ text, type = 'default' }: TinyBadgeProps) {
    const colors = {
        success: ['#E8F5E9', '#22C55E'],
        warning: ['#FFEDD5', '#F97316'],
        danger: ['#FEE2E2', '#EF4444'],
        default: ['#E2E8F0', '#475569'],
    } as const;
    const [backgroundColor, color] = colors[type];

    return (
        <View
            className="px-2.5 py-1 rounded-full"
            style={{ backgroundColor }}
        >
            <Text className="text-[11px] font-bold" style={{ color }}>
                {text}
            </Text>
        </View>
    );
}
