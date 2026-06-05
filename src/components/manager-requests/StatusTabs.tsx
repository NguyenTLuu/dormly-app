import { WorkStatus, statusTabs } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { requestStatusColors } from './RequestStatusPill';

interface StatusTabsProps {
    activeStatus: WorkStatus;
    counts: Record<WorkStatus, number>;
    onChange: (status: WorkStatus) => void;
}

export default function StatusTabs({
    activeStatus,
    counts,
    onChange,
}: StatusTabsProps) {
    return (
        <View className="flex-row justify-between">
            {statusTabs.map((status) => {
                const isActive = activeStatus === status;
                const config = requestStatusColors[status];

                return (
                    <TouchableOpacity
                        key={status}
                        activeOpacity={0.75}
                        onPress={() => onChange(status)}
                        className="w-[32%] rounded-xl px-2 py-3 border"
                        style={{
                            backgroundColor: isActive
                                ? config.bg
                                : '#FFFFFF',
                            borderColor: isActive ? config.color : '#F1F5F9',
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons
                                name={config.icon}
                                size={14}
                                color={isActive ? config.color : '#94A3B8'}
                            />
                            <Text
                                className="text-xs font-bold text-center ml-1"
                                style={{
                                    color: isActive
                                        ? config.color
                                        : '#64748B',
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.78}
                            >
                                {status}
                            </Text>
                        </View>
                        <Text className="text-[#1E293B] text-lg font-bold text-center mt-1">
                            {counts[status]}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
