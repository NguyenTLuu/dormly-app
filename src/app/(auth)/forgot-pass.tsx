import { forgotPasswordApi, requestForgotPasswordCode } from '@/api/authApi';
import AuthKeyboardLayout from '@/components/auth/AuthKeyboardLayout';
import LogoImage from '@/components/LogoImage';
import type { ApiErrorResponse } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const codeInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const isBusy = isSendingCode || isResetting;

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (isAxiosError<ApiErrorResponse>(error)) {
            return error.response?.data?.message ?? fallback;
        }
        return fallback;
    };

    const handleSendCode = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            toast.error('Email required', {
                description:
                    'Enter the email address associated with your account.',
            });
            return;
        }

        setIsSendingCode(true);
        try {
            await requestForgotPasswordCode(normalizedEmail);
            setEmail(normalizedEmail);
            setStep(2);
            toast.success('Verification code sent', {
                description:
                    'Check your email. The code expires in 10 minutes.',
            });
            requestAnimationFrame(() => codeInputRef.current?.focus());
        } catch (error) {
            toast.error('Could not send code', {
                description: getErrorMessage(
                    error,
                    'Please try again shortly.'
                ),
            });
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleResetPassword = async () => {
        if (!code.trim()) {
            toast.error('Verification code required');
            codeInputRef.current?.focus();
            return;
        }

        if (code.trim().length !== 6) {
            toast.error('Invalid verification code', {
                description: 'Enter the 6-digit code sent to your email.',
            });
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password is too short', {
                description: 'Use at least 6 characters.',
            });
            passwordInputRef.current?.focus();
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            confirmPasswordInputRef.current?.focus();
            return;
        }

        setIsResetting(true);
        try {
            await forgotPasswordApi({
                email,
                code: code.trim(),
                newPassword,
                confirmPassword,
            });
            toast.success('Password reset successful', {
                description: 'Sign in with your new password.',
            });
            router.replace('/login');
        } catch (error) {
            toast.error('Could not reset password', {
                description: getErrorMessage(
                    error,
                    'Check your code and try again.'
                ),
            });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <AuthKeyboardLayout contentContainerStyle={{ paddingBottom: 36 }}>
            <View className="items-center w-full px-4 pt-8 pb-8 bg-[#F4FAFD]">
                <LogoImage />
                <Text className="text-3xl font-bold text-[#1E293B] mt-3">
                    Reset password
                </Text>
                <Text className="text-sm leading-5 text-[#64748B] text-center mt-2 px-6">
                    We’ll send a verification code to your registered email.
                </Text>

                <StepIndicator step={step} />

                <View className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    {step === 1 ? (
                        <>
                            <SectionHeading
                                icon="mail-outline"
                                title="Find your account"
                                description="Enter the email address you use to sign in."
                            />
                            <InputRow
                                icon="mail-outline"
                                placeholder="Email address"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="done"
                                onSubmitEditing={handleSendCode}
                                editable={!isBusy}
                            />
                            <PrimaryButton
                                label={
                                    isSendingCode
                                        ? 'Sending code...'
                                        : 'Send verification code'
                                }
                                icon="paper-plane-outline"
                                onPress={handleSendCode}
                                disabled={isBusy}
                            />
                        </>
                    ) : (
                        <>
                            <SectionHeading
                                icon="shield-checkmark-outline"
                                title="Set a new password"
                                description={`Enter the 6-digit code sent to ${email}.`}
                            />
                            <InputRow
                                inputRef={codeInputRef}
                                icon="key-outline"
                                placeholder="6-digit verification code"
                                value={code}
                                onChangeText={(value) =>
                                    setCode(value.replace(/\D/g, ''))
                                }
                                keyboardType="number-pad"
                                maxLength={6}
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordInputRef.current?.focus()
                                }
                                editable={!isBusy}
                                textContentType="oneTimeCode"
                            />
                            <PasswordInput
                                inputRef={passwordInputRef}
                                placeholder="New password (at least 6 characters)"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                visible={showPassword}
                                onToggle={() =>
                                    setShowPassword((value) => !value)
                                }
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    confirmPasswordInputRef.current?.focus()
                                }
                                editable={!isBusy}
                            />
                            <PasswordInput
                                inputRef={confirmPasswordInputRef}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                visible={showConfirmPassword}
                                onToggle={() =>
                                    setShowConfirmPassword((value) => !value)
                                }
                                returnKeyType="done"
                                onSubmitEditing={handleResetPassword}
                                editable={!isBusy}
                            />
                            <PrimaryButton
                                label={
                                    isResetting
                                        ? 'Resetting password...'
                                        : 'Reset password'
                                }
                                icon="lock-open-outline"
                                onPress={handleResetPassword}
                                disabled={isBusy}
                            />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                disabled={isBusy}
                                onPress={() => {
                                    setCode('');
                                    setStep(1);
                                }}
                                className="items-center pt-4"
                            >
                                <Text className="text-blue-600 text-sm font-bold">
                                    Use a different email
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Link href="/login" asChild>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="items-center py-5"
                    >
                        <Text className="text-[#2563EB] text-sm font-bold">
                            Back to login
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </AuthKeyboardLayout>
    );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
    const label = step === 1 ? 'Email verification' : 'Create new password';

    return (
        <View className="w-full my-5">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-bold text-[#2563EB]">
                    Step {step} of 2
                </Text>
                <Text className="text-xs font-semibold text-[#64748B]">
                    {label}
                </Text>
            </View>
            <View className="h-1.5 rounded-full bg-slate-200 overflow-hidden" />
            <View
                className="absolute left-0 bottom-0 h-1.5 rounded-full bg-blue-600"
                style={{ width: step === 1 ? '50%' : '100%' }}
            />
        </View>
    );
}

