import AuthKeyboardLayout from '@/components/auth/AuthKeyboardLayout';
import LogoImage from '@/components/LogoImage';
import { useLogin } from '@/hooks/useLogin';
import type { ApiErrorResponse } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import axios from 'axios';
import { Checkbox } from 'expo-checkbox';
import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function Login() {
    const loginMutation = useLogin();
    const passwordInputRef = useRef<TextInput>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isRemembered, setIsRemembered] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            toast.error('Error', {
                description: 'Please enter both email and password.',
            });

            return;
        }

        loginMutation.mutate(
            {
                email: normalizedEmail,
                password,
            },
            {
                onError: (error) => {
                    let errorMessage = 'Email or password is incorrect.';

                    if (axios.isAxiosError<ApiErrorResponse>(error)) {
                        errorMessage =
                            error.response?.data?.message ?? errorMessage;
                    }

                    toast.error('Login failed', {
                        description: errorMessage,
                    });
                },
            }
        );
    };
    return (
        <AuthKeyboardLayout>
            <View className="items-center flex-1 w-full pt-10 bg-[#F4FAFD]">
                <LogoImage />

                <Text className="font-bold text-4xl mb-3">Welcome back!</Text>

                <Text className="mb-6 px-10 text-center text-xs text-gray-500">
                    Sign in to continue using Dormly
                </Text>

                <View className="px-3 w-full">
                    {/* Account Input*/}
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <FontAwesome
                            name="user-o"
                            size={20}
                            color="#888"
                            style={{ marginRight: 13 }}
                        />
                        <TextInput
                            className="flex-1"
                            placeholder="Enter your ID or email address"
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType="email-address"
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                                passwordInputRef.current?.focus()
                            }
                            editable={!loginMutation.isPending}
                        />
                    </View>

                    {/* Password Input*/}
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <SimpleLineIcons
                            name="lock"
                            size={20}
                            color="#888"
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            ref={passwordInputRef}
                            className="flex-1"
                            placeholder="Enter your password"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            returnKeyType="done"
                            submitBehavior="submit"
                            onSubmitEditing={handleLogin}
                            editable={!loginMutation.isPending}
                        />
                        <TouchableOpacity
                            onPress={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                            }
                            className="p-1"
                        >
                            <Ionicons
                                name={
                                    isPasswordVisible
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Remember/Forget */}
                    <View className="justify-between flex-row px-2">
                        <View className="flex-row flex-1 items-center">
                            <Checkbox
                                value={isRemembered}
                                onValueChange={setIsRemembered}
                                color={isRemembered ? '#4a7fd4' : undefined}
                                style={{
                                    marginRight: 5,
                                    borderColor: '#aaa',
                                    transform: [{ scale: 0.85 }],
                                }}
                            />
                            <Text className="ml-1 text-sm font-medium">
                                Remember me
                            </Text>
                        </View>
                        <Link href="/(auth)/forgot-pass" asChild>
                            <TouchableOpacity activeOpacity={0.4}>
                                <Text className="text-blue-500 text-sm font-medium">
                                    Forget your password?
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Login button */}
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleLogin}
                        disabled={loginMutation.isPending}
                        className={`mt-10 h-[50px] items-center justify-center rounded-xl bg-[#1D63E0] ${
                            loginMutation.isPending ? 'opacity-60' : ''
                        }`}
                    >
                        <Text className="text-xl font-bold text-white">
                            {loginMutation.isPending
                                ? 'Signing in...'
                                : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <View className="items-center mt-4">
                        <Text className="font-medium text-sm">
                            {"Don't have an account?"}
                        </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity
                                activeOpacity={0.4}
                                className="mt-2"
                            >
                                <Text className="font-bold text-blue-500 text-base">
                                    Register student account
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    {/* <View className="items-center justify-center flex-row gap-5 mt-5">
                        <TouchableOpacity
                            onPress={() => router.replace('/(user)/home')}
                            className="bg-blue-500 px-3 py-2 rounded-xl"
                        >
                            <Text className="text-white font-medium">
                                Student
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                router.replace('/(admin)/dashboard')
                            }
                            className="bg-blue-500 px-3 py-2 rounded-xl"
                        >
                            <Text className="text-white font-medium">
                                Manager
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </AuthKeyboardLayout>
    );
}
