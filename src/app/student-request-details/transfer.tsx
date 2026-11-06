import { createTransferRequestApi } from '@/api/transferApi';
import { StudentRequestHeader } from '@/components/student-requests';
import { useKeyboardBottomPadding } from '@/hooks/useKeyboardBottomPadding';
import type { ApiErrorResponse } from '@/types/api';
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

export default function StudentTransferRequestScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const bottomPadding = useKeyboardBottomPadding();

    const revealFocusedField = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 150);
        });
    };

    const handleSubmit = async () => {
        const normalizedReason = reason.trim();
        if (!normalizedReason) {
            toast.error('Transfer reason is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await createTransferRequestApi({ reason: normalizedReason });
            toast.success('Transfer request submitted', {
                description:
                    'Dormitory management will review your request and propose a suitable room.',
            });
            router.back();
        } catch (error) {
            const message = isAxiosError<ApiErrorResponse>(error)
                ? error.response?.data?.message
                : undefined;
            toast.error('Could not submit transfer request', {
                description: message ?? 'Please try again.',
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
                title="Room transfer"
                subtitle="Tell us why you need a room change"
                color="#2563EB"
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
                    <View className="bg-blue-50 border border-blue-100 rounded-3xl p-4 flex-row">
                        <View className="w-10 h-10 rounded-xl bg-white items-center justify-center">
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#2563EB"
                            />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-[#1E3A8A] text-sm font-bold">
                                How transfer requests work
                            </Text>
                            <Text className="text-[#475569] text-xs leading-5 mt-1">
                                Submit your reason first. Dormitory management
                                will review your current assignment and contact
                                you with a suitable available room.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mt-5">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            Transfer reason
                            <Text className="text-red-500"> *</Text>
                        </Text>
                        <Text className="text-[#94A3B8] text-xs font-medium mt-1">
                            Include details that can help management evaluate
                            your request.
                        </Text>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            onFocus={revealFocusedField}
                            multiline
                            textAlignVertical="top"
                            editable={!isSubmitting}
                            placeholder="Example: I need a quieter room to study due to recurring noise at night."
                            placeholderTextColor="#94A3B8"
                            className="min-h-36 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-3"
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                        onPress={handleSubmit}
                        className={`rounded-2xl py-4 items-center mt-5 ${
                            isSubmitting ? 'bg-blue-300' : 'bg-blue-600'
                        }`}
                    >
                        <Text className="text-white text-base font-bold">
                            {isSubmitting
                                ? 'Submitting request...'
                                : 'Submit transfer request'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
