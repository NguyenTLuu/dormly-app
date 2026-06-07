import { DormStudent } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ManagementAvatar from './ManagementAvatar';

interface StudentCardProps {
    student: DormStudent;
    onPress: (student: DormStudent) => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onPress(student)}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-200"
        >
            <View className="flex-row items-center">
                <ManagementAvatar initials={student.initials} />
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        {student.fullName}
                    </Text>
                    <Text className="text-[#64748B] text-sm font-semibold mt-0.5">
                        {student.id} - {student.major}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
            <View className="self-start bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mt-3">
                <Text className="text-[#2566E2] text-sm font-bold">
                    {student.block} - {student.floor} - Room {student.room}
                </Text>
            </View>
            <View className="flex-row items-center mt-3">
                <Ionicons name="bed-outline" size={15} color="#64748B" />
                <Text className="text-[#64748B] text-sm font-semibold ml-1">
                    {student.bedCode}
                </Text>
                <Ionicons
                    name="call-outline"
                    size={15}
                    color="#64748B"
                    style={{ marginLeft: 14 }}
                />
                <Text className="text-[#64748B] text-sm font-semibold ml-1">
                    {student.phone}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
