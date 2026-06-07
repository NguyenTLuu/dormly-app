import { AccountRequest } from '@/data/manager-dashboard-actions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AccountRequestCardProps {
    request: AccountRequest;
    onApprove: (id: string) => void;
    onReject: (request: AccountRequest) => void;
}

export default function AccountRequestCard({
    request,
    onApprove,
    onReject,
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
                        {request.studentId}
                    </Text>
                </View>
                <Text className="text-[#94A3B8] text-[11px] font-semibold">
                    {request.submittedAt}
                </Text>
            </View>

            <View className="bg-[#F8FAFC] rounded-xl p-3 mt-3 gap-2">
                <View className="flex-row items-center">
                    <Ionicons name="school-outline" size={15} color="#7C3AED" />
                    <Text className="text-[#475569] text-xs font-semibold ml-2">
                        {request.major}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="mail-outline" size={15} color="#0EA5E9" />
                    <Text className="text-[#475569] text-xs font-semibold ml-2">
                        {request.email}
                    </Text>
                </View>
                {request.rejectionReason && (
                    <View className="flex-row items-start">
                        <Ionicons
                            name="information-circle-outline"
                            size={15}
                            color="#DC2626"
                        />
                        <Text className="text-[#B91C1C] text-xs font-semibold ml-2 flex-1">
                            {request.rejectionReason}
                        </Text>
                    </View>
                )}
            </View>

            {request.status === 'Pending' && (
                <View className="flex-row gap-3 mt-3">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onReject(request)}
                        className="flex-1 bg-[#FEF2F2] rounded-xl py-3 items-center"
                    >
                        <Text className="text-[#DC2626] text-sm font-bold">
                            Reject
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onApprove(request.id)}
                        className="flex-1 bg-[#DCFCE7] rounded-xl py-3 items-center"
                    >
                        <Text className="text-[#16A34A] text-sm font-bold">
                            Approve
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
