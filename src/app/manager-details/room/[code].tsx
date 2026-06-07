import {
    ManagementAvatar,
    RoomEditModal,
} from '@/components/manager-management';
import { DormRoom, dormRooms, dormStudents } from '@/data/manager-management';
import { addActivityLog } from '@/data/activity-log';
import { getMockRoomTickets } from '@/utils/manager-room-tickets';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

const formatCurrency = (value: number) =>
    `${value.toLocaleString('vi-VN')} VND`;

export default function RoomDetailScreen() {
    const router = useRouter();
    const { code } = useLocalSearchParams<{ code: string }>();
    const initialRoom = dormRooms.find((item) => item.code === code);
    const insets = useSafeAreaInsets();
    const [room, setRoom] = useState<DormRoom | undefined>(initialRoom);
    const [editVisible, setEditVisible] = useState(false);

    if (!room) {
        return (
            <View className="flex-1 bg-[#F4FAFD] items-center justify-center">
                <Text className="text-[#64748B] font-bold">
                    Room not found.
                </Text>
            </View>
        );
    }

    const residents = dormStudents.filter((student) =>
        room.studentIds.includes(student.id)
    );
    const tickets = getMockRoomTickets(initialRoom ?? room);

    const saveRoom = (updatedRoom: DormRoom) => {
        setRoom(updatedRoom);
        setEditVisible(false);
        addActivityLog({
            action: 'Updated room information',
            detail: `Updated Room ${updatedRoom.code}, capacity, amenities, or monthly rent.`,
            actorName: 'Nguyen Minh Manager',
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'business-outline',
            color: '#2563EB',
        });
        toast.success('Room information updated', {
            description: 'Changes are saved locally on this screen.',
        });
    };
    return (
        <>
            <View
                className="flex-1 bg-[#F4FAFD]"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{ padding: 16, gap: 14 }}
                >
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => router.back()}
                            className="w-11 h-11 rounded-full bg-white border border-gray-100 items-center justify-center"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={22}
                                color="#1E293B"
                            />
                        </TouchableOpacity>
                        <Text className="font-medium text-2xl ml-3">
                            Room Detail
                        </Text>
                    </View>

                    <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl">
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center">
                                <Ionicons
                                    name="business-outline"
                                    size={29}
                                    color="#7C3AED"
                                />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-[#1E293B] text-2xl font-bold">
                                    Room {room.code}
                                </Text>
                                <View className="flex-row items-center mt-1.5">
                                    <Ionicons
                                        name="location-outline"
                                        size={15}
                                        color="#64748B"
                                    />
                                    <Text className="text-[#64748B] text-sm font-semibold ml-1.5">
                                        {room.block} - {room.floor}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={() => setEditVisible(true)}
                                className="bg-blue-50 rounded-xl px-3 py-2.5 flex-row items-center"
                            >
                                <Ionicons
                                    name="create-outline"
                                    size={16}
                                    color="#2563EB"
                                />
                                <Text className="text-[#2563EB] text-xs font-bold ml-1.5">
                                    Edit
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="h-px bg-gray-100 my-5" />
                        <RoomSectionTitle
                            title="Room Information"
                            icon="information-circle-outline"
                            color="#2563EB"
                            bgColor="#DBEAFE"
                        />
                        <View className="flex-row flex-wrap gap-2">
                            <RoomInfoItem
                                label="Area"
                                value={`${room.area} m²`}
                                icon="resize-outline"
                                color="#7C3AED"
                                bgColor="#EDE9FE"
                            />
                            <RoomInfoItem
                                label="Occupancy"
                                value={`${room.occupied}/${room.capacity} students`}
                                icon="people-outline"
                                color="#2563EB"
                                bgColor="#DBEAFE"
                            />
                            <RoomInfoItem
                                label="Room Type"
                                value={`${room.gender} room`}
                                icon={
                                    room.gender === 'Male' ? 'male' : 'female'
                                }
                                color="#DB2777"
                                bgColor="#FCE7F3"
                            />
                            <RoomInfoItem
                                label="Monthly Rent"
                                value={formatCurrency(room.monthlyRent)}
                                icon="cash-outline"
                                color="#F97316"
                                bgColor="#FFEDD5"
                            />
                            <RoomInfoItem
                                label="Location"
                                value={`${room.block}, ${room.floor}`}
                                icon="location-outline"
                                color="#0F766E"
                                bgColor="#CCFBF1"
                            />
                        </View>

                        <View className="h-px bg-gray-100 my-5" />
                        <RoomSectionTitle
                            title="Amenities"
                            icon="sparkles-outline"
                            color="#F97316"
                            bgColor="#FFEDD5"
                        />
                        <View className="flex-row flex-wrap gap-2">
                            {room.amenities.map((amenity) => (
                                <View
                                    key={amenity}
                                    className="bg-[#F8FAFC] rounded-full px-3 py-2 flex-row items-center"
                                >
                                    <Ionicons
                                        name={getAmenityIcon(amenity)}
                                        size={15}
                                        color="#64748B"
                                    />
                                    <Text className="text-[#475569] text-xs font-bold ml-1.5">
                                        {amenity}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <RoomSectionTitle
                            title="Current Residents"
                            icon="people-outline"
                            color="#0F766E"
                            bgColor="#CCFBF1"
                        />
                        <View className="gap-2">
                            {residents.map((student) => (
                                <TouchableOpacity
                                    key={student.id}
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                '/manager-details/student/[id]',
                                            params: { id: student.id },
                                        })
                                    }
                                    className="flex-row items-center bg-[#F8FAFC] rounded-2xl p-3"
                                >
                                    <ManagementAvatar
                                        initials={student.initials}
                                        tone="teal"
                                    />
                                    <View className="ml-3 flex-1">
                                        <Text className="text-[#1E293B] text-sm font-bold">
                                            {student.fullName}
                                        </Text>
                                        <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                                            {student.id} - {student.bedCode}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color="#94A3B8"
                                    />
                                </TouchableOpacity>
                            ))}
                            {residents.length === 0 && (
                                <Text className="text-[#64748B] text-sm font-semibold">
                                    No current residents.
                                </Text>
                            )}
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <RoomSectionTitle
                            title="Active Tickets"
                            icon="ticket-outline"
                            color="#F97316"
                            bgColor="#FFEDD5"
                        />
                        <View className="gap-2">
                            {tickets.map((ticket) => (
                                <TouchableOpacity
                                    key={`${ticket.type}-${ticket.id}`}
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                '/manager-details/ticket/[type]/[id]',
                                            params: {
                                                type: ticket.type,
                                                id: ticket.id,
                                            },
                                        })
                                    }
                                    className="bg-[#F8FAFC] rounded-2xl p-3 flex-row items-center"
                                >
                                    <View className="flex-1">
                                        <Text className="text-[#1E293B] text-sm font-bold">
                                            {ticket.title}
                                        </Text>
                                        <Text className="text-[#64748B] text-xs font-bold mt-1">
                                            {ticket.type.toUpperCase()} -{' '}
                                            {ticket.status}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color="#94A3B8"
                                    />
                                </TouchableOpacity>
                            ))}
                            {tickets.length === 0 && (
                                <Text className="text-[#64748B] text-sm font-semibold">
                                    No active tickets for this room.
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
            <RoomEditModal
                visible={editVisible}
                room={room}
                onClose={() => setEditVisible(false)}
                onSave={saveRoom}
            />
        </>
    );
}

