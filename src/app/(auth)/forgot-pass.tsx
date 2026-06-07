import { ScreenWrapper } from '@/components/ScreenWrapper';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import LogoImage from '@/components/LogoImage';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { toast } from 'sonner-native';

export default function ResetPassScreen() {
    const router = useRouter();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmitStep1 = () => {
        if (!email.trim()) {
            toast.error('Error', {
                description: 'Please enter your email or ID.',
            });
            return;
        }
        setStep(2);
    };

    const handleSubmitStep2 = () => {
        if (!otp.trim()) {
            toast.error('Error', {
                description: 'Please enter the verification code.',
            });
            return;
        }
        if (otp === '123456') {
            setStep(3);
        } else {
            toast.error('Error', {
                description: 'Invalid verification code. Try 123456',
            });
        }
    };

    const handleSubmitStep3 = () => {
        if (!newPassword || newPassword !== confirmPassword) {
            toast.error('Error', {
                description: 'Passwords do not match or are empty.',
            });
            return;
        }
        toast.success('Success', {
            description: 'Your password has been reset successfully.',
        });
        router.replace('/login');
    };

    const getStepCircleStyle = (stepNumber: number) => {
        const isActive = step >= stepNumber;
        return `w-7 h-7 rounded-full border-[1.5px] items-center justify-center mb-2 ${
            isActive
                ? 'bg-[#208AEF] border-[#208AEF]'
                : 'bg-white border-[#D9D9D9]'
        }`;
    };

    const getStepNumberStyle = (stepNumber: number) => {
        const isActive = step >= stepNumber;
        return `text-sm font-semibold ${isActive ? 'text-white' : 'text-[#D9D9D9]'}`;
    };

    const getStepLabelStyle = (stepNumber: number) => {
        const isActive = step >= stepNumber;
        return `text-[11px] text-center h-4 ${
            isActive
                ? 'font-semibold text-[#208AEF]'
                : 'font-medium text-[#D9D9D9]'
        }`;
    };
    return (
        <ScreenWrapper className="bg-[#F4FAFD]">
            <View className="flex-1 items-center px-6 pt-10 bg-[#F4FAFD]">
                <LogoImage />
                <Text className="text-2xl font-bold text-[#1E293B] mb-10">
                    Forgot Password
                </Text>

                <View className="flex-row items-center justify-center mb-12 w-full">
                    {/* Step 1 */}
                    <View className="items-center justify-center w-[22%]">
                        <View className={getStepCircleStyle(1)}>
                            <Text className={getStepNumberStyle(1)}>1</Text>
                        </View>
                        <Text className={getStepLabelStyle(1)}>
                            Enter Email
                        </Text>
                    </View>

                    {/* Line 1-2 */}
                    <View
                        className={`flex-1 h-[2px] mb-6 ${step >= 2 ? 'bg-[#208AEF]' : 'bg-[#D9D9D9]'}`}
                    />

                    {/* Step 2 */}
                    <View className="items-center justify-center w-[22%]">
                        <View className={getStepCircleStyle(2)}>
                            <Text className={getStepNumberStyle(2)}>2</Text>
                        </View>
                        <Text className={getStepLabelStyle(2)}>
                            Verification
                        </Text>
                    </View>

                    {/* Line 2-3 */}
                    <View
                        className={`flex-1 h-[2px] mb-6 ${step >= 3 ? 'bg-[#208AEF]' : 'bg-[#D9D9D9]'}`}
                    />

                    {/* Step 3 */}
                    <View className="items-center justify-center w-[22%]">
                        <View className={getStepCircleStyle(3)}>
                            <Text className={getStepNumberStyle(3)}>3</Text>
                        </View>
                        <Text className={getStepLabelStyle(3)}>
                            Reset Password
                        </Text>
                    </View>
                </View>


                {/* Step 1 */}
                {step === 1 && (
                    <View className="w-full items-center">
                        <Text className="text-base leading-6 text-[#1E293B] text-center mb-7 px-5">
                            Enter your Student ID or email to receive a password
                            reset verification code.
                        </Text>
                        <View className="flex-row items-center w-full h-14 border border-[#E2E8F0] rounded-xl px-4 mb-7">
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#64748B"
                                style={{ marginRight: 12 }}
                            />
                            <TextInput
                                className="flex-1 text-base text-[#1E293B]"
                                placeholder="Student ID or Email"
                                placeholderTextColor="#A0AEC0"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSubmitStep1}
                            className="w-full h-14 bg-[#208AEF] rounded-xl items-center justify-center mb-7"
                        >
                            <Text className="text-lg font-bold text-white">
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <View className="w-full items-center">
                        <Text className="text-base leading-6 text-[#1E293B] text-center mb-7 px-5">
                            Please enter the 6-digit verification code sent to
                            {'\n'}
                            <Text className="font-bold">{email}</Text>
                        </Text>
                        <View className="flex-row items-center w-full h-14 border border-[#E2E8F0] rounded-xl px-4 mb-7">
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={20}
                                color="#64748B"
                                style={{ marginRight: 12 }}
                            />
                            <TextInput
                                className="flex-1 text-base text-[#1E293B] tracking-widest"
                                placeholder="Enter Code (e.g., 123456)"
                                placeholderTextColor="#A0AEC0"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSubmitStep2}
                            className="w-full h-14 bg-[#208AEF] rounded-xl items-center justify-center mb-7"
                        >
                            <Text className="text-lg font-bold text-white">
                                Verify Code
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setStep(1)}>
                            <Text className="text-sm font-medium text-[#64748B]">
                                Wrong email? Go back
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <View className="w-full items-center">
                        <Text className="text-base leading-6 text-[#1E293B] text-center mb-7 px-5">
                            Create a new secure password for your account.
                        </Text>

                        {/* New Pass */}
                        <View className="flex-row items-center w-full h-14 border border-[#E2E8F0] rounded-xl px-4 mb-4">
                            <SimpleLineIcons
                                name="lock"
                                size={20}
                                color="#888"
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-base text-[#1E293B]"
                                placeholder="New Password"
                                placeholderTextColor="#A0AEC0"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm New Pass */}
                        <View className="flex-row items-center w-full h-14 border border-[#E2E8F0] rounded-xl px-4 mb-7">
                            <SimpleLineIcons
                                name="lock"
                                size={20}
                                color="#888"
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-base text-[#1E293B]"
                                placeholder="Confirm Password"
                                placeholderTextColor="#A0AEC0"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                <Ionicons
                                    name={
                                        showConfirmPassword
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmitStep3}
                            className="w-full h-14 bg-[#208AEF] rounded-xl items-center justify-center mb-7"
                        >
                            <Text className="text-lg font-bold text-white">
                                Reset Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Return to Login */}
                {step === 1 && (
                    <Link href="/login" asChild>
                        <TouchableOpacity
                            className="items-center mt-2"
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-medium text-[#208AEF]">
                                Back to Login
                            </Text>
                        </TouchableOpacity>
                    </Link>
                )}
            </View>
        </ScreenWrapper>
    );
}
