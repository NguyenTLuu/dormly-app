import {
    WorkRequest,
    handlerOptions,
    progressOptions,
} from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AttachmentList from './AttachmentList';
import ReporterAvatar from './ReporterAvatar';

interface WorkRequestDetailModalProps {
    item: WorkRequest | null;
    visible: boolean;
    onClose: () => void;
    onAssign: (id: string, assignee: string) => void;
    onProgressChange: (id: string, progress: string) => void;
    onNoteChange: (id: string, note: string) => void;
}

export default function WorkRequestDetailModal({
    item,
    visible,
    onClose,
    onAssign,
    onProgressChange,
    onNoteChange,
}: WorkRequestDetailModalProps) {
    if (!item) {
        return null;
    }

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
                                {item.title}
                            </Text>
                            <Text className="text-blue-100 text-sm mt-1">
                                {item.id} - {item.category}
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
                            Report detail
                        </Text>
                        <View className="self-start bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mt-3">
                            <Text className="text-[#2566E2] text-base font-bold">
                                {item.block} - {item.floor} - Room {item.room}
                            </Text>
                        </View>
                        <Text className="text-[#64748B] text-sm font-medium mt-3">
                            {item.description}
                        </Text>
                        <View className="flex-row items-center mt-4">
                            <ReporterAvatar initials={item.reporterAvatar} />
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-sm font-bold">
                                    {item.reportedBy}
                                </Text>
                                <Text className="text-[#64748B] text-sm font-semibold mt-0.5">
                                    Reported at {item.reportedTime}
                                </Text>
                            </View>
                        </View>
                        {item.rating && (
                            <View className="flex-row items-center mt-3">
                                <Ionicons
                                    name="star"
                                    size={16}
                                    color="#FACC15"
                                />
                                <Text className="text-[#1E293B] text-sm font-bold ml-1">
                                    Student rating: {item.rating}/5
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] font-bold mb-3">
                            Attachments
                        </Text>
                        <AttachmentList attachments={item.attachments} />
                    </View>

                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] font-bold text-base">
                            Assign handler
                        </Text>
                        <View className="flex-row flex-wrap gap-2 mt-3">
                            {handlerOptions.map((handler) => {
                                const isActive =
                                    (item.assignee || 'Unassigned') === handler;

                                return (
                                    <TouchableOpacity
                                        key={handler}
                                        activeOpacity={0.75}
                                        onPress={() =>
                                            onAssign(
                                                item.id,
                                                handler === 'Unassigned'
                                                    ? ''
                                                    : handler
                                            )
                                        }
                                        className={`px-4 py-2.5 rounded-full border ${isActive ? 'bg-blue-50 border-[#2566E2]' : 'border-gray-100'}`}
                                    >
                                        <Text
                                            className={`text-sm font-bold ${isActive ? 'text-[#2566E2]' : 'text-[#64748B]'}`}
                                        >
                                            {handler}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] font-bold text-base">
                            Progress
                        </Text>
                        <View className="flex-row flex-wrap gap-2 mt-3">
                            {progressOptions.map((progress) => {
                                const isActive = item.progress === progress;

                                return (
                                    <TouchableOpacity
                                        key={progress}
                                        activeOpacity={0.75}
                                        onPress={() =>
                                            onProgressChange(item.id, progress)
                                        }
                                        className={`px-4 py-2.5 rounded-full border ${isActive ? 'bg-blue-50 border-[#2566E2]' : 'border-gray-100'}`}
                                    >
                                        <Text
                                            className={`text-sm font-bold ${isActive ? 'text-[#2566E2]' : 'text-[#64748B]'}`}
                                        >
                                            {progress}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] font-bold text-base">
                            Manager note
                        </Text>
                        <TextInput
                            value={item.note || ''}
                            onChangeText={(text) =>
                                onNoteChange(item.id, text)
                            }
                            multiline
                            placeholder="Add note for this request"
                            placeholderTextColor="#94A3B8"
                            className="min-h-[90px] bg-[#F8FAFC] rounded-xl p-3 mt-3 text-[#1E293B]"
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
