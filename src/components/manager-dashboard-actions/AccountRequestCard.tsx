import type { InactiveResidentAccount } from '@/api/accountActivationApi';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AccountRequestCardProps {
    request: InactiveResidentAccount;
    busy: boolean;
    onActivate: (request: InactiveResidentAccount) => void;
    onOpenProfile: () => void;
}

export default function AccountRequestCard({
    request,
    busy,
    onActivate,
    onOpenProfile,
}: AccountRequestCardProps) {
    return (
        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
            <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-full bg-[#E0F2FE] items-center justify-center">
                    <Text className="text-[#0284C7] text-sm font-bold">
                        {request.name
                            .split(' ')
                            .slice(-2)
                            .map((part) => part[0])
                            .join('')}
                    </Text>
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {request.name}
                    </Text>
                    <Text className="text-[#2563EB] text-xs font-bold mt-0.5">
                        {request.studentId || 'Student ID not provided'}
                    </Text>
                </View>
                <Text className="text-[#94A3B8] text-[11px] font-semibold">
                    {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : 'Date unavailable'}
                </Text>
            </View>

            <View className="bg-[#F8FAFC] rounded-xl p-3 mt-3 gap-2">
                <View className="flex-row items-center">
                    <Ionicons name="school-outline" size={15} color="#7C3AED" />
                    <Text className="text-[#475569] text-xs font-semibold ml-2">
                        {request.major || 'Major not provided'}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="mail-outline" size={15} color="#0EA5E9" />
                    <Text className="text-[#475569] text-xs font-semibold ml-2">
                        {request.email}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onOpenProfile}
                accessibilityRole="button"
                className="rounded-xl bg-blue-50 py-2.5 items-center mt-3"
            >
                <Text className="text-blue-700 text-sm font-bold">
                    View profile and documents
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                disabled={busy}
                onPress={() => onActivate(request)}
                className={`bg-[#DCFCE7] rounded-xl py-3 items-center mt-3 ${busy ? 'opacity-50' : ''}`}
            >
                <Text className="text-[#16A34A] text-sm font-bold">
                    Activate account
                </Text>
            </TouchableOpacity>
        </View>
    );
}
