import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ExportActionButtonProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export default function ExportActionButton({
    label,
    icon,
    onPress,
}: ExportActionButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className="flex-1 bg-[#2566E2] rounded-xl py-3 items-center justify-center flex-row"
        >
            <Ionicons name={icon} size={18} color="white" />
            <Text className="text-white text-sm font-bold ml-2">{label}</Text>
        </TouchableOpacity>
    );
}
