import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ManagementSearchBarProps {
    value: string;
    onChangeText: (value: string) => void;
    onFilterPress?: () => void;
    activeFilterCount?: number;
}

export default function ManagementSearchBar({
    value,
    onChangeText,
    onFilterPress,
    activeFilterCount = 0,
}: ManagementSearchBarProps) {
    return (
        <View className="flex-row gap-2">
            <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
                <Ionicons name="search" size={19} color="#64748B" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Search name or student ID"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-2 text-[#1E293B] text-base font-semibold"
                />
            </View>
            {onFilterPress && (
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={onFilterPress}
                    className="w-14 rounded-2xl bg-white border border-gray-100 items-center justify-center"
                >
                    <Ionicons name="options-outline" size={21} color="#2563EB" />
                    {activeFilterCount > 0 && (
                        <View className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#EF4444] items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">
                                {activeFilterCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}
