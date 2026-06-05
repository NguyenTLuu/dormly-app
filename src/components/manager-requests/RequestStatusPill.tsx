import { WorkStatus } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface RequestStatusPillProps {
    status: WorkStatus;
    compact?: boolean;
}

const statusConfig: Record<
    WorkStatus,
    {
        bg: string;
        color: string;
        icon: keyof typeof Ionicons.glyphMap;
    }
> = {
    Pending: {
        bg: '#FEF3C7',
        color: '#D97706',
        icon: 'time-outline',
    },
    'In Progress': {
        bg: '#DBEAFE',
        color: '#2563EB',
        icon: 'sync-outline',
    },
    Resolved: {
        bg: '#DCFCE7',
        color: '#16A34A',
        icon: 'checkmark-circle-outline',
    },
};

export default function RequestStatusPill({
    status,
    compact = false,
}: RequestStatusPillProps) {
    const config = statusConfig[status];

    return (
        <View
            className={`self-start rounded-full flex-row items-center ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'}`}
            style={{ backgroundColor: config.bg }}
        >
            <Ionicons
                name={config.icon}
                size={compact ? 13 : 15}
                color={config.color}
            />
            <Text
                className={`font-bold ml-1 ${compact ? 'text-[11px]' : 'text-xs'}`}
                style={{ color: config.color }}
            >
                {status}
            </Text>
        </View>
    );
}

export const requestStatusColors = statusConfig;
