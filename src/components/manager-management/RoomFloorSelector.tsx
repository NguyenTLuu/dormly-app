import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface RoomFloorSelectorProps {
    floors: string[];
    selectedFloor: string;
    onChange: (floor: string) => void;
}

export default function RoomFloorSelector({
    floors,
    selectedFloor,
    onChange,
}: RoomFloorSelectorProps) {
    return (
        <View className="bg-white rounded-2xl p-1.5 border border-gray-100 flex-row">
            {floors.map((floor) => {
                const active = selectedFloor === floor;
                const label = floor === 'All' ? 'All floors' : floor;

                return (
                    <TouchableOpacity
                        key={floor}
                        activeOpacity={0.75}
                        onPress={() => onChange(floor)}
                        className="flex-1 rounded-xl py-2.5 items-center"
                        style={{
                            backgroundColor: active ? '#EDE9FE' : '#FFFFFF',
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-xs font-bold"
                            style={{ color: active ? '#7C3AED' : '#64748B' }}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
