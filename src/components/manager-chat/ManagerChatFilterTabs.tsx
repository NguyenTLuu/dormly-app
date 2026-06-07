import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type ManagerChatFilter = 'all' | 'direct' | 'group';

interface ManagerChatFilterTabsProps {
    activeFilter: ManagerChatFilter;
    counts: Record<ManagerChatFilter, number>;
    onChange: (filter: ManagerChatFilter) => void;
}

const filters: {
    id: ManagerChatFilter;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}[] = [
    { id: 'all', label: 'All', icon: 'chatbubbles-outline' },
    { id: 'direct', label: 'Direct', icon: 'person-outline' },
    { id: 'group', label: 'Groups', icon: 'people-outline' },
];

export default function ManagerChatFilterTabs({
    activeFilter,
    counts,
    onChange,
}: ManagerChatFilterTabsProps) {
    return (
        <View className="bg-white rounded-2xl p-1.5 border border-gray-100 flex-row">
            {filters.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                    <TouchableOpacity
                        key={filter.id}
                        activeOpacity={0.75}
                        onPress={() => onChange(filter.id)}
                        className={`flex-1 rounded-xl py-2.5 flex-row items-center justify-center ${
                            active ? 'bg-blue-600' : 'bg-white'
                        }`}
                    >
                        <Ionicons
                            name={filter.icon}
                            size={16}
                            color={active ? 'white' : '#64748B'}
                        />
                        <Text
                            className={`text-xs font-bold ml-1.5 ${
                                active ? 'text-white' : 'text-[#64748B]'
                            }`}
                        >
                            {filter.label} {counts[filter.id]}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
