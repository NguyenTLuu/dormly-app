import { RequestTab } from '@/data/manager-requests';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface RequestTopTabsProps {
    activeTab: RequestTab;
    onChange: (tab: RequestTab) => void;
}

const tabs: { key: RequestTab; label: string }[] = [
    { key: 'issues', label: 'Issues' },
    { key: 'complaints', label: 'Complaints' },
    { key: 'transfers', label: 'Transfer Room' },
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
                        className={`flex-1 rounded-xl py-3.5 items-center ${isActive ? 'bg-[#2566E2]' : ''}`}
                    >
                        <Text
                            className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[#64748B]'}`}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.85}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
