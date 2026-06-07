import {
    NotificationAudienceScope,
    notificationAudienceOptions,
} from '@/data/manager-dashboard-actions';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const audienceScopes: NotificationAudienceScope[] = [
    'All residents',
    'Selected blocks',
    'Selected floors',
    'Selected rooms',
];

interface NotificationAudienceSelectorProps {
    scope: NotificationAudienceScope;
    targets: string[];
    onScopeChange: (scope: NotificationAudienceScope) => void;
    onTargetsChange: (targets: string[]) => void;
}

export default function NotificationAudienceSelector({
    scope,
    targets,
    onScopeChange,
    onTargetsChange,
}: NotificationAudienceSelectorProps) {
    const [open, setOpen] = useState(false);
    const options =
        scope === 'All residents' ? [] : notificationAudienceOptions[scope];

    const handleScopeChange = (nextScope: NotificationAudienceScope) => {
        onScopeChange(nextScope);
        onTargetsChange([]);
        if (nextScope !== 'All residents') {
            setOpen(true);
        }
    };

    const toggleTarget = (target: string) => {
        onTargetsChange(
            targets.includes(target)
                ? targets.filter((item) => item !== target)
                : [...targets, target]
        );
    };

    return (
        <View className="gap-2">
            <Text className="text-[#475569] text-xs font-bold">Audience</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2"
            >
                {audienceScopes.map((option) => {
                    const selected = scope === option;

                    return (
                        <TouchableOpacity
                            key={option}
                            activeOpacity={0.75}
                            onPress={() => handleScopeChange(option)}
                            className="rounded-full px-3 py-2 border"
                            style={{
                                backgroundColor: selected
                                    ? '#E0F2FE'
                                    : '#FFFFFF',
                                borderColor: selected
                                    ? '#0EA5E9'
                                    : '#E2E8F0',
                            }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{
                                    color: selected ? '#0284C7' : '#64748B',
                                }}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {scope !== 'All residents' && (
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setOpen(true)}
                    className="bg-[#F8FAFC] rounded-xl px-3.5 py-3 border border-gray-100 flex-row items-center"
                >
                    <Ionicons name="people-outline" size={17} color="#0EA5E9" />
                    <Text className="text-[#1E293B] text-sm font-bold ml-2 flex-1">
                        {targets.length > 0
                            ? `${targets.length} selected`
                            : `Choose ${scope.toLowerCase()}`}
                    </Text>
                    <Ionicons name="chevron-forward" size={17} color="#94A3B8" />
                </TouchableOpacity>
            )}

            {targets.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5">
                    {targets.map((target) => (
                        <View
                            key={target}
                            className="bg-[#E0F2FE] rounded-full px-2.5 py-1"
                        >
                            <Text className="text-[#0284C7] text-[11px] font-bold">
                                {target}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <Modal
                transparent
                visible={open}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    className="flex-1 bg-black/30 justify-end"
                    onPress={() => setOpen(false)}
                >
                    <Pressable className="bg-white rounded-t-3xl px-4 pt-5 pb-8 max-h-[72%]">
                        <View className="flex-row items-center mb-3">
                            <View className="flex-1">
                                <Text className="text-[#1E293B] text-lg font-bold">
                                    Select audience
                                </Text>
                                <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                                    {scope}
                                </Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={() => setOpen(false)}
                                className="w-9 h-9 rounded-full bg-[#F1F5F9] items-center justify-center"
                            >
                                <Ionicons name="close" size={20} color="#475569" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {options.map((option) => {
                                const selected = targets.includes(option);

                                return (
                                    <TouchableOpacity
                                        key={option}
                                        activeOpacity={0.75}
                                        onPress={() => toggleTarget(option)}
                                        className="flex-row items-center py-3 border-b border-gray-100"
                                    >
                                        <Text className="text-[#1E293B] text-sm font-bold flex-1">
                                            {option}
                                        </Text>
                                        <Ionicons
                                            name={
                                                selected
                                                    ? 'checkmark-circle'
                                                    : 'ellipse-outline'
                                            }
                                            size={21}
                                            color={
                                                selected ? '#0EA5E9' : '#CBD5E1'
                                            }
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setOpen(false)}
                            className="bg-[#0EA5E9] rounded-xl py-3.5 items-center mt-4"
                        >
                            <Text className="text-white text-sm font-bold">
                                Done ({targets.length})
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
