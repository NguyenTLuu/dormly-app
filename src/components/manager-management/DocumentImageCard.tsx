import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface DocumentImageCardProps {
    title: string;
    code: string;
    meta: string;
    imageUri: string;
    color: string;
    bgColor: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function DocumentImageCard({
    title,
    code,
    meta,
    imageUri,
    color,
    bgColor,
    icon,
}: DocumentImageCardProps) {
    return (
        <View className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-gray-100">
            <View
                className="h-28 px-4 py-3 justify-between"
                style={{ backgroundColor: bgColor }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="w-10 h-10 rounded-xl bg-white/70 items-center justify-center">
                        <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <Text className="text-white/70 text-[10px] font-bold">
                        MOCK IMAGE
                    </Text>
                </View>
                <View>
                    <Text className="text-[#1E293B] text-base font-bold">
                        {title}
                    </Text>
                    <Text className="text-[#334155] text-xs font-semibold mt-1">
                        {code}
                    </Text>
                </View>
            </View>
            <View className="px-4 py-3">
                <Text className="text-[#64748B] text-xs font-bold">{meta}</Text>
                <Text
                    numberOfLines={1}
                    className="text-[#94A3B8] text-[10px] font-semibold mt-1"
                >
                    {imageUri}
                </Text>
            </View>
        </View>
    );
}
