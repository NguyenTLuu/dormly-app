import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AdminHeaderProps {
    title: string;
    subtitle: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export default function AdminHeader({
    title,
    subtitle,
    onBack,
    rightAction,
}: AdminHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="bg-blue-600 rounded-b-3xl px-5 pb-9"
            style={{ paddingTop: insets.top + 20 }}
        >
            <View className="flex-row items-center min-h-11">
                {onBack ? (
                    <TouchableOpacity
                        onPress={onBack}
                        className="w-10 h-10 rounded-full border border-white/40 items-center justify-center"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                ) : null}
                <View className={`flex-1 ${onBack ? 'ml-3' : ''}`}>
                    <Text
                        numberOfLines={1}
                        className="text-white text-2xl font-bold"
                    >
                        {title}
                    </Text>
                    <Text
                        numberOfLines={1}
                        className="text-blue-100 text-xs mt-0.5"
                    >
                        {subtitle}
                    </Text>
                </View>
                {rightAction ? (
                    <View className="ml-3">{rightAction}</View>
                ) : null}
            </View>
        </View>
    );
}
