import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ManagementDropdown from './ManagementDropdown';

interface ManagementFilterBarProps {
    blocks: string[];
    floors: string[];
    rooms?: string[];
    selectedBlock: string;
    selectedFloor: string;
    selectedRoom?: string;
    showRoomFilter?: boolean;
    onBlockChange: (block: string) => void;
    onFloorChange: (floor: string) => void;
    onRoomChange?: (room: string) => void;
    onClear: () => void;
}

export default function ManagementFilterBar({
    blocks,
    floors,
    rooms = ['All'],
    selectedBlock,
    selectedFloor,
    selectedRoom = 'All',
    showRoomFilter = false,
    onBlockChange,
    onFloorChange,
    onRoomChange,
    onClear,
}: ManagementFilterBarProps) {
    const hasActiveFilter =
        selectedBlock !== 'All' ||
        selectedFloor !== 'All' ||
        selectedRoom !== 'All';

    return (
        <View className="bg-white rounded-2xl p-3 border border-gray-100 gap-2">
            <View className="flex-row gap-2">
                <ManagementDropdown
                    label="Block"
                    value={selectedBlock}
                    options={blocks}
                    icon="business-outline"
                    accentColor="#2563EB"
                    accentBg="#DBEAFE"
                    onChange={onBlockChange}
                />
                <ManagementDropdown
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
                {showRoomFilter && (
                    <ManagementDropdown
                        label="Room"
                        value={selectedRoom}
                        options={rooms}
                        icon="bed-outline"
                        accentColor="#0F766E"
                        accentBg="#CCFBF1"
                        disabled={selectedFloor === 'All'}
                        disabledText="Choose floor"
                        onChange={onRoomChange || (() => undefined)}
                    />
                )}
            </View>
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onClear}
                disabled={!hasActiveFilter}
                className="self-start"
            >
                <Text
                    className={`text-xs font-bold ${hasActiveFilter ? 'text-[#2566E2]' : 'text-[#94A3B8]'}`}
                >
                    Clear filter
                </Text>
            </TouchableOpacity>
        </View>
    );
}
