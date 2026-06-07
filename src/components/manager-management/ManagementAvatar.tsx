import React from 'react';
import { Text, View } from 'react-native';

interface ManagementAvatarProps {
    initials: string;
    tone?: 'blue' | 'teal';
    size?: 'md' | 'lg';
}

export default function ManagementAvatar({
    initials,
    tone = 'blue',
    size = 'md',
}: ManagementAvatarProps) {
    const bg = tone === 'teal' ? 'bg-teal-50' : 'bg-blue-50';
    const border = tone === 'teal' ? 'border-teal-100' : 'border-blue-100';
    const text = tone === 'teal' ? 'text-[#0F766E]' : 'text-[#2566E2]';
    const dimension = size === 'lg' ? 'w-20 h-20' : 'w-11 h-11';
    const textSize = size === 'lg' ? 'text-xl' : 'text-sm';

    return (
        <View
            className={`${dimension} rounded-full ${bg} border ${border} items-center justify-center`}
        >
            <Text className={`${text} ${textSize} font-bold`}>{initials}</Text>
        </View>
    );
}
