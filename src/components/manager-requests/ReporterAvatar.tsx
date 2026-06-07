import React from 'react';
import { Text, View } from 'react-native';

interface ReporterAvatarProps {
    initials: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function ReporterAvatar({
    initials,
    size = 'md',
}: ReporterAvatarProps) {
    const dimension =
        size === 'lg' ? 'w-20 h-20' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
    const textSize =
        size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <View
            className={`${dimension} rounded-full bg-blue-50 border border-blue-100 items-center justify-center`}
        >
            <Text className={`${textSize} text-[#2566E2] font-bold`}>
                {initials}
            </Text>
        </View>
    );
}
