import { registerStudentApi, requestRegistrationCode } from '@/api/authApi';
import AuthKeyboardLayout from '@/components/auth/AuthKeyboardLayout';
import LogoImage from '@/components/LogoImage';
import type { RegistrationDocument } from '@/types/auth';
import type { ApiErrorResponse } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function RegisterStudentAccount() {
    const router = useRouter();
    const studentIdInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const phoneInputRef = useRef<TextInput>(null);
    const codeInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);

    const [fullName, setFullName] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [major, setMajor] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [registrationCode, setRegistrationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [citizenIdFile, setCitizenIdFile] =
        useState<RegistrationDocument | null>(null);
    const [studentCardFile, setStudentCardFile] =
        useState<RegistrationDocument | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBusy = isSendingCode || isSubmitting;

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            return error.response?.data?.message ?? fallback;
        }
        return fallback;
    };

    const handleRequestCode = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            toast.error('Email required', {
                description: 'Enter your EIU email address first.',
            });
            emailInputRef.current?.focus();
            return;
        }

        setIsSendingCode(true);
        try {
            await requestRegistrationCode(normalizedEmail);
            toast.success('Verification code sent', {
                description: 'Check your email, then enter the code below.',
            });
            codeInputRef.current?.focus();
        } catch (error) {
            toast.error('Could not send code', {
                description: getErrorMessage(error, 'Please try again shortly.'),
            });
        } finally {
            setIsSendingCode(false);
        }
    };

    const handlePickDocument = async (
        type: 'citizen' | 'student-card'
    ) => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: false,
            type: ['image/*', 'application/pdf'],
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        const file = {
            uri: asset.uri,
            name: asset.name,
            mimeType: asset.mimeType,
        };

        if (type === 'citizen') {
            setCitizenIdFile(file);
        } else {
            setStudentCardFile(file);
        }
    };

    const handleSubmit = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (
            !fullName.trim() ||
            !studentCode.trim() ||
            !normalizedEmail ||
            !phoneNumber.trim() ||
            !registrationCode.trim() ||
            !password ||
            !confirmPassword ||
            !citizenIdFile ||
            !studentCardFile
        ) {
            toast.error('Complete required information', {
                description:
                    'Your verification code and both identity documents are required.',
            });
            return;
        }

        if (password.length < 6 || password.length > 20) {
            toast.error('Invalid password', {
                description: 'Password must contain 6 to 20 characters.',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await registerStudentApi({
                fullName: fullName.trim(),
                studentCode: studentCode.trim().toUpperCase(),
                major: major.trim() || undefined,
                email: normalizedEmail,
                phoneNumber: phoneNumber.trim(),
                password,
                registrationCode: registrationCode.trim(),
                citizenIdFile,
                studentCardFile,
            });
            toast.success('Registration submitted', {
                description:
                    'Your account is pending dormitory approval before you can sign in.',
            });
            router.replace('/login');
        } catch (error) {
            toast.error('Registration failed', {
                description: getErrorMessage(
                    error,
                    'Please review your information and try again.'
                ),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthKeyboardLayout contentContainerStyle={{ paddingBottom: 36 }}>
            <View className="items-center w-full pt-8 pb-8 bg-[#F4FAFD]">
                <LogoImage />
                <Text className="font-bold text-3xl mt-2 text-[#1E293B]">
                    Create student account
                </Text>
                <Text className="text-gray-500 mt-2 text-sm px-8 text-center leading-5">
                    Verify your EIU email and upload the required documents to
                    submit your application.
                </Text>

                <View className="px-4 w-full mt-6 gap-4">
                    <FormSection title="Student details" icon="person-outline">
                        <Field
                            icon="person-outline"
                            placeholder="Full name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            returnKeyType="next"
                            onSubmitEditing={() => studentIdInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                        <Field
                            inputRef={studentIdInputRef}
                            icon="card-outline"
                            placeholder="Student ID"
                            value={studentCode}
                            onChangeText={setStudentCode}
                            autoCapitalize="characters"
                            returnKeyType="next"
                            onSubmitEditing={() => emailInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                        <Field
                            icon="school-outline"
                            placeholder="Major (optional)"
                            value={major}
                            onChangeText={setMajor}
                            autoCapitalize="words"
                            returnKeyType="next"
                            onSubmitEditing={() => emailInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                    </FormSection>

                    <FormSection title="Verify your email" icon="mail-outline">
                        <Field
                            inputRef={emailInputRef}
                            icon="mail-outline"
                            placeholder="EIU email address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => phoneInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={handleRequestCode}
                            disabled={isBusy}
                            className={`rounded-xl py-3 items-center flex-row justify-center ${
                                isBusy ? 'bg-blue-300' : 'bg-blue-600'
                            }`}
                        >
                            <Ionicons name="paper-plane-outline" size={17} color="white" />
                            <Text className="text-white text-sm font-bold ml-2">
                                {isSendingCode ? 'Sending code...' : 'Send verification code'}
                            </Text>
                        </TouchableOpacity>
                        <Field
                            inputRef={codeInputRef}
                            icon="key-outline"
                            placeholder="Verification code"
                            value={registrationCode}
                            onChangeText={setRegistrationCode}
                            autoCapitalize="characters"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                    </FormSection>

                    <FormSection title="Contact and security" icon="shield-checkmark-outline">
                        <Field
                            inputRef={phoneInputRef}
                            icon="call-outline"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                        <PasswordField
                            inputRef={passwordInputRef}
                            placeholder="Password (6–20 characters)"
                            value={password}
                            onChangeText={setPassword}
                            visible={isPasswordVisible}
                            onToggle={() => setIsPasswordVisible((visible) => !visible)}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                            editable={!isBusy}
                        />
                        <PasswordField
                            inputRef={confirmPasswordInputRef}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            visible={isConfirmPasswordVisible}
                            onToggle={() => setIsConfirmPasswordVisible((visible) => !visible)}
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                            editable={!isBusy}
                        />
                    </FormSection>

                    <FormSection title="Required documents" icon="document-text-outline">
                        <Text className="text-[#64748B] text-xs leading-5 -mt-1 mb-1">
                            Upload a clear image or PDF of each document. Both are required.
                        </Text>
                        <DocumentButton
                            title="Citizen ID / CCCD"
                            file={citizenIdFile}
                            onPress={() => handlePickDocument('citizen')}
                            disabled={isBusy}
                        />
                        <DocumentButton
                            title="Student card"
                            file={studentCardFile}
                            onPress={() => handlePickDocument('student-card')}
                            disabled={isBusy}
                        />
                    </FormSection>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSubmit}
                        disabled={isBusy}
                        className={`rounded-2xl h-[54px] justify-center items-center mt-1 ${
                            isBusy ? 'bg-blue-300' : 'bg-[#1D63E0]'
                        }`}
                    >
                        <Text className="text-white font-bold text-base">
                            {isSubmitting ? 'Submitting application...' : 'Submit registration'}
                        </Text>
                    </TouchableOpacity>

                    <Link href="/login" asChild>
                        <TouchableOpacity activeOpacity={0.5} className="items-center py-2">
                            <Text className="font-bold text-blue-600 text-sm">Back to login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </AuthKeyboardLayout>
    );
}

function FormSection({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    children: React.ReactNode;
}) {
    return (
        <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-xl bg-blue-50 items-center justify-center">
                    <Ionicons name={icon} size={17} color="#2563EB" />
                </View>
                <Text className="text-[#1E293B] font-bold text-base ml-2.5">{title}</Text>
            </View>
            <View className="gap-2.5">{children}</View>
        </View>
    );
}

function Field({
    inputRef,
    icon,
    ...props
}: React.ComponentProps<typeof TextInput> & {
    inputRef?: React.RefObject<TextInput | null>;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
    return (
        <View className="h-[50px] items-center flex-row px-3 bg-slate-50 border border-slate-100 rounded-xl">
            <Ionicons name={icon} size={19} color="#64748B" />
            <TextInput
                ref={inputRef}
                className="flex-1 ml-2.5 text-[#1E293B]"
                placeholderTextColor="#94A3B8"
                autoCorrect={false}
                submitBehavior="submit"
                {...props}
            />
        </View>
    );
}

function PasswordField({
    visible,
    onToggle,
    ...props
}: Omit<React.ComponentProps<typeof Field>, 'icon'> & {
    visible: boolean;
    onToggle: () => void;
}) {
    return (
        <View className="h-[50px] items-center flex-row px-3 bg-slate-50 border border-slate-100 rounded-xl">
            <Ionicons name="lock-closed-outline" size={19} color="#64748B" />
            <TextInput
                ref={props.inputRef}
                className="flex-1 ml-2.5 text-[#1E293B]"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!visible}
                submitBehavior="submit"
                {...props}
            />
            <TouchableOpacity onPress={onToggle} className="p-1">
                <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={19} color="#64748B" />
            </TouchableOpacity>
        </View>
    );
}

function DocumentButton({
    title,
    file,
    onPress,
    disabled,
}: {
    title: string;
    file: RegistrationDocument | null;
    onPress: () => void;
    disabled: boolean;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled}
            className={`rounded-2xl border p-3 flex-row items-center ${
                file ? 'border-green-200 bg-green-50' : 'border-dashed border-blue-200 bg-blue-50'
            }`}
        >
            <Ionicons
                name={file ? 'checkmark-circle' : 'cloud-upload-outline'}
                size={21}
                color={file ? '#16A34A' : '#2563EB'}
            />
            <View className="ml-2.5 flex-1">
                <Text className="text-[#334155] text-sm font-bold">{title}</Text>
                <Text className="text-[#64748B] text-xs mt-0.5" numberOfLines={1}>
                    {file ? file.name : 'Tap to upload'}
                </Text>
            </View>
            <Text className={`text-xs font-bold ${file ? 'text-green-700' : 'text-blue-700'}`}>
                {file ? 'Ready' : 'Required'}
            </Text>
        </TouchableOpacity>
    );
}
