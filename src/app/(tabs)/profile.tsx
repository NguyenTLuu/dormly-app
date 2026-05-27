import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
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
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const handleLogOut = () => {
        router.replace('/login');
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
                    className="bg-blue-600 rounded-b-2xl"
                    style={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
                />
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
                        <Text className="font-bold text-xl">Nguyen Van A</Text>
                        <Text className="font-medium text-sm text-gray-500">
                            Student ID: 2231200123
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            Software Engineer
                        </Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center justify-center gap-2 p-2 border border-blue-500 rounded-xl">
                        <FontAwesome6 name="pencil" size={16} color="#3b82f6" />
                        <Text className="font-medium text-sm text-blue-500">
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Personal Information</Text>
                    <View className="px-2">
                        <InfoRow label={'Full name'} value={'Nguyen Van A'}>
                            <FontAwesome5 name="user" size={20} color="black" />
                        </InfoRow>
                        <InfoRow label={'Student ID'} value={'2231200123'}>
                            <AntDesign name="idcard" size={20} color="black" />
                        </InfoRow>
                        <InfoRow label={'Faculty'} value={'Software Engineer'}>
                            <Entypo
                                name="graduation-cap"
                                size={22}
                                color="black"
                            />
                        </InfoRow>
                        <InfoRow label={'Phone number'} value={'0909141516'}>
                            <Feather name="phone" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label={'Email'}
                            value={'a.nguyenvan.cit22@eiu.edu.vn'}
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
                        <TouchableOpacity className="p-2 rounded-xl border-blue-500 border">
                            <Text className="text-blue-500 font-medium text-sm">
                                View Detail
                            </Text>
                        </TouchableOpacity>
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
            </ScrollView>
        </>
    );
}
