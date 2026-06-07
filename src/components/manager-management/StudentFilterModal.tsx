import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StudentFilterModalProps {
    visible: boolean;
    majors: string[];
    blocks: string[];
    floors: string[];
    selectedMajor: string;
    selectedBlock: string;
    selectedFloor: string;
    onClose: () => void;
    onApply: (major: string, block: string, floor: string) => void;
}

interface ChoiceRowProps {
    options: string[];
    selected: string;
    color: string;
    bgColor: string;
    onChange: (value: string) => void;
}

function ChoiceRow({
    options,
    selected,
    color,
    bgColor,
    onChange,
}: ChoiceRowProps) {
    return (
        <View className="flex-row flex-wrap gap-2">
            {options.map((option) => {
                const active = selected === option;

                return (
                    <TouchableOpacity
                        key={option}
                        activeOpacity={0.75}
                        onPress={() => onChange(option)}
                        className="rounded-full px-3 py-2 border"
                        style={{
                            backgroundColor: active ? bgColor : '#FFFFFF',
                            borderColor: active ? color : '#E2E8F0',
                        }}
                    >
                        <Text
                            className="text-xs font-bold"
                            style={{ color: active ? color : '#64748B' }}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function StudentFilterModal({
    visible,
    majors,
    blocks,
    floors,
    selectedMajor,
    selectedBlock,
    selectedFloor,
    onClose,
    onApply,
}: StudentFilterModalProps) {
    const [draftMajor, setDraftMajor] = useState(selectedMajor);
    const [draftBlock, setDraftBlock] = useState(selectedBlock);
    const [draftFloor, setDraftFloor] = useState(selectedFloor);

    useEffect(() => {
        if (visible) {
            setDraftMajor(selectedMajor);
            setDraftBlock(selectedBlock);
            setDraftFloor(selectedFloor);
        }
    }, [selectedBlock, selectedFloor, selectedMajor, visible]);

    const handleBlockChange = (block: string) => {
        setDraftBlock(block);
        setDraftFloor('All');
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/30 justify-end" onPress={onClose}>
                <Pressable className="bg-[#F8FAFC] rounded-t-3xl px-4 pt-4 pb-8 max-h-[82%]">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-[#1E293B] text-xl font-bold">
                                Student Filters
                            </Text>
                            <Text className="text-[#64748B] text-xs font-semibold mt-1">
                                Refine the resident list
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={onClose}
                            className="w-9 h-9 rounded-full bg-white items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="bg-white rounded-2xl p-4 border border-gray-100">
                            <Text className="text-[#1E293B] text-sm font-bold mb-3">
                                Major
                            </Text>
                            <ChoiceRow
                                options={majors}
                                selected={draftMajor}
                                color="#2563EB"
                                bgColor="#DBEAFE"
                                onChange={setDraftMajor}
                            />
                        </View>

                        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
                            <Text className="text-[#1E293B] text-sm font-bold mb-3">
                                Block
                            </Text>
                            <ChoiceRow
                                options={blocks}
                                selected={draftBlock}
                                color="#7C3AED"
                                bgColor="#EDE9FE"
                                onChange={handleBlockChange}
                            />
                        </View>

                        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
                            <Text className="text-[#1E293B] text-sm font-bold mb-3">
                                Floor
                            </Text>
                            <ChoiceRow
                                options={floors}
                                selected={draftFloor}
                                color="#0F766E"
                                bgColor="#CCFBF1"
                                onChange={setDraftFloor}
                            />
                        </View>
                    </ScrollView>

                    <View className="flex-row gap-3 mt-4">
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => {
                                setDraftMajor('All');
                                setDraftBlock('All');
                                setDraftFloor('All');
                            }}
                            className="flex-1 bg-white border border-gray-200 rounded-2xl py-3 items-center"
                        >
                            <Text className="text-[#64748B] text-sm font-bold">
                                Clear
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() =>
                                onApply(draftMajor, draftBlock, draftFloor)
                            }
                            className="flex-1 bg-[#2563EB] rounded-2xl py-3 items-center"
                        >
                            <Text className="text-white text-sm font-bold">
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
