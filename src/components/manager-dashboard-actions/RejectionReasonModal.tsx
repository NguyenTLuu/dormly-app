import { AccountRequest } from '@/data/manager-dashboard-actions';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface RejectionReasonModalProps {
    request: AccountRequest | null;
    onClose: () => void;
    onConfirm: (requestId: string, reason: string) => void;
}

export default function RejectionReasonModal({
    request,
    onClose,
    onConfirm,
}: RejectionReasonModalProps) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        setReason('');
    }, [request]);

    return (
        <Modal
            transparent
            visible={request !== null}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/30 justify-center px-5"
                onPress={onClose}
            >
                <Pressable className="bg-white rounded-2xl p-5">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-[#FEE2E2] items-center justify-center">
                            <Ionicons
                                name="close-circle-outline"
                                size={21}
                                color="#DC2626"
                            />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-[#1E293B] text-lg font-bold">
                                Reject account request
                            </Text>
                            <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                                {request?.name}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-[#475569] text-xs font-bold mt-4 mb-1.5">
                        Rejection reason
                    </Text>
                    <TextInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Explain why this request is rejected"
                        placeholderTextColor="#94A3B8"
                        multiline
                        textAlignVertical="top"
                        className="min-h-[100px] bg-[#F8FAFC] rounded-xl px-3.5 py-3 text-[#1E293B] text-sm font-semibold border border-gray-100"
                    />
                    <View className="flex-row gap-3 mt-4">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onClose}
                            className="flex-1 bg-[#F1F5F9] rounded-xl py-3 items-center"
                        >
                            <Text className="text-[#475569] text-sm font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                request && onConfirm(request.id, reason.trim())
                            }
                            className="flex-1 bg-[#DC2626] rounded-xl py-3 items-center"
                        >
                            <Text className="text-white text-sm font-bold">
                                Confirm reject
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
