import {
    EmergencyContactCard,
    InfoGridItem,
    ManagementAvatar,
    StudentContractCard,
    StudentDocumentRow,
    StudentStatCard,
} from '@/components/manager-management';
import { dormStudents } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const student = dormStudents.find((item) => item.id === id);
    const insets = useSafeAreaInsets();

    if (!student) {
        return (
            <View className="flex-1 bg-[#F4FAFD] items-center justify-center">
                <Text className="text-[#64748B] font-bold">
                    Student not found.
                </Text>
            </View>
        );
    }

    return (
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
                        Student Information
                    </Text>
                </View>

                <View className="bg-white rounded-3xl p-4 border border-blue-200 shadow-xl">
                    <View className="flex-row items-center">
                        <ManagementAvatar
                            initials={student.initials}
                            size="lg"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-[#1E293B] text-2xl font-bold">
                                {student.fullName}
                            </Text>
                            <Text className="text-[#64748B] text-sm font-semibold mt-1">
                                {student.id} - {student.major}
                            </Text>
                            <View className="self-start bg-blue-50 rounded-2xl px-3 py-2 mt-3">
                                <Text className="text-[#2563EB] text-xs font-bold">
                                    {student.block} - {student.floor} - Room{' '}
                                    {student.room}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <StudentStatCard
                        label="Room"
                        value={student.bedCode}
                        icon="bed-outline"
                        color="#0EA5E9"
                        bgColor="#E0F2FE"
                    />
                    <StudentStatCard
                        label="Documents"
                        value="2 / 2"
                        suffix="OK"
                        icon="document-text-outline"
                        color="#16A34A"
                        bgColor="#DCFCE7"
                    />
                    <StudentStatCard
                        label="Rent Status"
                        value="Paid"
                        icon="cash-outline"
                        color="#F59E0B"
                        bgColor="#FEF3C7"
                    />
                </View>

                <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                    <Text className="text-[#1E293B] text-base font-bold mb-2">
                        Student Information
                    </Text>
                    <View className="flex-row flex-wrap rounded-2xl border border-gray-100 overflow-hidden">
                        <InfoGridItem
                            label="Bed"
                            value={student.bedCode}
                            icon="bed-outline"
                            color="#0F766E"
                            bgColor="#CCFBF1"
                        />
                        <InfoGridItem
                            label="Phone"
                            value={student.phone}
                            icon="call-outline"
                            color="#2563EB"
                            bgColor="#DBEAFE"
                        />
                        <InfoGridItem
                            label="Email"
                            value={student.email}
                            icon="mail-outline"
                            color="#7C3AED"
                            bgColor="#EDE9FE"
                        />
                        <InfoGridItem
                            label="Gender"
                            value={student.gender}
                            icon="person-outline"
                            color="#F97316"
                            bgColor="#FFEDD5"
                        />
                    </View>
                </View>

                <View className="bg-white rounded-3xl p-4 border border-gray-100 gap-3 shadow-xl">
                    <Text className="text-[#1E293B] text-base font-bold">
                        Documents
                    </Text>
                    <StudentDocumentRow
                        title="Citizen ID"
                        code={student.citizenId.number}
                        meta={`${student.citizenId.issueDate} - ${student.citizenId.issuePlace}`}
                        color="#2563EB"
                        bgColor="#EAF3FF"
                        verified
                    />
                    <StudentDocumentRow
                        title="Temporary Residence"
                        code={student.temporaryResidence.code}
                        meta={`Valid until ${student.temporaryResidence.validUntil}`}
                        color="#10B981"
                        bgColor="#ECFDF5"
                    />
                </View>

                <StudentContractCard contract={student.contract} />
                <EmergencyContactCard contact={student.emergencyContact} />
            </ScrollView>
        </View>
    );
}
