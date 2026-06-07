import AuthKeyboardLayout from '@/components/auth/AuthKeyboardLayout';
import LogoImage from '@/components/LogoImage';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function RegisterStudentAccount() {
    const router = useRouter();
    const studentIdInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const phoneInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);

    const [fullName, setFullName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);

    const handleSubmit = () => {
        if (
            !fullName.trim() ||
            !studentId.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !password ||
            !confirmPassword
        ) {
            toast.error('Error', {
                description: 'Please complete all registration fields.',
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

        toast.success('Registration submitted', {
            description: 'EIU Dormitory will review your student account.',
        });
        router.replace('/login');
    };

    return (
        <AuthKeyboardLayout>
            <View className="items-center flex-1 w-full pt-10 bg-[#F4FAFD]">
                <LogoImage />

                <Text className="font-bold text-3xl mb-2 text-[#1E293B]">
                    Student registration
                </Text>
                <Text className="text-gray-500 mb-6 text-sm px-10 text-center">
                    Create a student account request for EIU Dormitory review.
                </Text>

                <View className="px-3 w-full">
                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <FontAwesome
                            name="user-o"
                            size={20}
                            color="#888"
                            style={{ marginRight: 13 }}
                        />
                        <TextInput
                            className="flex-1"
                            placeholder="Full name"
                            placeholderTextColor="#aaa"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                                studentIdInputRef.current?.focus()
                            }
                        />
                    </View>

                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <Ionicons
                            name="card-outline"
                            size={20}
                            color="#888"
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            ref={studentIdInputRef}
                            className="flex-1"
                            placeholder="Student ID"
                            placeholderTextColor="#aaa"
                            value={studentId}
                            onChangeText={setStudentId}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                                emailInputRef.current?.focus()
                            }
                        />
                    </View>

                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#888"
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            ref={emailInputRef}
                            className="flex-1"
                            placeholder="EIU email address"
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
                                phoneInputRef.current?.focus()
                            }
                        />
                    </View>

                    <View className="h-[50px] items-center flex-row px-2 bg-white border border-[#EFEFEF] mb-3 rounded-xl">
                        <Ionicons
                            name="call-outline"
                            size={20}
                            color="#888"
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            ref={phoneInputRef}
                            className="flex-1"
                            placeholder="Phone number"
                            placeholderTextColor="#aaa"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                                passwordInputRef.current?.focus()
                            }
                        />
                    </View>

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
                            placeholder="Password"
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
                            placeholder="Confirm password"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCapitalize="none"
                            returnKeyType="done"
                            submitBehavior="submit"
                            onSubmitEditing={handleSubmit}
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

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleSubmit}
                        className="bg-[#1D63E0] rounded-xl h-[50px] justify-center items-center mt-5"
                    >
                        <Text className="text-white font-bold text-xl">
                            Submit registration
                        </Text>
                    </TouchableOpacity>

                    <Link href="/login" asChild>
                        <TouchableOpacity
                            activeOpacity={0.4}
                            className="items-center mt-5"
                        >
                            <Text className="font-bold text-blue-500 text-base">
                                Back to Login
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </AuthKeyboardLayout>
    );
}
