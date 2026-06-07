import { ManagementTab } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ManagementTopTabsProps {
    activeTab: ManagementTab;
    onChange: (tab: ManagementTab) => void;
}

const tabs: {
    key: ManagementTab;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
}[] = [
    {
        key: 'rooms',
        label: 'Room',
        icon: 'business-outline',
        color: '#7C3AED',
        bg: '#EDE9FE',
    },
    {
        key: 'students',
        label: 'Student',
        icon: 'people-outline',
        color: '#2563EB',
        bg: '#DBEAFE',
    },
];

export default function ManagementTopTabs({
    activeTab,
    onChange,
}: ManagementTopTabsProps) {
    return (
        <View className="bg-white rounded-2xl p-1.5 flex-row border border-gray-100 shadow-sm shadow-gray-200">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                    <TouchableOpacity
                        key={tab.key}
                        activeOpacity={0.75}
                        onPress={() => onChange(tab.key)}
                        className="flex-1 rounded-xl py-3.5 items-center"
                        style={{
                            backgroundColor: isActive ? tab.bg : '#FFFFFF',
                        }}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name={tab.icon}
                                size={18}
                                color={isActive ? tab.color : '#94A3B8'}
                            />
                            <Text
                                className="text-base font-bold ml-2"
                                style={{
                                    color: isActive ? tab.color : '#64748B',
                                }}
                            >
                                {tab.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
