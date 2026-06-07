import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SectionCard from '@/components/SectionCard';
import { Image } from 'expo-image';

import { MaterialIcons } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ActionRow from '@/components/ActionRow';
import Octicons from '@expo/vector-icons/Octicons';
import RoomHistoryItem from '@/components/RoomHistoryItem';
import RoommateItem from '@/components/RoommateItem';
import { useRouter } from 'expo-router';
import { StudentIssueType, studentIssueTypes } from '@/data/student-requests';

const issueTypeStyles: Record<
    StudentIssueType,
    { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
    Electric: { icon: 'flash-outline', color: '#D97706', bg: '#FEF3C7' },
    Water: { icon: 'water-outline', color: '#0284C7', bg: '#E0F2FE' },
    Internet: { icon: 'wifi-outline', color: '#2563EB', bg: '#DBEAFE' },
    Facility: { icon: 'build-outline', color: '#EA580C', bg: '#FFEDD5' },
};

export default function RoomScreen() {
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
                    className="bg-blue-600 rounded-b-2xl px-8"
                    style={{
                        paddingTop: insets.top + 16,
                        paddingBottom: 50,
                    }}
                >
                    <Text className="text-2xl text-white font-bold">Room</Text>
                    <Text className="text-white">
                        Manage your room and stays
                    </Text>
                </View>
                <SectionCard className="-mt-10 mx-4">
                    <View className="flex-row border-b border-gray-100 pb-3">
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
                                    Floor 2
                                    <Text className="font-bold"> · </Text> Block
                                    1
                                </Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={() =>
                                    router.push(
                                        '/student-request-details/contract'
                                    )
                                }
                                className="self-center justify-center items-center flex-row border border-blue-500 px-3 py-2 rounded-xl"
                            >
                                <Text className="text-blue-600 font-semibold text-base">
                                    View Contract
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-row pt-4">
                        <View className="flex-row w-1/2 items-center">
                            <View className="w-14 h-14 justify-center items-center bg-blue-50 rounded-full">
                                <MaterialIcons
                                    name="groups"
                                    size={26}
                                    color="#2365E7"
                                />
                            </View>
                            <View className="ml-3">
                                <Text className="text-[#64748B] font-medium text-sm mb-0.5">
                                    Occupancy
                                </Text>

                                <Text className="text-xl">
                                    <Text className="text-blue-600 font-bold">
                                        3
                                    </Text>
                                    <Text className="text-gray-400 font-medium">
                                        {' '}
                                        /{' '}
                                    </Text>
                                    <Text className="text-[#475569] font-bold">
                                        4
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row w-1/2 items-center">
                            <View className="w-14 h-14 justify-center items-center bg-green-50 rounded-full">
                                <Foundation
                                    name="dollar"
                                    size={30}
                                    color="#5F9648"
                                />
                            </View>
                            <View className="ml-3">
                                <Text className="text-[#64748B] font-medium text-sm mb-0.5">
                                    Monthly Fee
                                </Text>
                                <Text className="text-xl font-medium">
                                    800,000 VND
                                </Text>
                            </View>
                        </View>
                    </View>
                </SectionCard>

                <SectionCard className="mx-4 mt-4">
                    <View className="flex-row items-center">
                        <View className="rounded-xl w-10 h-10 bg-orange-100 justify-center items-center">
                            <Ionicons
                                name="construct-outline"
                                size={20}
                                color="#EA580C"
                            />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="font-bold text-[#1E293B]">
                                Report an issue
                            </Text>
                            <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                Choose a type to start a detailed report.
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row flex-wrap justify-between mt-4">
                        {studentIssueTypes.map((type) => {
                            const style = issueTypeStyles[type];
                            return (
                                <TouchableOpacity
                                    key={type}
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                '/student-request-details/issue',
                                            params: { type },
                                        })
                                    }
                                    className="w-[48%] rounded-2xl border border-slate-100 p-3 mb-3 flex-row items-center"
                                >
                                    <View
                                        className="w-10 h-10 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: style.bg }}
                                    >
                                        <Ionicons
                                            name={style.icon}
                                            size={20}
                                            color={style.color}
                                        />
                                    </View>
                                    <Text className="text-[#475569] text-sm font-bold ml-2 flex-1">
                                        {type}
                                    </Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color="#CBD5E1"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </SectionCard>

                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                        router.push('/student-request-details/complaint')
                    }
                    className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-purple-100 shadow-xl flex-row items-center"
                >
                    <View className="rounded-2xl w-12 h-12 bg-purple-100 justify-center items-center">
                        <Ionicons
                            name="chatbox-ellipses-outline"
                            size={22}
                            color="#7C3AED"
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="font-bold text-[#1E293B]">
                            Create a complaint
                        </Text>
                        <Text className="text-[#64748B] text-xs font-medium mt-1">
                            Describe your concern and attach supporting files.
                        </Text>
                    </View>
                    <Ionicons
                        name="arrow-forward-circle"
                        size={27}
                        color="#7C3AED"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                        router.push('/student-request-details/transfer')
                    }
                    className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-blue-100 shadow-xl flex-row items-center"
                >
                    <View className="rounded-2xl w-12 h-12 bg-blue-100 justify-center items-center">
                        <Ionicons
                            name="swap-horizontal"
                            size={23}
                            color="#2563EB"
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="font-bold text-[#1E293B]">
                            Request room transfer
                        </Text>
                        <Text className="text-[#64748B] text-xs font-medium mt-1">
                            Browse available rooms by block and floor.
                        </Text>
                    </View>
                    <Ionicons
                        name="arrow-forward-circle"
                        size={27}
                        color="#2563EB"
                    />
                </TouchableOpacity>

                <SectionCard className="mx-4 mt-4">
                    <View className="flex-row items-center">
                        <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                            <Octicons
                                name="history"
                                size={18}
                                color="#2365E7"
                            />
                        </View>
                        <Text className="font-bold mx-2">Room History</Text>
                    </View>
                    <View>
                        <RoomHistoryItem
                            roomName="Room B210"
                            floor="1"
                            block="2"
                            dateRange="Feb 2024 – Jul 2024"
                        />
                        <RoomHistoryItem
                            roomName="Room C305"
                            floor="3"
                            block="3"
                            dateRange="Sep 2023 – Jan 2024"
                        />
                        <RoomHistoryItem
                            roomName="Room D112"
                            floor="1"
                            block="1"
                            dateRange="Sep 2022 – Aug 2023"
                            isLast={true}
                        />
                    </View>
                    <View className="border border-gray-100 mt-3.5" />
                    <ActionRow
                        label={'View All History'}
                        isLast={true}
                        textColor={'#2566E2'}
                    />
                </SectionCard>

                <SectionCard className="mx-4 mt-4">
                    <View className="flex-row items-center">
                        <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                            <FontAwesome5
                                name="user-friends"
                                size={14}
                                color="#2365E7"
                            />
                        </View>
                        <Text className="font-bold mx-2">Roommates</Text>
                    </View>
                    <View className="flex-row flex-wrap justify-between mt-2">
                        <View className="w-[48%] mb-4">
                            <RoommateItem
                                name="Nguyen Van A"
                                subtext="2231200123"
                                avatar={require('@/assets/icons/user-icon.png')}
                                isYou={true}
                            />
                        </View>

                        <View className="w-[48%] mb-4">
                            <RoommateItem
                                name="Tran Phuoc"
                                subtext="2231200456"
                                initials="TP"
                            />
                        </View>

                        <View className="w-[48%]">
                            <RoommateItem
                                name="Le Duc"
                                subtext="2231200789"
                                initials="LD"
                            />
                        </View>

                        <View className="w-[48%]">
                            <RoommateItem
                                name="Vacant"
                                subtext="Available"
                                isVacant={true}
                            />
                        </View>
                    </View>
                </SectionCard>
            </ScrollView>
        </>
    );
}
