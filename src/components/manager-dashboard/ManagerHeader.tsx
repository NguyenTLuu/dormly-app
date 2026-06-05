import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ManagerHeaderProps {
    title: string;
    subtitle: string;
    onBack?: () => void;
}

export default function ManagerHeader({
    title,
    subtitle,
    onBack,
}: ManagerHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="bg-blue-600 rounded-b-2xl px-5 pb-12"
            style={{ paddingTop: insets.top + 20 }}
        >
            <View className="flex-row items-center">
                {onBack && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onBack}
                        className="w-9 h-9 rounded-full bg-white/20 items-center justify-center mr-3"
                    >
                        <Ionicons name="chevron-back" size={22} color="white" />
                    </TouchableOpacity>
                )}
                <View className="flex-1">
                    <Text className="text-white text-2xl font-bold">
                        {title}
                    </Text>
                    <Text className="text-blue-100 text-sm mt-1">
                        {subtitle}
                    </Text>
                </View>
            </View>
        </View>
    );
}
