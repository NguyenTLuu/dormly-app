import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

interface RoommateItemProps {
    name: string;
    subtext: string;
    avatar?: any;
    initials?: string;
    isYou?: boolean;
    isVacant?: boolean;
}

export default function RoommateItem({
    name,
    subtext,
    avatar,
    initials,
    isYou = false,
    isVacant = false,
}: RoommateItemProps) {
    return (
        <View className="flex-row items-center">
            <View className="w-[42px] h-[42px] justify-center items-center mr-2.5">
                {isVacant ? (
                    <View className="w-full h-full rounded-full border border-dashed border-blue-500 items-center justify-center bg-white">
                        <Feather name="plus" size={18} color="#3B82F6" />
                    </View>
                ) : avatar ? (
                    <Image
                        source={avatar}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 999,
                        }}
                        contentFit="cover"
                    />
                ) : (
                    <View className="w-full h-full rounded-full bg-[#EFF6FF] items-center justify-center">
                        <Text className="text-blue-600 font-bold text-[15px]">
                            {initials}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-col flex-1 flex-shrink">
                <View className="flex-row items-center">
                    <Text
                        className="text-[13.5px] font-semibold text-[#1E293B] flex-shrink"
                        numberOfLines={1}
                    >
                        {name}
                    </Text>

                    {isYou && (
                        <View className="border border-blue-500 rounded-full px-1.5 py-[1px] ml-1.5">
                            <Text className="text-blue-500 text-[9px] font-bold">
                                You
                            </Text>
                        </View>
                    )}
                </View>

                <Text
                    className="text-[11px] text-[#64748B] mt-0.5"
                    numberOfLines={1}
                >
                    {subtext}
                </Text>
            </View>
        </View>
    );
}
