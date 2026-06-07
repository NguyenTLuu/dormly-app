import { StudentRequestHeader } from '@/components/student-requests';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function StudentChangePasswordScreen() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visibleFields, setVisibleFields] = useState<string[]>([]);

    const toggleVisibility = (field: string) => {
        setVisibleFields((current) =>
            current.includes(field)
                ? current.filter((item) => item !== field)
                : [...current, field]
        );
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Complete all password fields');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('New password must contain at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New password confirmation does not match');
            return;
        }
        if (currentPassword === newPassword) {
            toast.error('New password must differ from current password');
            return;
        }

        toast.success('Password changed successfully');
        router.back();
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F4FAFD]"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <StudentRequestHeader
                    title="Change password"
                    subtitle="Create a strong password for your account"
                    color="#2563EB"
                />

                <View className="px-4 pt-5">
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <PasswordInput
                            label="Current password"
                            value={currentPassword}
                            visible={visibleFields.includes('current')}
                            onChangeText={setCurrentPassword}
                            onToggle={() => toggleVisibility('current')}
                        />
                        <PasswordInput
                            label="New password"
                            value={newPassword}
                            visible={visibleFields.includes('new')}
                            onChangeText={setNewPassword}
                            onToggle={() => toggleVisibility('new')}
                        />
                        <PasswordInput
                            label="Confirm new password"
                            value={confirmPassword}
                            visible={visibleFields.includes('confirm')}
                            onChangeText={setConfirmPassword}
                            onToggle={() => toggleVisibility('confirm')}
                            isLast
                        />
                    </View>

                    <View className="bg-blue-50 rounded-3xl p-4 mt-4">
                        <Text className="text-blue-900 text-sm font-bold">
                            Password requirements
                        </Text>
                        <Requirement text="At least 8 characters" />
                        <Requirement text="Different from your current password" />
                        <Requirement text="Use letters, numbers, and symbols" />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleChangePassword}
                        className="bg-blue-600 rounded-2xl py-4 items-center mt-5"
                    >
                        <Text className="text-white text-base font-bold">
                            Update password
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function PasswordInput({
    label,
    value,
    visible,
    onChangeText,
    onToggle,
    isLast = false,
}: {
    label: string;
    value: string;
    visible: boolean;
    onChangeText: (value: string) => void;
    onToggle: () => void;
    isLast?: boolean;
}) {
    return (
        <View className={isLast ? '' : 'mb-4'}>
            <Text className="text-[#475569] text-xs font-bold mb-2">
                {label}
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-3">
                <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#2563EB"
                />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!visible}
                    autoCapitalize="none"
                    placeholder="Enter password"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-[#1E293B] text-sm py-3.5 ml-2"
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onToggle}
                    className="w-9 h-9 items-center justify-center"
                >
                    <Ionicons
                        name={visible ? 'eye-off-outline' : 'eye-outline'}
                        size={19}
                        color="#64748B"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function Requirement({ text }: { text: string }) {
    return (
        <View className="flex-row items-center mt-2.5">
            <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#2563EB"
            />
            <Text className="text-blue-700 text-xs font-medium ml-2">
                {text}
            </Text>
        </View>
    );
}
