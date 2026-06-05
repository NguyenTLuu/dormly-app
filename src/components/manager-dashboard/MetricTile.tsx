import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface MetricTileProps {
    label: string;
    value: string;
    caption?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    className?: string;
    compact?: boolean;
    variant?: 'card' | 'row' | 'hero';
    emphasis?: boolean;
    showCaption?: boolean;
}

export default function MetricTile({
    label,
    value,
    caption,
    icon,
    color,
    bgColor,
    className,
    compact = false,
    variant = 'card',
    emphasis = false,
    showCaption = true,
}: MetricTileProps) {
    if (variant === 'hero') {
        return (
            <View
                className={`${className || 'w-full'} rounded-2xl p-5 overflow-hidden`}
                style={{ backgroundColor: color }}
            >
                <View
                    className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                    style={{ backgroundColor: 'white' }}
                />
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-white/80 text-xs font-bold uppercase">
                            {label}
                        </Text>
                        <Text className="text-white text-4xl font-bold mt-2">
                            {value}
                        </Text>
                    </View>
                    <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                        <Ionicons name={icon} size={30} color="white" />
                    </View>
                </View>
            </View>
        );
    }

    if (variant === 'row') {
        return (
            <View
                className={`${className || 'w-full'} bg-white rounded-2xl ${emphasis ? 'p-4' : 'p-3.5'} border border-gray-100 shadow-sm shadow-gray-200`}
            >
                <View className="flex-row items-center">
                    <View
                        className={`${emphasis ? 'w-12 h-12' : 'w-10 h-10'} rounded-full items-center justify-center`}
                        style={{ backgroundColor: bgColor }}
                    >
                        <Ionicons
                            name={icon}
                            size={emphasis ? 24 : 20}
                            color={color}
                        />
                    </View>

                    <View className="flex-1 ml-3">
                        <Text
                            className="text-[#1E293B] text-sm font-bold"
                            numberOfLines={1}
                        >
                            {label}
                        </Text>
                        <Text
                            className="text-[#64748B] text-xs font-medium mt-1 leading-4"
                            numberOfLines={2}
                        >
                            {caption}
                        </Text>
                    </View>

                    <Text
                        className={`${emphasis ? 'text-3xl' : 'text-2xl'} text-[#1E293B] font-bold ml-3 text-right`}
                        numberOfLines={1}
                    >
                        {value}
                    </Text>
                </View>
            </View>
        );
    }

    if (compact) {
        return (
            <View
                className={`${className || 'w-[31.5%]'} bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shadow-gray-200 min-h-[118px]`}
            >
                <View className="flex-row items-center justify-between">
                    <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                    >
                        <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <Text
                        className="text-[#1E293B] text-2xl font-bold ml-2 text-right mr-2"
                        numberOfLines={1}
                    >
                        {value}
                    </Text>
                </View>
                <Text
                    className="text-[#1E293B] text-sm font-bold mt-3"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.86}
                >
                    {label}
                </Text>
                {showCaption && caption && (
                    <Text
                        className="text-[#94A3B8] text-[11px] font-medium mt-1 leading-4"
                        numberOfLines={2}
                    >
                        {caption}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View
            className={`${className || 'w-[48%]'} bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-200`}
        >
            <View className="flex-row items-start">
                <View
                    className="w-11 h-11 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: bgColor }}
                >
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <View className="flex-1">
                    <Text
                        className="text-[#64748B] text-xs font-semibold"
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                    <Text
                        className="text-[#1E293B] text-2xl font-bold mt-1"
                        numberOfLines={1}
                    >
                        {value}
                    </Text>
                </View>
            </View>
            {showCaption && caption && (
                <Text
                    className="text-[#94A3B8] text-[11px] font-medium mt-3 leading-4"
                    numberOfLines={2}
                >
                    {caption}
                </Text>
            )}
        </View>
    );
}
