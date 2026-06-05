import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FilterDropdown from './FilterDropdown';

interface RequestFilterBarProps {
    blocks: string[];
    floors: string[];
    priorities: string[];
    selectedBlock: string;
    selectedFloor: string;
    selectedPriority: string;
    onBlockChange: (block: string) => void;
    onFloorChange: (floor: string) => void;
    onPriorityChange: (priority: string) => void;
    onClear: () => void;
}

export default function RequestFilterBar({
    blocks,
    floors,
    priorities,
    selectedBlock,
    selectedFloor,
    selectedPriority,
    onBlockChange,
    onFloorChange,
    onPriorityChange,
    onClear,
}: RequestFilterBarProps) {
    const hasActiveFilter =
        selectedBlock !== 'All' ||
        selectedFloor !== 'All' ||
        selectedPriority !== 'All';

    return (
        <View className="bg-white rounded-2xl p-3 border border-gray-100 gap-2">
            <View className="flex-row gap-2">
                <FilterDropdown
                    label="Block"
                    value={selectedBlock}
                    options={blocks}
                    icon="business-outline"
                    accentColor="#2566E2"
                    accentBg="#DBEAFE"
                    onChange={onBlockChange}
                />
                <FilterDropdown
                    label="Floor"
                    value={selectedFloor}
                    options={floors}
                    icon="layers-outline"
                    accentColor="#7C3AED"
                    accentBg="#EDE9FE"
                    disabled={selectedBlock === 'All'}
                    disabledText="Choose block"
                    onChange={onFloorChange}
                />
                <FilterDropdown
                    label="Priority"
                    value={selectedPriority}
                    options={priorities}
                    icon="flag-outline"
                    accentColor="#F97316"
                    accentBg="#FFEDD5"
                    onChange={onPriorityChange}
                />
            </View>
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onClear}
                disabled={!hasActiveFilter}
                className="self-end"
            >
                <Text
                    className={`text-sm font-bold ${hasActiveFilter ? 'text-[#2566E2]' : 'text-[#94A3B8]'}`}
                >
                    Clear filter
                </Text>
            </TouchableOpacity>
        </View>
    );
}
