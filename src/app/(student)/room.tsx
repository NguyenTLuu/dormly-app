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

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import Feather from '@expo/vector-icons/Feather';
import FunctionButton from '@/components/FunctionButton';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ActionRow from '@/components/ActionRow';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import StatusBadge from '@/components/StatusBadge';
import Octicons from '@expo/vector-icons/Octicons';
import RoomHistoryItem from '@/components/RoomHistoryItem';
import RoommateItem from '@/components/RoommateItem';

export default function RoomScreen() {
    const insets = useSafeAreaInsets();
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
                            <View className="self-center justify-center items-center flex-row border border-blue-500 px-3 py-1 rounded-xl">
                                <Text className="text-blue-600 font-semibold text-base">
                                    View Contract
                                </Text>
                            </View>
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
                        <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                            <Feather
                                name="alert-triangle"
                                size={18}
                                color="#2365E7"
                            />
                        </View>
                        <Text className="font-bold ml-2">Report Issue</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <FunctionButton
                            label={'Electrical'}
                            className="w-[23%] "
                        >
                            <AntDesign
                                name="thunderbolt"
                                size={20}
                                color="#2365E7"
                            />
                        </FunctionButton>
                        <FunctionButton label={'Water'} className="w-[23%]">
                            <Ionicons
                                name="water-sharp"
                                size={24}
                                color="#2365E7"
                            />
                        </FunctionButton>
                        <FunctionButton label={'Internet'} className="w-[23%]">
                            <FontAwesome5
                                name="wifi"
                                size={20}
                                color="#2365E7"
                            />
                        </FunctionButton>
                        <FunctionButton label={'Noise'} className="w-[23%]">
                            <Ionicons
                                name="volume-medium-sharp"
                                size={28}
                                color="#2365E7"
                            />
                        </FunctionButton>
                    </View>
                    <View className="border border-gray-100 mt-3.5" />
                    <ActionRow
                        label={'Other Issues'}
                        isLast={true}
                        textColor={'#2566E2'}
                    />
                </SectionCard>

                <SectionCard className="mx-4 mt-4">
                    <View className="flex-row items-center">
                        <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                            <FontAwesome6
                                name="message"
                                size={16}
                                color="#2365E7"
                            />
                        </View>
                        <Text className="font-bold ml-2">Complaint Center</Text>
                    </View>
                    <View className="border border-gray-200 rounded-xl bg-gray-100 mt-2 flex-row p-4 items-center ">
                        <Ionicons
                            name="document-text-outline"
                            size={36}
                            color="gray"
                        />
                        <View className="ml-2">
                            <Text className="font-medium text-gray-700">
                                No active complaints
                            </Text>
                            <Text className="font-medium text-gray-500 mt-1 text-sm">
                                You have no open complaints
                            </Text>
                        </View>
                    </View>
                    <View className="border border-gray-100 mt-3.5" />

                    <ActionRow
                        label={'View Complaint History'}
                        isLast={true}
                        textColor={'#2566E2'}
                    />
                </SectionCard>

                <SectionCard className="mx-4 mt-4">
                    <View className="flex-row items-center">
                        <View className="rounded-full w-8 h-8 bg-blue-50 justify-center items-center">
                            <MaterialCommunityIcons
                                name="swap-horizontal"
                                size={24}
                                color="#2365E7"
                            />
                        </View>
                        <Text className="font-bold mx-2">Transfer Request</Text>
                        <StatusBadge text={'Pending'} type={'warning'} />
                    </View>
                    <View className="mt-2">
                        <Text className="font-medium text-gray-500">
                            Reason
                        </Text>
                        <View className="border border-gray-200 rounded-xl bg-gray-100 mt-2 flex-row p-4 items-center">
                            <Text className="text-gray-500">
                                Need to move closer to classmates for group
                                study
                            </Text>
                        </View>
                        <View className="border border-gray-100 mt-3.5" />
                    </View>
                    <ActionRow
                        label={'Edit Request'}
                        isLast={true}
                        textColor={'#2566E2'}
                    />
                </SectionCard>

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
