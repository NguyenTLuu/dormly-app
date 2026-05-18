import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Checkbox } from 'expo-checkbox';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link, useRouter } from 'expo-router';
import LogoImage from '@/components/LogoImage';

export default function Login() {
    const router = useRouter();

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isRemembered, setIsRemembered] = useState<boolean>(false);
    return (
        <ScreenWrapper>
            <View className="items-center flex-1 w-full  pt-10 bg-[#F4FAFD]">
                <LogoImage />

                <Text className="font-bold text-4xl mb-3">Welcome back!</Text>

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
                            <Text className="ml-1 text-sm font-medium">Remember me</Text>
                        </View>
                        <Link href="/reset-pass" asChild>
                            <TouchableOpacity activeOpacity={0.4}>
                                <Text className="text-blue-500 text-sm font-medium">
                                    Forget your password?
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Login button */}
                    <Link href="/first-time-login" asChild>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            className="bg-[#1D63E0] rounded-xl h-[50px] justify-center items-center mt-10"
                        >
                            <Text className="text-white font-bold text-xl">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <View className="items-center mt-4">
                        <Text className="font-medium text-sm">
                            Don't have an account?
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
