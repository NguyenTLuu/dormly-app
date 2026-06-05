import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DetailLinkCardProps {
    href: Href;
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    accentColor: string;
    rightText: string;
}

export default function DetailLinkCard({
    href,
    title,
    subtitle,
    icon,
    accentColor,
    rightText,
}: DetailLinkCardProps) {
    return (
        <Link href={href} asChild>
            <TouchableOpacity
                activeOpacity={0.75}
                className="flex-row items-center py-3.5 border-b border-gray-100"
            >
                <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${accentColor}18` }}
                >
                    <Ionicons name={icon} size={21} color={accentColor} />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] font-bold">{title}</Text>
                    <Text className="text-[#64748B] text-xs font-medium mt-1">
                        {subtitle}
                    </Text>
                </View>
                <Text className="text-[#2566E2] text-xs font-bold mr-2">
                    {rightText}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
        </Link>
    );
}
