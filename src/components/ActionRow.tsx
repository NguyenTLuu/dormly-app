import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ActionRowProps {
    label: string;
    children: React.ReactNode;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    isDestructive?: boolean;
    isLast?: boolean;
}

export default function ActionRow({
    label,
    children,
    rightElement,
    onPress,
    isDestructive = false,
    isLast = false,
}: ActionRowProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`flex-row items-center py-3.5 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            <View className="w-8 items-start justify-center">{children}</View>

            <Text
                className={`flex-1 text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-[#1E293B]'}`}
            >
                {label}
            </Text>

            {rightElement && <View className="mr-2">{rightElement}</View>}

            <Entypo
                name="chevron-right"
                size={20}
                color={isDestructive ? '#EF4444' : '#94A3B8'}
            />
        </TouchableOpacity>
    );
}