function RoomSectionTitle({
    title,
    icon,
    color,
    bgColor,
}: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}) {
    return (
        <View className="flex-row items-center mb-3">
            <View
                className="w-8 h-8 rounded-xl items-center justify-center"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={17} color={color} />
            </View>
            <Text className="text-[#1E293B] text-base font-bold ml-2.5">
                {title}
            </Text>
        </View>
    );
}

function RoomInfoItem({
    label,
    value,
    icon,
    color,
    bgColor,
}: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}) {
    return (
        <View className="w-[48%] bg-[#F8FAFC] rounded-2xl p-3 flex-row items-center">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <View className="ml-2.5 flex-1">
                <Text className="text-[#94A3B8] text-[10px] font-bold">
                    {label}
                </Text>
                <Text
                    className="text-[#1E293B] text-xs font-bold mt-0.5"
                    numberOfLines={2}
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}

function getAmenityIcon(amenity: string): keyof typeof Ionicons.glyphMap {
    const normalizedAmenity = amenity.toLowerCase();

    if (normalizedAmenity.includes('wi-fi')) return 'wifi-outline';
    if (normalizedAmenity.includes('ac')) return 'snow-outline';
    if (normalizedAmenity.includes('fan')) return 'sync-outline';
    if (normalizedAmenity.includes('bathroom')) return 'water-outline';
    if (normalizedAmenity.includes('balcony')) return 'sunny-outline';
    if (normalizedAmenity.includes('desk')) return 'desktop-outline';
    if (normalizedAmenity.includes('wardrobe'))
        return 'file-tray-stacked-outline';
    if (normalizedAmenity.includes('pantry')) return 'restaurant-outline';
    if (normalizedAmenity.includes('refrigerator')) return 'snow-outline';
    if (normalizedAmenity.includes('tv')) return 'tv-outline';

    return 'checkmark-circle-outline';
}
