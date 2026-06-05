import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    icon: keyof typeof Ionicons.glyphMap;
    accentColor: string;
    accentBg: string;
    disabled?: boolean;
    disabledText?: string;
    onChange: (value: string) => void;
}

export default function FilterDropdown({
    label,
    value,
    options,
    icon,
    accentColor,
    accentBg,
    disabled = false,
    disabledText = 'Select previous filter first',
    onChange,
}: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const displayValue = disabled ? disabledText : value;

    const handleSelect = (option: string) => {
        onChange(option);
        setOpen(false);
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center mb-1.5">
                <Ionicons
                    name={icon}
                    size={13}
                    color={disabled ? '#CBD5E1' : accentColor}
                />
                <Text
                    className="text-[#64748B] text-xs font-bold ml-1"
                    numberOfLines={1}
                >
                    {label}
                </Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.75}
                disabled={disabled}
                onPress={() => setOpen(true)}
                className={`min-h-[48px] rounded-xl border px-2.5 py-2.5 flex-row items-center ${disabled ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'}`}
            >
                <Text
                    numberOfLines={1}
                    className={`text-sm font-bold flex-1 ${disabled ? 'text-[#94A3B8]' : 'text-[#1E293B]'}`}
                >
                    {displayValue}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={disabled ? '#CBD5E1' : '#64748B'}
                />
            </TouchableOpacity>

            <Modal
                transparent
                visible={open}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    className="flex-1 bg-black/25 justify-center px-6"
                    onPress={() => setOpen(false)}
                >
                    <Pressable className="bg-white rounded-2xl p-3">
                        <View className="flex-row items-center px-2 py-2">
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center mr-2"
                                style={{ backgroundColor: accentBg }}
                            >
                                <Ionicons
                                    name={icon}
                                    size={17}
                                    color={accentColor}
                                />
                            </View>
                            <Text className="text-[#1E293B] text-base font-bold">
                                {label}
                            </Text>
                        </View>
                        <View className="gap-1">
                            {options.map((option) => {
                                const selected = option === value;

                                return (
                                    <TouchableOpacity
                                        key={option}
                                        activeOpacity={0.75}
                                        onPress={() => handleSelect(option)}
                                        className="rounded-xl px-3 py-3 flex-row items-center justify-between"
                                        style={{
                                            backgroundColor: selected
                                                ? accentBg
                                                : '#FFFFFF',
                                        }}
                                    >
                                        <Text
                                            className="text-base font-semibold"
                                            style={{
                                                color: selected
                                                    ? accentColor
                                                    : '#334155',
                                            }}
                                        >
                                            {option}
                                        </Text>
                                        {selected && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color={accentColor}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
