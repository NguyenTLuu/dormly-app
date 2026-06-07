import { RequestTab } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface RequestTopTabsProps {
    activeTab: RequestTab;
    onChange: (tab: RequestTab) => void;
}

const tabs: {
    key: RequestTab;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
}[] = [
    {
        key: 'issues',
        label: 'Issues',
        icon: 'construct-outline',
        color: '#F97316',
        bg: '#FFEDD5',
    },
    {
        key: 'complaints',
        label: 'Complaints',
        icon: 'chatbox-ellipses-outline',
        color: '#7C3AED',
        bg: '#EDE9FE',
    },
    {
        key: 'transfers',
        label: 'Transfer',
        icon: 'swap-horizontal-outline',
        color: '#2563EB',
        bg: '#DBEAFE',
    },
];

export default function RequestTopTabs({
    activeTab,
    onChange,
}: RequestTopTabsProps) {
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
                                size={16}
                                color={isActive ? tab.color : '#94A3B8'}
                            />
                            <Text
                                className="text-sm font-bold ml-1"
                                style={{
                                    color: isActive ? tab.color : '#64748B',
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.85}
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
