import { createTicketApi } from '@/api/ticketApi';
import AttachmentPicker from '@/components/student-requests/AttachmentPicker';
import { useKeyboardBottomPadding } from '@/hooks/useKeyboardBottomPadding';
import type { ApiErrorResponse } from '@/types/api';
import type { TicketAttachment, TicketCategory } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

import StudentRequestHeader from './StudentRequestHeader';

const ticketCategories: {
    value: TicketCategory;
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    backgroundColor: string;
}[] = [
    {
        value: 'MAINTENANCE',
        label: 'Maintenance',
        description: 'Electricity, water, internet, or repairs',
        icon: 'construct-outline',
        color: '#EA580C',
        backgroundColor: '#FFEDD5',
    },
    {
        value: 'FACILITY',
        label: 'Facility',
        description: 'Furniture, shared spaces, or equipment',
        icon: 'business-outline',
        color: '#2563EB',
        backgroundColor: '#DBEAFE',
    },
    {
        value: 'ROOMMATE',
        label: 'Roommate',
        description: 'Noise, living habits, or roommate concerns',
        icon: 'people-outline',
        color: '#7C3AED',
        backgroundColor: '#EDE9FE',
    },
    {
        value: 'SECURITY',
        label: 'Security',
        description: 'Safety, access, or suspicious activity',
        icon: 'shield-checkmark-outline',
        color: '#DC2626',
        backgroundColor: '#FEE2E2',
    },
    {
        value: 'BILLING',
        label: 'Billing',
        description: 'Fees, invoices, or payment questions',
        icon: 'receipt-outline',
        color: '#0284C7',
        backgroundColor: '#E0F2FE',
    },
    {
        value: 'OTHER',
        label: 'Other',
        description: 'Any concern not listed above',
        icon: 'ellipsis-horizontal-circle-outline',
        color: '#64748B',
        backgroundColor: '#F1F5F9',
    },
];

export default function StudentWorkRequestForm() {
    const router = useRouter();
    const [category, setCategory] = useState<TicketCategory>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const bottomPadding = useKeyboardBottomPadding();

    const revealFocusedField = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 150);
        });
    };

    const getErrorMessage = (error: unknown) => {
        if (isAxiosError<ApiErrorResponse>(error)) {
            return error.response?.data?.message ?? 'Please try again.';
        }
        return 'Please try again.';
    };

    const handleSubmit = async () => {
        if (!category) {
            toast.error('Select a ticket category');
            return;
        }
        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        setIsSubmitting(true);
        try {
            const ticket = await createTicketApi({
                category,
                title: title.trim(),
                description: description.trim(),
                files: attachments,
            });
            toast.success('Issue ticket submitted', {
                description: `${ticket.code} is now open for review.`,
            });
            router.back();
        } catch (error) {
            toast.error('Could not submit ticket', {
                description: getErrorMessage(error),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F4FAFD]"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StudentRequestHeader
                title="Create issue ticket"
                subtitle="Select a category and tell dormitory management what happened"
                color="#EA580C"
            />
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: bottomPadding }}
            >
                <View className="px-4 pt-5">
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mb-4">
                        <Text className="text-[#1E293B] text-base font-bold">
                            Ticket category
                            <Text className="text-red-500"> *</Text>
                        </Text>
                        <Text className="text-[#94A3B8] text-xs font-medium mt-1">
                            Choose the category that best describes your
                            request.
                        </Text>
                        <View className="mt-3 gap-2">
                            {ticketCategories.map((option) => {
                                const selected = category === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        activeOpacity={0.75}
                                        disabled={isSubmitting}
                                        onPress={() =>
                                            setCategory(option.value)
                                        }
                                        className="rounded-2xl border p-3 flex-row items-center"
                                        style={{
                                            borderColor: selected
                                                ? option.color
                                                : '#E2E8F0',
                                            backgroundColor: selected
                                                ? option.backgroundColor
                                                : '#FFFFFF',
                                        }}
                                    >
                                        <View
                                            className="w-10 h-10 rounded-xl items-center justify-center"
                                            style={{
                                                backgroundColor:
                                                    option.backgroundColor,
                                            }}
                                        >
                                            <Ionicons
                                                name={option.icon}
                                                size={20}
                                                color={option.color}
                                            />
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text
                                                className="text-sm font-bold"
                                                style={{
                                                    color: selected
                                                        ? option.color
                                                        : '#334155',
                                                }}
                                            >
                                                {option.label}
                                            </Text>
                                            <Text className="text-[#64748B] text-xs mt-0.5">
                                                {option.description}
                                            </Text>
                                        </View>
                                        {selected && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={21}
                                                color={option.color}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <FormLabel label="Title" />
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Example: Bathroom light is not working"
                            placeholderTextColor="#94A3B8"
                            maxLength={200}
                            editable={!isSubmitting}
                            onFocus={revealFocusedField}
                            className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-2"
                        />
                        <Text className="text-[#94A3B8] text-[11px] text-right mt-1">
                            {title.length}/200
                        </Text>

                        <View className="mt-4">
                            <FormLabel label="Description" />
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe what happened, where it happened, and details that can help management."
                                placeholderTextColor="#94A3B8"
                                multiline
                                textAlignVertical="top"
                                editable={!isSubmitting}
                                onFocus={revealFocusedField}
                                className="min-h-32 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-2"
                            />
                        </View>

                        <View className="h-px bg-slate-100 my-5" />
                        <AttachmentPicker
                            attachments={attachments}
                            accentColor="#EA580C"
                            accentBg="#FFF7ED"
                            onChange={setAttachments}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                        onPress={handleSubmit}
                        className={`rounded-2xl py-4 items-center mt-5 ${
                            isSubmitting ? 'bg-orange-300' : 'bg-[#EA580C]'
                        }`}
                    >
                        <Text className="text-white text-base font-bold">
                            {isSubmitting
                                ? 'Submitting ticket...'
                                : 'Submit issue ticket'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function FormLabel({ label }: { label: string }) {
    return (
        <Text className="text-[#1E293B] text-sm font-bold">
            {label}
            <Text className="text-red-500"> *</Text>
        </Text>
    );
}
