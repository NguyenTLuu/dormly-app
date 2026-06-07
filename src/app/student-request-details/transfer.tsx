import { ManagementDropdown } from '@/components/manager-management';
import { StudentRequestHeader } from '@/components/student-requests';
import { DormRoom, managementFloorsByBlock } from '@/data/manager-management';
import {
    availableTransferRooms,
    submitStudentTransferRequest,
} from '@/data/student-requests';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const blockOptions = [
    'All',
    ...Array.from(new Set(availableTransferRooms.map((room) => room.block))),
];

export default function StudentTransferRequestScreen() {
    const router = useRouter();
    const [block, setBlock] = useState('All');
    const [floor, setFloor] = useState('All');
    const [selectedRoom, setSelectedRoom] = useState<DormRoom>();
    const [reason, setReason] = useState('');

    const floorOptions =
        block === 'All' ? ['All'] : managementFloorsByBlock[block];
    const filteredRooms = useMemo(
        () =>
            availableTransferRooms.filter(
                (room) =>
                    (block === 'All' || room.block === block) &&
                    (floor === 'All' || room.floor === floor)
            ),
        [block, floor]
    );

    const handleSubmit = () => {
        if (!selectedRoom) {
            toast.error('Select a room to continue');
            return;
        }
        if (!reason.trim()) {
            toast.error('Transfer reason is required');
            return;
        }

        submitStudentTransferRequest({
            requestedRoom: selectedRoom.code,
            reason: reason.trim(),
        });
        toast.success('Transfer request submitted', {
            description: `Requested room ${selectedRoom.code}`,
        });
        router.back();
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F4FAFD]"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                <StudentRequestHeader
                    title="Room transfer"
                    subtitle="Choose an available room and explain your request"
                    color="#2563EB"
                />

                <View className="px-4 pt-5">
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <Text className="text-[#1E293B] text-base font-bold">
                            Find an available room
                        </Text>
                        <Text className="text-[#94A3B8] text-xs font-medium mt-1">
                            Filter rooms by block and floor, then select one.
                        </Text>
                        <View className="flex-row mt-4">
                            <ManagementDropdown
                                label="Block"
                                value={block}
                                options={blockOptions}
                                icon="business-outline"
                                accentColor="#2563EB"
                                accentBg="#DBEAFE"
                                onChange={(value) => {
                                    setBlock(value);
                                    setFloor('All');
                                    setSelectedRoom(undefined);
                                }}
                            />
                            <View className="w-3" />
                            <ManagementDropdown
                                label="Floor"
                                value={floor}
                                options={floorOptions}
                                icon="layers-outline"
                                accentColor="#2563EB"
                                accentBg="#DBEAFE"
                                disabled={block === 'All'}
                                disabledText="Choose block"
                                onChange={(value) => {
                                    setFloor(value);
                                    setSelectedRoom(undefined);
                                }}
                            />
                        </View>
                    </View>

                    <View className="flex-row items-end mt-5 mb-3">
                        <View className="flex-1">
                            <Text className="text-[#1E293B] text-lg font-bold">
                                Available rooms
                            </Text>
                            <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                {filteredRooms.length} room(s) with available
                                beds
                            </Text>
                        </View>
                    </View>

                    {filteredRooms.map((room) => (
                        <AvailableRoomCard
                            key={room.code}
                            room={room}
                            selected={selectedRoom?.code === room.code}
                            onPress={() => setSelectedRoom(room)}
                        />
                    ))}

                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mt-2">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            Transfer reason
                            <Text className="text-red-500"> *</Text>
                        </Text>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            textAlignVertical="top"
                            placeholder="Explain why you want to move to the selected room."
                            placeholderTextColor="#94A3B8"
                            className="min-h-32 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-2"
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        className="bg-blue-600 rounded-2xl py-4 items-center mt-5"
                    >
                        <Text className="text-white text-base font-bold">
                            Submit transfer request
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function AvailableRoomCard({
    room,
    selected,
    onPress,
}: {
    room: DormRoom;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className="bg-white rounded-2xl p-4 border mb-3 shadow-xl"
            style={{ borderColor: selected ? '#2563EB' : '#F1F5F9' }}
        >
            <View className="flex-row items-center">
                <View
                    className="w-12 h-12 rounded-2xl items-center justify-center"
                    style={{
                        backgroundColor: selected ? '#DBEAFE' : '#F1F5F9',
                    }}
                >
                    <Ionicons
                        name="bed-outline"
                        size={23}
                        color={selected ? '#2563EB' : '#64748B'}
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="text-[#1E293B] text-base font-bold">
                        Room {room.code}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                        {room.block} - {room.floor} - {room.gender}
                    </Text>
                </View>
                {selected && (
                    <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#2563EB"
                    />
                )}
            </View>
            <View className="flex-row mt-3 pt-3 border-t border-slate-100">
                <RoomDetail
                    icon="people-outline"
                    text={`${room.capacity - room.occupied} bed(s) free`}
                />
                <RoomDetail icon="resize-outline" text={`${room.area} m²`} />
                <RoomDetail
                    icon="wallet-outline"
                    text={`${(room.monthlyRent / 1000000).toFixed(2)}M`}
                />
            </View>
        </TouchableOpacity>
    );
}

function RoomDetail({
    icon,
    text,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
}) {
    return (
        <View className="flex-1 flex-row items-center">
            <Ionicons name={icon} size={14} color="#64748B" />
            <Text className="text-[#64748B] text-[11px] font-semibold ml-1">
                {text}
            </Text>
        </View>
    );
}
