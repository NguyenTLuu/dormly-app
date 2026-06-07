import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionStatusTabsProps<T extends string> {
    options: T[];
    value: T;
    counts: Record<T, number>;
    onChange: (value: T) => void;
}

export default function ActionStatusTabs<T extends string>({
    options,
    value,
    counts,
    onChange,
}: ActionStatusTabsProps<T>) {
    return (
        <View className="bg-white rounded-2xl p-1.5 flex-row border border-gray-100 shadow-sm shadow-gray-200">
            {options.map((option) => {
                const isActive = option === value;

                return (
                    <TouchableOpacity
                        key={option}
                        activeOpacity={0.75}
                        onPress={() => onChange(option)}
                        className="flex-1 rounded-xl py-2.5 items-center"
                        style={{
                            backgroundColor: isActive ? '#DBEAFE' : '#FFFFFF',
                        }}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{
                                color: isActive ? '#2563EB' : '#64748B',
                            }}
                            numberOfLines={1}
                        >
                            {option}
                        </Text>
                        <Text className="text-[#1E293B] text-base font-bold mt-0.5">
                            {counts[option]}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
