import { DormRoom, RoomTicketType } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getRoomCardTheme } from './room-card-theme';

interface RoomCardProps {
    room: DormRoom;
    ticketTypes: RoomTicketType[];
    ticketCount: number;
    onPress: (room: DormRoom) => void;
}

export default function RoomCard({
    room,
    ticketTypes,
    ticketCount,
    onPress,
}: RoomCardProps) {
    const theme = getRoomCardTheme(room.occupied, ticketTypes);

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onPress(room)}
            className="flex-1 rounded-3xl p-4 border shadow-xl"
            style={{
                backgroundColor: theme.backgroundColor,
                borderColor: theme.borderColor,
            }}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${theme.accentColor}15` }}
                    >
                        <Ionicons
                            name={room.gender === 'Male' ? 'male' : 'female'}
                            size={21}
                            color={theme.accentColor}
                        />
                    </View>
                    <Text className="text-[#1E293B] text-xl font-bold ml-3">
                        {room.code}
                    </Text>
                </View>
                {ticketCount > 0 && (
                    <View
                        className="min-w-7 h-7 rounded-full px-2 items-center justify-center"
                        style={{ backgroundColor: theme.accentColor }}
                    >
                        <Text className="text-white text-xs font-bold">
                            {ticketCount}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center mt-5">
                <View className="flex-row items-center flex-1 pr-3">
                    <Ionicons
                        name={
                            ticketCount > 0
                                ? 'ticket-outline'
                                : 'checkmark-circle-outline'
                        }
                        size={18}
                        color={theme.accentColor}
                    />
                    <Text
                        className="text-xs font-bold ml-2 flex-1"
                        style={{ color: theme.accentColor }}
                        numberOfLines={2}
                    >
                        {theme.label}
                    </Text>
                </View>
                <View
                    className="h-10 border-l pl-3 justify-center"
                    style={{ borderColor: `${theme.accentColor}30` }}
                >
                    <Text
                        className="text-base font-bold"
                        style={{ color: theme.accentColor }}
                    >
                        {room.occupied}/{room.capacity}
                    </Text>
                    <Text className="text-[#64748B] text-[10px] font-semibold mt-0.5">
                        Occupancy
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
