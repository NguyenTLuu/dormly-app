import { StudentRequestHeader } from '@/components/student-requests';
import { dormStudents } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const currentStudent = dormStudents.find(
    (student) => student.id === '2231200123'
)!;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);

export default function StudentContractScreen() {
    const contract = currentStudent.contract;

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <StudentRequestHeader
                    title="Dormitory contract"
                    subtitle="Review your current accommodation agreement"
                    color="#2563EB"
                />

                <View className="px-4 pt-5">
                    <View className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xl">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 rounded-2xl bg-blue-100 items-center justify-center">
                                <Ionicons
                                    name="document-text-outline"
                                    size={27}
                                    color="#2563EB"
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[#64748B] text-xs font-bold uppercase tracking-wide">
                                    Contract number
                                </Text>
                                <Text className="text-[#1E293B] text-lg font-bold mt-1">
                                    {contract.code}
                                </Text>
                            </View>
                            <View className="bg-green-100 rounded-full px-3 py-1.5">
                                <Text className="text-green-700 text-[10px] font-bold">
                                    Active
                                </Text>
                            </View>
                        </View>
                        <View className="h-px bg-slate-100 my-5" />
                        <View className="flex-row">
                            <ContractMetric
                                icon="calendar-outline"
                                label="Start date"
                                value={contract.startDate}
                            />
                            <ContractMetric
                                icon="calendar-number-outline"
                                label="End date"
                                value={contract.endDate}
                                isLast
                            />
                        </View>
                    </View>

                    <SectionTitle title="Resident and room" />
                    <View className="bg-white rounded-3xl px-4 border border-slate-100 shadow-xl">
                        <ContractInfoRow
                            icon="person-outline"
                            label="Resident"
                            value={currentStudent.fullName}
                        />
                        <ContractInfoRow
                            icon="id-card-outline"
                            label="Student ID"
                            value={currentStudent.id}
                        />
                        <ContractInfoRow
                            icon="bed-outline"
                            label="Room and bed"
                            value={`${currentStudent.room} - ${currentStudent.bedCode}`}
                        />
                        <ContractInfoRow
                            icon="business-outline"
                            label="Location"
                            value={`${currentStudent.block} - ${currentStudent.floor}`}
                            isLast
                        />
                    </View>

                    <SectionTitle title="Payment details" />
                    <View className="bg-[#0F3D78] rounded-3xl p-5 overflow-hidden">
                        <View className="absolute -right-10 -top-12 w-36 h-36 rounded-full bg-blue-400/20" />
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-2xl bg-white/15 items-center justify-center">
                                <Ionicons
                                    name="wallet-outline"
                                    size={24}
                                    color="white"
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-blue-100 text-xs font-semibold">
                                    Monthly room fee
                                </Text>
                                <Text className="text-white text-xl font-bold mt-1">
                                    {formatCurrency(contract.monthlyRent)}
                                </Text>
                            </View>
                        </View>
                        <View className="bg-white/10 rounded-2xl p-3 mt-4 flex-row items-start">
                            <Ionicons
                                name="information-circle-outline"
                                size={18}
                                color="#BFDBFE"
                            />
                            <Text className="text-blue-100 text-xs font-medium leading-5 ml-2 flex-1">
                                Utilities and other service charges are billed
                                separately according to monthly usage.
                            </Text>
                        </View>
                    </View>

                    <SectionTitle title="Contract terms" />
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <TermRow text="Follow dormitory regulations and quiet hours." />
                        <TermRow text="Keep the assigned room and shared spaces clean." />
                        <TermRow text="Report damages and safety issues promptly." />
                        <TermRow
                            text="Room transfers require manager approval."
                            isLast
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <Text className="text-[#1E293B] text-lg font-bold mt-6 mb-3">
            {title}
        </Text>
    );
}

function ContractMetric({
    icon,
    label,
    value,
    isLast = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    isLast?: boolean;
}) {
    return (
        <View
            className={`flex-1 ${isLast ? 'pl-4' : 'border-r border-slate-100 pr-4'}`}
        >
            <Ionicons name={icon} size={18} color="#2563EB" />
            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase mt-2">
                {label}
            </Text>
            <Text className="text-[#1E293B] text-sm font-bold mt-1">
                {value}
            </Text>
        </View>
    );
}

function ContractInfoRow({
    icon,
    label,
    value,
    isLast = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    isLast?: boolean;
}) {
    return (
        <View
            className={`flex-row items-center py-4 ${
                isLast ? '' : 'border-b border-slate-100'
            }`}
        >
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                <Ionicons name={icon} size={18} color="#2563EB" />
            </View>
            <View className="ml-3 flex-1">
                <Text className="text-[#94A3B8] text-[10px] font-bold uppercase">
                    {label}
                </Text>
                <Text className="text-[#334155] text-sm font-bold mt-1">
                    {value}
                </Text>
            </View>
        </View>
    );
}

function TermRow({ text, isLast = false }: { text: string; isLast?: boolean }) {
    return (
        <View
            className={`flex-row items-start py-3 ${
                isLast ? '' : 'border-b border-slate-100'
            }`}
        >
            <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#16A34A"
            />
            <Text className="text-[#475569] text-sm font-medium leading-5 ml-2 flex-1">
                {text}
            </Text>
        </View>
    );
}
