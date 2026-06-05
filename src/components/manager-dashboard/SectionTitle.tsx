import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface SectionTitleProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function SectionTitle({ title, icon }: SectionTitleProps) {
    return (
        <View className="flex-row items-center mb-3">
            <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                <Ionicons name={icon} size={17} color="#2365E7" />
            </View>
            <Text className="font-bold ml-2 text-[#1E293B]">{title}</Text>
        </View>
    );
}
