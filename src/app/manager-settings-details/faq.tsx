import { ManagerHeader } from '@/components/manager-dashboard';
import { addActivityLog } from '@/data/activity-log';
import { DormFaqItem, dormFaq, updateDormFaq } from '@/data/dorm-faq';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const emptyFaq = (): DormFaqItem => ({
    id: `faq-${Date.now()}`,
    question: '',
    answer: '',
    category: 'Dormitory',
});

export default function ManagerFaqScreen() {
    const router = useRouter();
    const [items, setItems] = useState<DormFaqItem[]>(
        dormFaq.map((item) => ({ ...item }))
    );

    const updateItem = (
        id: string,
        field: 'question' | 'answer' | 'category',
        value: string
    ) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const saveFaq = () => {
        if (
            items.some((item) => !item.question.trim() || !item.answer.trim())
        ) {
            toast.error('Every FAQ needs a question and answer');
            return;
        }
        updateDormFaq(items.map((item) => ({ ...item })));
        addActivityLog({
            action: 'Updated chatbot FAQ',
            detail: `Saved ${items.length} chatbot questions and answers.`,
            actorName: 'Nguyen Minh Manager',
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'settings-outline',
            color: '#7C3AED',
        });
        toast.success('Chatbot FAQ saved');
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView keyboardShouldPersistTaps="handled">
                <ManagerHeader
                    title="Chatbot FAQ"
                    subtitle="Create and update student chatbot answers"
                    onBack={() => router.back()}
                />
                <View className="-mt-8 px-4 pb-8 gap-3">
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            Shared chatbot knowledge
                        </Text>
                        <Text className="text-[#64748B] text-xs font-semibold mt-1">
                            Saved changes are immediately used by the student
                            chatbot during this app session.
                        </Text>
                    </View>

                    {items.map((item, index) => (
                        <View
                            key={item.id}
                            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl"
                        >
                            <View className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                                    <Text className="text-[#7C3AED] text-xs font-bold">
                                        {index + 1}
                                    </Text>
                                </View>
                                <Text className="text-[#1E293B] text-sm font-bold ml-2 flex-1">
                                    FAQ item
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        setItems((current) =>
                                            current.filter(
                                                (faq) => faq.id !== item.id
                                            )
                                        )
                                    }
                                    className="w-8 h-8 rounded-full bg-red-50 items-center justify-center"
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={16}
                                        color="#DC2626"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row gap-2 mb-3">
                                {(['Fees', 'Dormitory'] as const).map(
                                    (category) => {
                                        const active =
                                            item.category === category;
                                        return (
                                            <TouchableOpacity
                                                key={category}
                                                onPress={() =>
                                                    updateItem(
                                                        item.id,
                                                        'category',
                                                        category
                                                    )
                                                }
                                                className="rounded-full px-3 py-2 border"
                                                style={{
                                                    backgroundColor: active
                                                        ? '#EDE9FE'
                                                        : '#FFFFFF',
                                                    borderColor: active
                                                        ? '#7C3AED'
                                                        : '#E2E8F0',
                                                }}
                                            >
                                                <Text
                                                    className="text-xs font-bold"
                                                    style={{
                                                        color: active
                                                            ? '#7C3AED'
                                                            : '#64748B',
                                                    }}
                                                >
                                                    {category}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                )}
                            </View>
                            <TextInput
                                value={item.question}
                                onChangeText={(value) =>
                                    updateItem(item.id, 'question', value)
                                }
                                placeholder="Question"
                                placeholderTextColor="#94A3B8"
                                className="bg-[#F8FAFC] rounded-xl px-3 py-3 text-[#1E293B] text-sm font-bold border border-gray-100"
                            />
                            <TextInput
                                value={item.answer}
                                onChangeText={(value) =>
                                    updateItem(item.id, 'answer', value)
                                }
                                placeholder="Chatbot answer"
                                placeholderTextColor="#94A3B8"
                                multiline
                                textAlignVertical="top"
                                className="bg-[#F8FAFC] rounded-xl px-3 py-3 text-[#64748B] text-xs font-semibold border border-gray-100 mt-2 min-h-20"
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() =>
                            setItems((current) => [...current, emptyFaq()])
                        }
                        className="bg-purple-50 border border-purple-100 rounded-2xl py-3.5 flex-row items-center justify-center"
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={19}
                            color="#7C3AED"
                        />
                        <Text className="text-[#7C3AED] text-sm font-bold ml-2">
                            Create New FAQ
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={saveFaq}
                        className="bg-purple-600 rounded-2xl py-3.5 items-center"
                    >
                        <Text className="text-white text-sm font-bold">
                            Save FAQ Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
