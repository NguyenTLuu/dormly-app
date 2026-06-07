import { DormRoom } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface RoomEditModalProps {
    visible: boolean;
    room: DormRoom;
    onClose: () => void;
    onSave: (room: DormRoom) => void;
}

const amenityOptions = [
    'Wi-Fi',
    'AC',
    'Fan',
    'Refrigerator',
    'TV',
    'Private bathroom',
    'Balcony',
    'Study desk',
    'Wardrobe',
    'Shared pantry',
];

export default function RoomEditModal({
    visible,
    room,
    onClose,
    onSave,
}: RoomEditModalProps) {
    const [code, setCode] = useState(room.code);
    const [area, setArea] = useState(`${room.area}`);
    const [capacity, setCapacity] = useState(`${room.capacity}`);
    const [gender, setGender] = useState<DormRoom['gender']>(room.gender);
    const [monthlyRent, setMonthlyRent] = useState(`${room.monthlyRent}`);
    const [amenities, setAmenities] = useState(room.amenities);
    const [customAmenity, setCustomAmenity] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!visible) return;

        setCode(room.code);
        setArea(`${room.area}`);
        setCapacity(`${room.capacity}`);
        setGender(room.gender);
        setMonthlyRent(`${room.monthlyRent}`);
        setAmenities(room.amenities);
        setCustomAmenity('');
        setError('');
    }, [room, visible]);

    const toggleAmenity = (amenity: string) => {
        setAmenities((current) =>
            current.includes(amenity)
                ? current.filter((item) => item !== amenity)
                : [...current, amenity]
        );
    };

    const addCustomAmenity = () => {
        const amenity = customAmenity.trim();
        if (!amenity || amenities.includes(amenity)) return;

        setAmenities((current) => [...current, amenity]);
        setCustomAmenity('');
    };

    const handleSave = () => {
        const parsedArea = Number(area);
        const parsedCapacity = Number(capacity);
        const parsedMonthlyRent = Number(monthlyRent);

        if (!code.trim()) {
            setError('Room name is required.');
            return;
        }
        if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
            setError('Area must be greater than 0.');
            return;
        }
        if (
            !Number.isInteger(parsedCapacity) ||
            parsedCapacity <= 0 ||
            parsedCapacity < room.occupied
        ) {
            setError(
                `Capacity must be a whole number of at least ${room.occupied}.`
            );
            return;
        }
        if (!Number.isFinite(parsedMonthlyRent) || parsedMonthlyRent < 0) {
            setError('Monthly rent must be a valid number.');
            return;
        }

        onSave({
            ...room,
            code: code.trim().toUpperCase(),
            area: parsedArea,
            capacity: parsedCapacity,
            gender,
            monthlyRent: parsedMonthlyRent,
            amenities,
        });
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/30 justify-end"
                onPress={onClose}
            >
                <Pressable className="bg-[#F4FAFD] rounded-t-3xl max-h-[92%]">
                    <View className="bg-white rounded-t-3xl px-4 py-4 border-b border-gray-100 flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-[#1E293B] text-xl font-bold">
                                Edit Room Information
                            </Text>
                            <Text className="text-[#64748B] text-xs font-semibold mt-1">
                                Changes are saved locally for this screen
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={onClose}
                            className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center"
                        >
                            <Ionicons name="close" size={21} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={{ padding: 16, gap: 12 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                            <EditField
                                label="Room name"
                                value={code}
                                onChangeText={setCode}
                                placeholder="A102"
                                autoCapitalize="characters"
                            />
                            <View className="flex-row gap-3 mt-3">
                                <View className="flex-1">
                                    <EditField
                                        label="Area (m²)"
                                        value={area}
                                        onChangeText={setArea}
                                        placeholder="24"
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View className="flex-1">
                                    <EditField
                                        label="Capacity"
                                        value={capacity}
                                        onChangeText={setCapacity}
                                        placeholder="4"
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>
                            <View className="mt-3">
                                <EditField
                                    label="Monthly rent (VND)"
                                    value={monthlyRent}
                                    onChangeText={setMonthlyRent}
                                    placeholder="1200000"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                            <Text className="text-[#1E293B] text-sm font-bold mb-3">
                                Room type
                            </Text>
                            <View className="flex-row gap-2">
                                {(['Male', 'Female'] as const).map((option) => {
                                    const active = gender === option;

                                    return (
                                        <TouchableOpacity
                                            key={option}
                                            activeOpacity={0.75}
                                            onPress={() => setGender(option)}
                                            className="flex-1 rounded-2xl py-3 border flex-row items-center justify-center"
                                            style={{
                                                backgroundColor: active
                                                    ? '#FCE7F3'
                                                    : '#FFFFFF',
                                                borderColor: active
                                                    ? '#DB2777'
                                                    : '#E2E8F0',
                                            }}
                                        >
                                            <Ionicons
                                                name={
                                                    option === 'Male'
                                                        ? 'male'
                                                        : 'female'
                                                }
                                                size={17}
                                                color={
                                                    active
                                                        ? '#DB2777'
                                                        : '#64748B'
                                                }
                                            />
                                            <Text
                                                className="text-xs font-bold ml-2"
                                                style={{
                                                    color: active
                                                        ? '#DB2777'
                                                        : '#64748B',
                                                }}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                            <Text className="text-[#1E293B] text-sm font-bold mb-3">
                                Amenities
                            </Text>
                            {amenities.length > 0 && (
                                <View className="flex-row flex-wrap gap-2 mb-3">
                                    {amenities.map((amenity) => (
                                        <TouchableOpacity
                                            key={`selected-${amenity}`}
                                            activeOpacity={0.75}
                                            onPress={() =>
                                                toggleAmenity(amenity)
                                            }
                                            className="rounded-full px-3 py-2 bg-orange-100 flex-row items-center"
                                        >
                                            <Text className="text-[#EA580C] text-xs font-bold">
                                                {amenity}
                                            </Text>
                                            <Ionicons
                                                name="close"
                                                size={14}
                                                color="#EA580C"
                                                style={{ marginLeft: 4 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View className="flex-row flex-wrap gap-2">
                                {amenityOptions.map((amenity) => {
                                    const active = amenities.includes(amenity);

                                    return (
                                        <TouchableOpacity
                                            key={amenity}
                                            activeOpacity={0.75}
                                            onPress={() =>
                                                toggleAmenity(amenity)
                                            }
                                            className="rounded-full px-3 py-2 border"
                                            style={{
                                                backgroundColor: active
                                                    ? '#FFEDD5'
                                                    : '#FFFFFF',
                                                borderColor: active
                                                    ? '#F97316'
                                                    : '#E2E8F0',
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-bold"
                                                style={{
                                                    color: active
                                                        ? '#EA580C'
                                                        : '#64748B',
                                                }}
                                            >
                                                {amenity}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <View className="flex-row items-center mt-3">
                                <TextInput
                                    value={customAmenity}
                                    onChangeText={setCustomAmenity}
                                    onSubmitEditing={addCustomAmenity}
                                    placeholder="Add custom amenity"
                                    placeholderTextColor="#94A3B8"
                                    className="flex-1 h-11 bg-[#F8FAFC] rounded-xl px-3 text-[#1E293B]"
                                />
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={addCustomAmenity}
                                    className="w-11 h-11 rounded-xl bg-orange-100 items-center justify-center ml-2"
                                >
                                    <Ionicons
                                        name="add"
                                        size={21}
                                        color="#EA580C"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {!!error && (
                            <Text className="text-red-600 text-xs font-bold">
                                {error}
                            </Text>
                        )}
                    </ScrollView>

                    <View className="bg-white border-t border-gray-100 p-4 flex-row gap-3">
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={onClose}
                            className="flex-1 rounded-2xl py-3 border border-gray-200 items-center"
                        >
                            <Text className="text-[#64748B] text-sm font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={handleSave}
                            className="flex-1 rounded-2xl py-3 bg-blue-600 items-center"
                        >
                            <Text className="text-white text-sm font-bold">
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function EditField({
    label,
    ...textInputProps
}: {
    label: string;
} & React.ComponentProps<typeof TextInput>) {
    return (
        <View>
            <Text className="text-[#1E293B] text-xs font-bold mb-2">
                {label}
            </Text>
            <TextInput
                {...textInputProps}
                placeholderTextColor="#94A3B8"
                className="h-11 bg-[#F8FAFC] rounded-xl px-3 text-[#1E293B] border border-gray-100"
            />
        </View>
    );
}
