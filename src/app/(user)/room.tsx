import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SectionCard from '@/components/SectionCard';
import { Image } from 'expo-image';

import { MaterialIcons } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import RoomHistoryItem from '@/components/RoomHistoryItem';
import RoommateItem from '@/components/RoommateItem';
import { useRouter } from 'expo-router';
import { useStudentRoomOverview } from '@/hooks/useStudentRoomOverview';
export default function RoomScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { data: roomOverview, isError, isLoading } = useStudentRoomOverview();
    const availableBeds = roomOverview
        ? Math.max(roomOverview.capacity - roomOverview.occupancy, 0)
        : 0;
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
                                <Text className="font-bold text-xl">
                                    {roomOverview?.roomName ??
                                        (isLoading
                                            ? 'Loading...'
                                            : 'No room assigned')}
                                </Text>
                                <Text className="text-gray-400 font-medium">
                                    Floor {roomOverview?.floor ?? '-'}
                                    <Text className="font-bold">
                                        {' '}
                                        ·{' '}
                                    </Text> Block {roomOverview?.block ?? '-'}
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
                                        {roomOverview
                                            ? roomOverview.occupancy
                                            : '-'}
                                    </Text>
                                    <Text className="text-gray-400 font-medium">
                                        {' '}
                                        /{' '}
                                    </Text>
                                    <Text className="text-[#475569] font-bold">
                                        {roomOverview
                                            ? roomOverview.capacity
                                            : '-'}
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
                                Create issue ticket
                            </Text>
                            <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                Select a category and send details to dormitory
                                management.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() =>
                            router.push('/student-request-details/issue')
                        }
                        className="mt-4 rounded-2xl bg-orange-50 border border-orange-100 py-3 flex-row items-center justify-center"
                    >
                        <Text className="text-orange-700 font-bold text-sm">
                            Choose ticket category
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={17}
                            color="#C2410C"
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                </SectionCard>

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
                            Explain your request for management review.
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
                    {isLoading ? (
                        <View className="py-6 items-center">
                            <ActivityIndicator color="#2563EB" />
                        </View>
                    ) : isError ? (
                        <Text className="text-[#64748B] text-sm py-5">
                            Room history is unavailable right now.
                        </Text>
                    ) : roomOverview?.history.length ? (
                        <View>
                            {roomOverview.history.map((item, index) => (
                                <RoomHistoryItem
                                    key={item.id}
                                    roomName={item.roomName}
                                    floor={item.floor}
                                    block={item.block}
                                    dateRange={item.dateRange}
                                    isLast={
                                        index ===
                                        roomOverview.history.length - 1
                                    }
                                />
                            ))}
                        </View>
                    ) : (
                        <Text className="text-[#64748B] text-sm py-5">
                            No room history is available yet.
                        </Text>
                    )}
                    <View className="hidden">
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
                    <View className="hidden border border-gray-100 mt-3.5" />
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
                    {isLoading ? (
                        <View className="py-6 items-center">
                            <ActivityIndicator color="#2563EB" />
                        </View>
                    ) : isError ? (
                        <Text className="text-[#64748B] text-sm py-5">
                            Roommate information is unavailable right now.
                        </Text>
                    ) : roomOverview ? (
                        <View className="flex-row flex-wrap justify-between mt-4">
                            {roomOverview.roommates.map((roommate) => (
                                <View
                                    key={roommate.id}
                                    className="w-[48%] mb-4"
                                >
                                    <RoommateItem
                                        name={roommate.name}
                                        subtext={roommate.subtext}
                                        initials={getInitials(roommate.name)}
                                        isYou={roommate.isYou}
                                    />
                                </View>
                            ))}
                            {availableBeds > 0 && (
                                <View className="w-[48%] mb-4">
                                    <RoommateItem
                                        name="Vacant"
                                        subtext={`${availableBeds} bed(s) available`}
                                        isVacant={true}
                                    />
                                </View>
                            )}
                        </View>
                    ) : (
                        <Text className="text-[#64748B] text-sm py-5">
                            No current room assignment is available.
                        </Text>
                    )}
                    <View className="hidden flex-row flex-wrap justify-between mt-2">
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

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}
