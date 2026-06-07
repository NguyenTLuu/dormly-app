import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StudentRequestHeaderProps {
    title: string;
    subtitle: string;
    color: string;
}

export default function StudentRequestHeader({
    title,
    subtitle,
    color,
}: StudentRequestHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="px-4 pb-5"
            style={{ backgroundColor: color, paddingTop: insets.top + 12 }}
        >
            <View className="flex-row items-center">
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
                <View className="ml-3 flex-1 pr-2">
                    <Text className="text-white text-xl font-bold">
                        {title}
                    </Text>
                    <Text className="text-white/80 text-xs font-medium mt-0.5">
                        {subtitle}
                    </Text>
                </View>
            </View>
        </View>
    );
}
