import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Checkbox } from 'expo-checkbox';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link, useRouter } from 'expo-router';
import LogoImage from '@/components/LogoImage';

const MOCK_USERS = [
    {
        email: 'student@dormly.com',
        password: '123456',
        role: 'STUDENT',
    },
    {
        email: 'manager@dormly.com',
        password: '123456',
        role: 'MANAGER',
    },
];

export default function Login() {
    const router = useRouter();

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isRemembered, setIsRemembered] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password!');
            return;
        }

        const user = MOCK_USERS.find(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.password === password
        );

        if (user) {
            if (user.role === 'STUDENT') {
                router.replace('/(student)/home');
            } else if (user.role === 'MANAGER') {
                router.replace('/(manager)/dashboard');
            }
        } else {
            Alert.alert('Error', 'Email or password is incorrect!');
        }
    };
    return (
        <ScreenWrapper>
            <View className="items-center flex-1 w-full  pt-10 bg-[#F4FAFD]">
                <LogoImage />

                <Text className="font-bold text-4xl mb-3">Welcome back!</Text>

                <Text className="text-gray-500 mb-6 text-xs px-10 text-center">
                    student@dormly.com || manager@dormly.com (Pass: 123456)
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
                            className="flex-1"
                            placeholder="Enter your password"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
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
                        <Link href="/forgot-pass" asChild>
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
                        className="bg-[#1D63E0] rounded-xl h-[50px] justify-center items-center mt-10"
                    >
                        <Text className="text-white font-bold text-xl">
                            Login
                        </Text>
                    </TouchableOpacity>

                    <View className="items-center mt-4">
                        <Text className="font-medium text-sm">
                            {"Don't have an account?"}
                        </Text>
                        <TouchableOpacity activeOpacity={0.4} className="mt-2">
                            <Text className="font-bold text-blue-500 text-base">
                                Contact with EIU Dormitory
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
}
