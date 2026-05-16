import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Checkbox } from 'expo-checkbox';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function LoginScreen() {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isRemembered, setIsRemembered] = useState<boolean>(false);
    return (
        <ScreenWrapper className="bg-[#F4FAFD]">
            <View className="items-center flex-1 w-full bg-[#F4FAFD] mt-10">
                <View className="items-center mb-4 ">
                    <View className="flex-row items-center">
                        <Image
                            source={require('@/assets/dormly-logo.png')}
                            style={{ width: 100, height: 100 }}
                            contentFit="contain"
                        />
                        <Text className="text-3xl font-bold text-[#0A4DB8] mt-2">
                            DORMLY
                        </Text>
                    </View>
                    <Text className="text-gray-500 font-medium text-base">
                        Smart Dormitory Management
                    </Text>
                </View>
                <View className="h-48 w-screen mb-6">
                    <Image
                        source={require('@/assets/dorm-image.png')}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                </View>
                <Text className="font-bold text-4xl mb-3">Welcome back!</Text>

                <View className="px-3 w-full">
                    {/* Account Input*/}
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <FontAwesome
                            name="user-o"
                            size={24}
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
                            size={24}
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
                            <Feather
                                name={isPasswordVisible ? 'eye' : 'eye-off'}
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Remember/Forget */}
                    <View className="justify-between flex-row px-2">
                        <View className="flex-row flex-1">
                            <Checkbox
                                value={isRemembered}
                                onValueChange={setIsRemembered}
                                color={isRemembered ? '#4a7fd4' : undefined}
                                style={{ marginRight: 5, borderColor: '#aaa' }}
                            />
                            <Text className="ml-2">Remember me</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.4}>
                            <Text className="text-blue-500">
                                Forget your password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login button */}
                    <TouchableOpacity
                        activeOpacity={0.6}
                        className="bg-[#1D63E0] rounded-xl h-[50px] justify-center items-center mt-10"
                    >
                        <Text className="text-white font-bold text-xl">
                            Login
                        </Text>
                    </TouchableOpacity>

                    {/* Activate account */}
                    <View className="items-center mt-4">
                        <Text className="font-medium">
                            Don't have an account?
                        </Text>
                        <TouchableOpacity activeOpacity={0.4} className="mt-2">
                            <Text className="font-bold text-blue-500">
                                Contact with EIU Dormitory
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View></View>
                </View>
            </View>
        </ScreenWrapper>
    );
}