function SectionHeading({
    icon,
    title,
    description,
}: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    title: string;
    description: string;
}) {
    return (
        <View className="flex-row items-start mb-5">
            <View className="w-11 h-11 rounded-2xl bg-blue-50 items-center justify-center">
                <Ionicons name={icon} size={22} color="#2563EB" />
            </View>
            <View className="flex-1 ml-3">
                <Text className="text-[#1E293B] text-base font-bold">
                    {title}
                </Text>
                <Text className="text-[#64748B] text-xs font-medium leading-5 mt-1">
                    {description}
                </Text>
            </View>
        </View>
    );
}

function InputRow({
    inputRef,
    icon,
    ...props
}: React.ComponentProps<typeof TextInput> & {
    inputRef?: React.RefObject<TextInput | null>;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
    return (
        <View className="h-[52px] flex-row items-center px-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
            <Ionicons name={icon} size={19} color="#64748B" />
            <TextInput
                ref={inputRef}
                className="flex-1 ml-2.5 text-[#1E293B]"
                placeholderTextColor="#94A3B8"
                submitBehavior="submit"
                {...props}
            />
        </View>
    );
}

function PasswordInput({
    inputRef,
    visible,
    onToggle,
    ...props
}: Omit<React.ComponentProps<typeof InputRow>, 'icon'> & {
    visible: boolean;
    onToggle: () => void;
}) {
    return (
        <View className="h-[52px] flex-row items-center px-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
            <Ionicons name="lock-closed-outline" size={19} color="#64748B" />
            <TextInput
                ref={inputRef}
                className="flex-1 ml-2.5 text-[#1E293B]"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!visible}
                submitBehavior="submit"
                {...props}
            />
            <TouchableOpacity onPress={onToggle} className="p-1">
                <Ionicons
                    name={visible ? 'eye-outline' : 'eye-off-outline'}
                    size={19}
                    color="#64748B"
                />
            </TouchableOpacity>
        </View>
    );
}

function PrimaryButton({
    label,
    icon,
    onPress,
    disabled,
}: {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
    disabled: boolean;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            disabled={disabled}
            className={`h-[52px] rounded-xl items-center justify-center flex-row mt-2 ${
                disabled ? 'bg-blue-300' : 'bg-blue-600'
            }`}
        >
            <Ionicons name={icon} size={18} color="white" />
            <Text className="text-white text-base font-bold ml-2">{label}</Text>
        </TouchableOpacity>
    );
}
