import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-white flex-1 relative">
                <View
                    className="bg-blue-600 px-5 rounded-b-2xl"
                    style={{
                        paddingTop: insets.top + 16,
                        paddingBottom: 50,
                    }}
                >
                    <TouchableOpacity>
                        <Feather name="menu" size={30} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl mt-6 mb-1.5">
                        Hello,
                        <Text className="font-bold text-white">
                            Nguyen Van A
                        </Text>
                    </Text>
                    <View className="flex-row">
                        <Text className="text-white">
                            Student ID: 2231200123
                        </Text>
                        <Text className="text-white font-bold"> · </Text>
                        <Text className="text-white">Software Engineer</Text>
                    </View>
                </View>

                <View className="bg-white shadow-2xl elevation-4 -mt-8 mx-4 p-4 rounded-xl flex-row  items-center">
                    <View className="h-20 w-20 rounded-full bg-blue-200 items-center justify-center">
                        <Image
                            source={require('@/assets/icons/door-icon.png')}
                            style={{ width: '70%', height: '70%' }}
                            contentFit="cover"
                        />
                    </View>
                    <View className="flex-row flex-1">
                        <View className="flex-col ml-3 flex-1">
                            <Text className="text-gray-500 font-medium">
                                Current Room
                            </Text>
                            <Text className="font-bold text-xl">A365</Text>
                            <Text className="text-gray-400 font-medium">
                                Floor 2<Text className="font-bold"> · </Text>{' '}
                                Block 1
                            </Text>
                        </View>
                        <Link href="/room" asChild>
                            <TouchableOpacity className="justify-center">
                                <Text className="text-blue-600 font-semibold text-base border border-blue-500 px-4 py-2 rounded-xl bg-white">
                                    Detail
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                <View className="p-4 mx-4 mt-3 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-300 elevation-2">
                    <View className="justify-between flex-row px-1 mb-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-semibold">
                                New notifications
                            </Text>
                            <View className="bg-red-600 w-5 h-5 items-center justify-center rounded-full ml-1">
                                <Text className="font-bold text-white">3</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-semibold">
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-col">
                        <View className="flex-row items-center mb-3">
                            <View className="w-16 h-16 bg-[#FEF1E6] justify-center items-center rounded-xl">
                                <Image
                                    source={require('@/assets/icons/electric-icon.png')}
                                    style={{ width: '60%', height: '60%' }}
                                    contentFit="cover"
                                />
                            </View>
                            <View className="flex-col ml-3">
                                <Text className="font-bold">
                                    Power outage schedule for Block 1
                                </Text>
                                <Text className="text-gray-500 font-medium text-sm">
                                    Friday, 22/05/2026 from 08:00 - 11:00
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mb-3">
                            <View className="w-16 h-16 bg-[#E1EDFD] justify-center items-center rounded-xl">
                                <Image
                                    source={require('@/assets/icons/document-icon.png')}
                                    style={{ width: '60%', height: '60%' }}
                                    contentFit="cover"
                                />
                            </View>
                            <View className="flex-col ml-3">
                                <Text className="font-bold">
                                    New dormitory rules
                                </Text>
                                <Text className="text-gray-500 font-medium text-sm">
                                    20/05/2024
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 bg-[#f5e1e3] justify-center items-center rounded-xl">
                                <Image
                                    source={require('@/assets/icons/megaphone-icon.png')}
                                    style={{ width: '60%', height: '60%' }}
                                    contentFit="cover"
                                />
                            </View>
                            <View className="flex-col ml-3">
                                <Text className="font-bold">
                                    Emergency notification
                                </Text>
                                <Text className="text-gray-500 font-medium text-sm">
                                    18/05/2024
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="mx-4 mt-6">
                    <Text className="text-[#1E293B] text-lg font-bold mb-3">
                        Quick actions
                    </Text>
                    <View className="flex-row justify-between items-start">
                        <TouchableOpacity
                            className="w-[23%] h-24 bg-white rounded-2xl p-2 items-center justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                            activeOpacity={0.5}
                        >
                            <MaterialCommunityIcons
                                name="wrench"
                                size={28}
                                color="#F97316"
                            />
                            <Text className="text-[#334155] text-[11px] font-semibold text-center mt-2 leading-tight">
                                Report an issue
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-[23%] h-24 bg-white rounded-2xl p-2 items-center justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                            activeOpacity={0.5}
                        >
                            <Ionicons
                                name="swap-horizontal"
                                size={30}
                                color="#22C55E"
                            />
                            <Text className="text-[#334155] text-[11px] font-semibold text-center mt-2 leading-tight">
                                Change room
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-[23%] h-24 bg-white rounded-2xl p-2 items-center justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                            activeOpacity={0.5}
                        >
                            <Ionicons
                                name="chatbubbles"
                                size={28}
                                color="#A855F7"
                            />
                            <Text className="text-[#334155] text-[11px] font-semibold text-center mt-2 leading-tight">
                                Submit a complaint
                            </Text>
                        </TouchableOpacity>

                        <Link href="/chat/bot" asChild>
                            <TouchableOpacity
                                className="w-[23%] h-24 bg-white rounded-2xl p-2 items-center justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                                activeOpacity={0.5}
                            >
                                <MaterialCommunityIcons
                                    name="robot-outline"
                                    size={30}
                                    color="#9333EA"
                                />
                                <Text className="text-[#334155] text-[11px] font-semibold text-center mt-2 leading-tight">
                                    Chat bot
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
                <View className="mx-4 mt-6">
                    <Text className="text-[#1E293B] text-lg font-bold mb-3">
                        Your status
                    </Text>
                    <View className="flex-row justify-between items-start">
                        <TouchableOpacity
                            className="w-[48%] h-24 bg-white rounded-2xl p-1 justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                            activeOpacity={0.5}
                        >
                            <View className="flex-row items-center">
                                <View className="w-3/4">
                                    <Text className="text-sm font-medium text-gray-600">
                                        Reported issues
                                    </Text>
                                    <Text className="text-sm font-medium text-gray-400 mt-2">
                                        1 in progress
                                    </Text>
                                </View>
                                <View className="flex-1 justify-between items-center">
                                    <Text className="text-3xl font-medium">
                                        2
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-[48%] h-24 bg-white rounded-2xl p-1 justify-center border border-gray-100 shadow-sm shadow-gray-200 elevation-1"
                            activeOpacity={0.5}
                        >
                            <View className="flex-row items-center">
                                <View className="w-3/4">
                                    <Text className="text-sm font-medium text-gray-600">
                                        Submitted complaints
                                    </Text>
                                    <Text className="text-sm font-medium text-gray-400 mt-2">
                                        In progress
                                    </Text>
                                </View>
                                <View className="flex-1 justify-between items-center">
                                    <Text className="text-3xl font-medium">
                                        1
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
