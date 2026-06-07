import { NotificationPriority } from '@/data/manager-dashboard-actions';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const priorityOptions: {
    value: NotificationPriority;
    color: string;
    backgroundColor: string;
}[] = [
    { value: 'Normal', color: '#2563EB', backgroundColor: '#DBEAFE' },
    { value: 'Important', color: '#D97706', backgroundColor: '#FEF3C7' },
    { value: 'Emergency', color: '#DC2626', backgroundColor: '#FEE2E2' },
];

interface NotificationPrioritySelectorProps {
    value: NotificationPriority;
    onChange: (value: NotificationPriority) => void;
}

export default function NotificationPrioritySelector({
    value,
    onChange,
}: NotificationPrioritySelectorProps) {
    return (
        <View>
            <Text className="text-[#475569] text-xs font-bold mb-1.5">
                Priority
            </Text>
            <View className="flex-row gap-2">
                {priorityOptions.map((option) => {
                    const selected = value === option.value;

                    return (
                        <TouchableOpacity
                            key={option.value}
                            activeOpacity={0.75}
                            onPress={() => onChange(option.value)}
                            className="flex-1 rounded-xl py-3 border items-center"
                            style={{
                                backgroundColor: selected
                                    ? option.backgroundColor
                                    : '#FFFFFF',
                                borderColor: selected
                                    ? option.color
                                    : '#E2E8F0',
                            }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{
                                    color: selected
                                        ? option.color
                                        : '#64748B',
                                }}
                            >
                                {option.value}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
