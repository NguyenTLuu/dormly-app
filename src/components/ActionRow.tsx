import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ActionRowProps {
    label: string;
    textColor?: string;
    children?: React.ReactNode;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    isDestructive?: boolean;
    isLast?: boolean;
}

export default function ActionRow({
    label,
    textColor,
    children,
    rightElement,
    onPress,
    isDestructive = false,
    isLast = false,
}: ActionRowProps) {
    const chevronColorClass = textColor
        ? textColor
        : isDestructive
          ? '#EF4444'
          : '#94A3B8';
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`flex-row items-center  ${!isLast ? 'border-b border-gray-100 py-3.5' : 'pt-3.5 pb-2'}`}
        >
            {children && (
                <View className="w-8 items-start justify-center">
                    {children}
                </View>
            )}

            <Text
                className={`flex-1 text-sm font-bold`}
                style={{
                    color: textColor ?? (isDestructive ? '#EF4444' : '#1E293B'),
                }}
            >
                {label}
            </Text>

            {rightElement && <View className="mr-2">{rightElement}</View>}

            <Entypo name="chevron-right" size={20} color={chevronColorClass} />
        </TouchableOpacity>
    );
}
