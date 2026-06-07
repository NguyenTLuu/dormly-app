import { DormContract } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StudentContractCardProps {
    contract: DormContract;
}

const formatCurrency = (value: number) =>
    `${value.toLocaleString('vi-VN')} VND`;

export default function StudentContractCard({
    contract,
}: StudentContractCardProps) {
    return (
        <View className="bg-orange-50 rounded-3xl p-4 border border-orange-100 shadow-xl shadow-orange-200">
            <Text className="text-[#1E293B] text-base font-bold">
                Dorm Contract
            </Text>
            <View className="flex-row items-center mt-3">
                <View className="flex-1">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        {contract.code}
                    </Text>
                    <View className="flex-row items-center bg-white rounded-xl px-3 py-2 mt-3 self-start">
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#2563EB"
                        />
                        <Text className="text-[#334155] text-xs font-bold ml-2">
                            {contract.startDate}
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={14}
                            color="#64748B"
                            style={{ marginHorizontal: 10 }}
                        />
                        <Text className="text-[#334155] text-xs font-bold">
                            {contract.endDate}
                        </Text>
                    </View>
                </View>
                <View className="w-px h-16 bg-orange-200 mx-3" />
                <View className="items-end">
                    <Text className="text-[#64748B] text-xs font-bold">
                        Monthly Rent
                    </Text>
                    <Text className="text-[#EA580C] text-xl font-bold mt-1">
                        {formatCurrency(contract.monthlyRent)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
