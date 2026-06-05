import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Animated,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Image } from 'expo-image';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SectionCard from '@/components/SectionCard';
import InfoRow from '@/components/InfoRow';
import * as assert from 'node:assert';
import ActionRow from '@/components/ActionRow';
import StatusBadge from '@/components/StatusBadge';
import ScrollView = Animated.ScrollView;
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const handleLogOut = () => {
        router.replace('/login');
    };

    // 1. Khởi tạo Mock Data
    const [profileData, setProfileData] = useState({
        fullName: 'Nguyen Van A',
        studentId: '2231200123',
        email: 'a.nguyenvan.cit22@eiu.edu.vn',
        phone: '0123456789',
        dob: '01/01/2004',
        major: 'Software Engineer',
    });

    // 2. State quản lý Modal và form tạm thời khi edit
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState(profileData);

    // 3. Hàm xử lý mở Modal và Lưu dữ liệu
    const handleOpenEdit = () => {
        setEditForm(profileData); // Copy dữ liệu hiện tại vào form
        setEditModalVisible(true);
    };

    const handleSave = () => {
        setProfileData(editForm); // Cập nhật dữ liệu mới
        setEditModalVisible(false);
    };
    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-white flex-1 relative">
                <View
                    className="bg-blue-600 rounded-b-2xl px-8"
                    style={{ paddingTop: insets.top + 16, paddingBottom: 50 }}
                >
                    <Text className="text-white text-2xl font-bold">
                        Profile
                    </Text>
                    <Text className="text-white">Manage your information</Text>
                </View>
                <View className="mx-4 p-4 bg-white -mt-10 shadow-xl border-gray-900 flex-row items-center rounded-2xl">
                    <View className="w-28 h-28 rounded-full items-center justify-center relative">
                        <Image
                            source={require('@/assets/icons/user-icon.png')}
                            style={{ width: '80%', height: '80%' }}
                            contentFit="cover"
                        />
                        <TouchableOpacity className="justify-center items-center border-white border-2 bg-blue-600 absolute bottom-3 right-2 w-8 h-8 rounded-full">
                            <FontAwesome
                                name="camera"
                                size={14}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-col gap-2 ml-2">
                        <Text className="font-bold text-xl">
                            {profileData.fullName}
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            Student ID: {profileData.studentId}
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            {profileData.major}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-2 p-2 border border-blue-500 rounded-xl"
                        onPress={handleOpenEdit}
                    >
                        <FontAwesome6 name="pencil" size={16} color="#3b82f6" />
                        <Text className="font-medium text-sm text-blue-500">
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Personal Information</Text>
                    <View className="px-2">
                        <InfoRow
                            label={'Full name'}
                            value={profileData.fullName}
                        >
                            <FontAwesome5 name="user" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label={'Student ID'}
                            value={profileData.studentId}
                        >
                            <AntDesign name="idcard" size={20} color="black" />
                        </InfoRow>
                        <InfoRow label={'Faculty'} value={profileData.major}>
                            <Entypo
                                name="graduation-cap"
                                size={22}
                                color="black"
                            />
                        </InfoRow>
                        <InfoRow
                            label={'Phone number'}
                            value={profileData.phone}
                        >
                            <Feather name="phone" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label={'Email'}
                            value={profileData.email}
                            isLast={true}
                        >
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={20}
                                color="black"
                            />
                        </InfoRow>
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Current Room</Text>

                    <View className="flex-row mt-2 items-center">
                        <View className="w-16 h-16 rounded-full bg-blue-200 items-center justify-center">
                            <Image
                                source={require('@/assets/icons/door-icon.png')}
                                style={{ width: '70%', height: '70%' }}
                                contentFit="cover"
                            />
                        </View>
                        <View className="flex-col ml-4 flex-1">
                            <Text className="font-bold text-xl">Room A365</Text>
                            <Text className="font-medium text-gray-400">
                                Floor 2 · Block 1
                            </Text>
                        </View>
                        <Link href="/room" asChild>
                            <TouchableOpacity className="p-2 rounded-xl border-blue-500 border">
                                <Text className="text-blue-500 font-medium text-sm">
                                    View Detail
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Personal Documents</Text>
                    <View className="px-2">
                        <ActionRow
                            label={'Citizen ID'}
                            rightElement={
                                <StatusBadge text="Uploaded" type="success" />
                            }
                        >
                            <FontAwesome
                                name="id-card-o"
                                size={18}
                                color="black"
                            />
                        </ActionRow>
                        <ActionRow
                            label={'Temporary Residence'}
                            rightElement={
                                <StatusBadge text="Uploaded" type="success" />
                            }
                            isLast={true}
                        >
                            <MaterialCommunityIcons
                                name="home-city-outline"
                                size={18}
                                color="black"
                            />
                        </ActionRow>
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Account Settings</Text>
                    <View className="px-2">
                        <ActionRow label={'Change Password'}>
                            <SimpleLineIcons
                                name="lock"
                                size={20}
                                color="black"
                                style={{ marginRight: 10 }}
                            />
                        </ActionRow>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row items-center py-3.5"
                            onPress={handleLogOut}
                        >
                            <View className="w-8 items-start justify-center">
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={20}
                                    color="red"
                                />
                            </View>

                            <Text className="flex-1 text-sm font-medium text-red-500">
                                Log out
                            </Text>

                            <Entypo
                                name="chevron-right"
                                size={20}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>
                </SectionCard>
                <Modal
                    visible={isEditModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 justify-end bg-black/50"
                    >
                        <View className="bg-white rounded-t-3xl p-6">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold text-gray-800">
                                    Edit Personal Info
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color="#4b5563"
                                    />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <View>
                                    <Text className="text-gray-500 mb-1 text-sm">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                                        value={editForm.email}
                                        onChangeText={(text) =>
                                            setEditForm({
                                                ...editForm,
                                                email: text,
                                            })
                                        }
                                        keyboardType="email-address"
                                    />
                                </View>

                                {/* Phone */}
                                <View>
                                    <Text className="text-gray-500 mb-1 text-sm">
                                        Phone Number
                                    </Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                                        value={editForm.phone}
                                        onChangeText={(text) =>
                                            setEditForm({
                                                ...editForm,
                                                phone: text,
                                            })
                                        }
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                {/* DOB */}
                                <View>
                                    <Text className="text-gray-500 mb-1 text-sm">
                                        Date of Birth
                                    </Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                                        value={editForm.dob}
                                        onChangeText={(text) =>
                                            setEditForm({
                                                ...editForm,
                                                dob: text,
                                            })
                                        }
                                    />
                                </View>
                            </ScrollView>

                            {/* Action Buttons */}
                            <View className="flex-row mt-6 space-x-3 mb-4">
                                <TouchableOpacity
                                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text className="text-gray-600 font-semibold">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
                                    onPress={handleSave}
                                >
                                    <Text className="text-white font-semibold">
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </ScrollView>
        </>
    );
}
