import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FilterDropdown from './FilterDropdown';

interface IssueTypeFilterProps {
    options: string[];
    selectedType: string;
    onChange: (type: string) => void;
}

export default function IssueTypeFilter({
    options,
    selectedType,
    onChange,
}: IssueTypeFilterProps) {
    const hasActiveFilter = selectedType !== 'All';

    return (
        <View className="bg-white rounded-2xl p-3 border border-gray-100">
            <View className="flex-row items-end gap-3">
                <FilterDropdown
                    label="Issue type"
                    value={selectedType}
                    options={options}
                    icon="construct-outline"
                    accentColor="#F97316"
                    accentBg="#FFEDD5"
                    onChange={onChange}
                />
                <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={!hasActiveFilter}
                    onPress={() => onChange('All')}
                    className="min-h-[48px] justify-center"
                >
                    <Text
                        className={`text-sm font-bold ${hasActiveFilter ? 'text-[#F97316]' : 'text-[#94A3B8]'}`}
                    >
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
