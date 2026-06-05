import { TransferRoomRequest } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ReporterAvatar from './ReporterAvatar';

interface TransferRequestDetailModalProps {
    item: TransferRoomRequest | null;
    visible: boolean;
    onClose: () => void;
    onApprove: (id: string) => void;
    onDeny: (id: string, reason: string) => void;
}

export default function TransferRequestDetailModal({
    item,
    visible,
    onClose,
    onApprove,
    onDeny,
}: TransferRequestDetailModalProps) {
    const [denialReason, setDenialReason] = useState('');

    if (!item) {
        return null;
    }

    const canDecide = item.status !== 'Resolved';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-[#F4FAFD]">
                <View className="bg-blue-600 px-5 pt-12 pb-5 rounded-b-2xl">
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-white text-xl font-bold">
                                Transfer Request
                            </Text>
                            <Text className="text-blue-100 text-sm mt-1">
                                {item.id} - {item.student}
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={onClose}
                            className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
                        >
                            <Ionicons name="close" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, gap: 14 }}
                >
                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] font-bold text-base">
                            Request detail
                        </Text>
                        <View className="self-start bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mt-3">
                            <Text className="text-[#2566E2] text-base font-bold">
                                {item.block} - {item.floor}
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-3">
                            <View className="bg-[#F8FAFC] rounded-xl px-4 py-3">
                                <Text className="text-[#64748B] text-xs font-bold">
                                    Current
                                </Text>
                                <Text className="text-[#1E293B] text-lg font-bold mt-1">
                                    {item.currentRoom}
                                </Text>
                            </View>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#94A3B8"
                                style={{ marginHorizontal: 10 }}
                            />
                            <View className="bg-blue-50 rounded-xl px-4 py-3">
                                <Text className="text-[#64748B] text-xs font-bold">
                                    Requested
                                </Text>
                                <Text className="text-[#2566E2] text-lg font-bold mt-1">
                                    {item.requestedRoom}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-[#64748B] text-sm font-medium mt-3">
                            {item.reason}
                        </Text>
                        <View className="flex-row items-center mt-4">
                            <ReporterAvatar initials={item.reporterAvatar} />
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-sm font-bold">
                                    {item.student}
                                </Text>
                                <Text className="text-[#64748B] text-sm font-semibold mt-0.5">
                                    {item.studentId}
                                </Text>
                                <Text className="text-[#64748B] text-sm font-semibold mt-0.5">
                                    Submitted at {item.submittedTime}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {item.decision && (
                        <View className="bg-white rounded-2xl p-4 border border-gray-100">
                            <Text className="text-[#1E293B] font-bold text-base">
                                Decision
                            </Text>
                            <Text
                                className={`text-base font-bold mt-3 ${item.decision === 'Approved' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}
                            >
                                {item.decision}
                            </Text>
                            {item.denialReason && (
                                <Text className="text-[#64748B] text-sm font-medium mt-2">
                                    {item.denialReason}
                                </Text>
                            )}
                        </View>
                    )}

                    {canDecide && (
                        <View className="bg-white rounded-2xl p-4 border border-gray-100">
                            <Text className="text-[#1E293B] font-bold text-base">
                                Manager action
                            </Text>
                            <View className="flex-row gap-3 mt-3">
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => onApprove(item.id)}
                                    className="flex-1 bg-[#22C55E] rounded-xl py-3 items-center"
                                >
                                    <Text className="text-white font-bold text-base">
                                        Approve
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        onDeny(
                                            item.id,
                                            denialReason ||
                                                'Denied by manager review.'
                                        )
                                    }
                                    className="flex-1 bg-[#EF4444] rounded-xl py-3 items-center"
                                >
                                    <Text className="text-white font-bold text-base">
                                        Deny
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                value={denialReason}
                                onChangeText={setDenialReason}
                                multiline
                                placeholder="Reason for denial"
                                placeholderTextColor="#94A3B8"
                                className="min-h-[90px] bg-[#F8FAFC] rounded-xl p-3 mt-3 text-[#1E293B]"
                                textAlignVertical="top"
                            />
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}
