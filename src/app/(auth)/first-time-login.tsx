import AuthKeyboardLayout from '@/components/auth/AuthKeyboardLayout';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import LogoImage from '@/components/LogoImage';
import { toast } from 'sonner-native';

export default function FirstTimeLogin() {
    const router = useRouter();
    const confirmPasswordInputRef = useRef<TextInput>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        if (!password || !confirmPassword) {
            toast.error('Error', {
                description: 'Please enter and confirm your new password.',
            });
            return;
        }

        if (password.length < 8) {
            toast.error('Error', {
                description: 'Password must contain at least 8 characters.',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Error', {
                description: 'Passwords do not match.',
            });
            return;
        }

        toast.success('Success', {
            description: 'Your password has been changed.',
        });
        router.replace('/login');
    };

    return (
        <AuthKeyboardLayout>
            <View className="items-center flex-1 w-full bg-[#F4FAFD] pt-10">
                <LogoImage />
                <Text className="font-bold text-2xl mb-2">
                    Create your new password
                </Text>
                <Text className="text-center text-gray-500 text-base mb-3">
                    For security reasons, please create a new password to
                    protect your account.
                </Text>
                <View className="px-3 w-full">
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <SimpleLineIcons
                            name="lock"
                            size={20}
                            color="#888"
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            className="flex-1"
                            placeholder="Enter your new password"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                                confirmPasswordInputRef.current?.focus()
                            }
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
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <SimpleLineIcons
                            name="lock"
                            size={20}
                            color="#888"
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            ref={confirmPasswordInputRef}
                            className="flex-1"
                            placeholder="Confirm your new password"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCapitalize="none"
                            returnKeyType="done"
                            submitBehavior="submit"
                            onSubmitEditing={handleChangePassword}
                        />
                        <TouchableOpacity
                            onPress={() =>
                                setIsConfirmPasswordVisible(
                                    !isConfirmPasswordVisible
                                )
                            }
                            className="p-1"
                        >
                            <Ionicons
                                name={
                                    isConfirmPasswordVisible
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="bg-[#EEF5FD] flex-col py-3">
                        <View className="pl-3 flex-row">
                            <Octicons
                                name="shield-check"
                                size={24}
                                color="#346ED7"
                            />
                            <Text className="text-[#346ED7] font-bold ml-2">
                                Password requirements
                            </Text>
                        </View>

                        <View className="flex-col ml-4 mt-1">
                            <View className="flex-row">
                                <Entypo name="check" size={16} color="green" />
                                <Text className="ml-1 text-sm">
                                    At least 8 characters
                                </Text>
                            </View>
                            <View className="flex-row">
                                <Entypo name="check" size={16} color="green" />
                                <Text className="ml-1 text-sm">
                                    Include uppercase, lowercase, numbers, and
                                    special characters
                                </Text>
                            </View>
                            <View className="flex-row">
                                <Entypo name="check" size={16} color="green" />
                                <Text className="ml-1 text-sm">
                                    Cannot be the same as the old password
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleChangePassword}
                        className="bg-[#1D63E0] rounded-xl h-[50px] justify-center items-center mt-5"
                    >
                        <Text className="text-white font-bold text-xl">
                            Change password
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthKeyboardLayout>
    );
}
