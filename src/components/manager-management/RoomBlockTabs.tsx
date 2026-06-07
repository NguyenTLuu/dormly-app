import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface RoomBlockTabsProps {
    blocks: string[];
    selectedBlock: string;
    onChange: (block: string) => void;
}

export default function RoomBlockTabs({
    blocks,
    selectedBlock,
    onChange,
}: RoomBlockTabsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
        >
            {blocks.map((block) => {
                const active = selectedBlock === block;

                return (
                    <TouchableOpacity
                        key={block}
                        activeOpacity={0.75}
                        onPress={() => onChange(block)}
                        className="rounded-full px-4 py-2.5 border"
                        style={{
                            backgroundColor: active ? '#2563EB' : '#FFFFFF',
                            borderColor: active ? '#2563EB' : '#E2E8F0',
                        }}
                    >
                        <Text
                            className="text-sm font-bold"
                            style={{ color: active ? '#FFFFFF' : '#64748B' }}
                        >
                            {block}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}
