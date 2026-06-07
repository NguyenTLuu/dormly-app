import {
    AttachmentList,
    ReporterAvatar,
    RequestModalSectionTitle,
    RequestStatusPill,
} from '@/components/manager-requests';
import {
    WorkRequest,
    WorkStatus,
    complaintRequests,
    handlerOptions,
    issueRequests,
    progressOptions,
    transferRoomRequests,
} from '@/data/manager-requests';
import { addActivityLog } from '@/data/activity-log';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function TicketDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
    const initialWork = useMemo(
        () =>
            [...issueRequests, ...complaintRequests].find(
                (item) => item.id === id
            ),
        [id]
    );
    const initialTransfer = useMemo(
        () => transferRoomRequests.find((item) => item.id === id),
        [id]
    );
    const [work, setWork] = useState<WorkRequest | undefined>(initialWork);
    const [transferStatus, setTransferStatus] = useState<WorkStatus>(
        initialTransfer?.status || 'Pending'
    );
    const [denialReason, setDenialReason] = useState('');

    if (type === 'transfer' && initialTransfer) {
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
                        <BackButton onPress={() => router.back()} />
                        <Text className="font-medium text-2xl ml-3">
                            Request Detail
                        </Text>
                    </View>
                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <Text className="text-[#1E293B] text-2xl font-bold">
                            Ticket Detail
                        </Text>
                        <Text className="text-[#64748B] text-sm font-semibold mt-1">
                            {initialTransfer.id} - {initialTransfer.student}
                        </Text>
                        <Text className="text-[#2563EB] text-sm font-bold mt-3">
                            {initialTransfer.block} - {initialTransfer.floor} -
                            Room {initialTransfer.currentRoom}
                        </Text>
                        <Text className="text-[#7C3AED] text-sm font-bold mt-1">
                            To {initialTransfer.requestedBlock} -{' '}
                            {initialTransfer.requestedFloor} - Room{' '}
                            {initialTransfer.requestedRoom}
                        </Text>
                    </View>
                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <RequestModalSectionTitle
                            title="Request Detail"
                            icon="document-text-outline"
                            color="#7C3AED"
                            bgColor="#EDE9FE"
                        />
                        <Text className="text-[#64748B] text-sm font-medium leading-5">
                            {initialTransfer.reason}
                        </Text>
                    </View>
                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <RequestModalSectionTitle
                            title="Ticket Status"
                            icon="git-compare-outline"
                            color="#0F766E"
                            bgColor="#CCFBF1"
                        />
                        <View className="flex-row gap-2">
                            {progressOptions.map((status) => {
                                const active = transferStatus === status;
                                const colors =
                                    status === 'Pending'
                                        ? ['#FEF3C7', '#D97706']
                                        : status === 'In Progress'
                                          ? ['#DBEAFE', '#2563EB']
                                          : ['#DCFCE7', '#16A34A'];
                                return (
                                    <TouchableOpacity
                                        key={status}
                                        onPress={() =>
                                            setTransferStatus(
                                                status as WorkStatus
                                            )
                                        }
                                        className="flex-1 rounded-2xl py-3 items-center border"
                                        style={{
                                            backgroundColor: active
                                                ? colors[0]
                                                : '#FFFFFF',
                                            borderColor: active
                                                ? colors[1]
                                                : '#F1F5F9',
                                        }}
                                    >
                                        <Text
                                            className="text-xs font-bold"
                                            style={{
                                                color: active
                                                    ? colors[1]
                                                    : '#64748B',
                                            }}
                                        >
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    {transferStatus !== 'Resolved' && (
                        <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                            <RequestModalSectionTitle
                                title="Manager Action"
                                icon="shield-checkmark-outline"
                                color="#2563EB"
                                bgColor="#DBEAFE"
                            />
                            <TextInput
                                value={denialReason}
                                onChangeText={setDenialReason}
                                multiline
                                placeholder="Reason for denial"
                                className="min-h-[80px] bg-[#F8FAFC] rounded-2xl p-3 text-[#1E293B]"
                                textAlignVertical="top"
                            />
                            <View className="flex-row gap-3 mt-3">
                                <ActionButton
                                    label="Approve"
                                    color="#16A34A"
                                    onPress={() =>
                                        toast.success('Transfer approved')
                                    }
                                />
                                <ActionButton
                                    label="Deny"
                                    color="#EF4444"
                                    onPress={() =>
                                        toast.error('Transfer denied', {
                                            description:
                                                denialReason ||
                                                'Denied by manager review.',
                                        })
                                    }
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    }

    if (!work) {
        return (
            <View className="flex-1 bg-[#F4FAFD] items-center justify-center">
                <Text>Ticket not found.</Text>
            </View>
        );
    }

    const isComplaint = work.id.startsWith('CMP');
    const accentColor = isComplaint ? '#7C3AED' : '#F97316';
    const accentBg = isComplaint ? '#EDE9FE' : '#FFEDD5';
    const updateHandler = (handler: string) => {
        setWork({
            ...work,
            assignee: handler === 'Unassigned' ? undefined : handler,
        });
        addActivityLog({
            action: 'Assigned ticket handler',
            detail: `${work.id} assigned to ${handler}.`,
            actorName: 'Nguyen Minh Manager',
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'ticket-outline',
            color: accentColor,
        });
    };
    const updateProgress = (status: string) => {
        setWork({
            ...work,
            status: status as WorkStatus,
            progress: status,
        });
        addActivityLog({
            action: 'Changed ticket progress',
            detail: `${work.id} moved to ${status}.`,
            actorName: 'Nguyen Minh Manager',
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'git-compare-outline',
            color: accentColor,
        });
    };

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
                    <BackButton onPress={() => router.back()} />
                    <Text className="font-medium text-2xl ml-3">
                        Request Detail
                    </Text>
                </View>
                <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                    <Text className="text-[#1E293B] text-2xl font-bold">
                        {work.title}
                    </Text>
                    <Text className="text-[#64748B] text-sm font-semibold mt-1">
                        {work.id} - {work.category}
                    </Text>
                    <Text
                        className="text-sm font-bold mt-3"
                        style={{ color: accentColor }}
                    >
                        {work.block} - {work.floor} - Room {work.room}
                    </Text>
                    <View className="mt-3">
                        <RequestStatusPill status={work.status} />
                    </View>
                </View>
                <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <RequestModalSectionTitle
                        title="Report Detail"
                        icon="document-text-outline"
                        color={accentColor}
                        bgColor={accentBg}
                    />
                    <Text className="text-[#64748B] text-sm font-medium leading-5">
                        {work.description}
                    </Text>
                    <View className="flex-row items-center mt-4 bg-[#F8FAFC] rounded-2xl p-3">
                        <ReporterAvatar initials={work.reporterAvatar} />
                        <View className="ml-3">
                            <Text className="font-bold">{work.reportedBy}</Text>
                            <Text className="text-[#64748B] text-xs mt-1">
                                {work.reportedTime}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <RequestModalSectionTitle
                        title="Attachments"
                        icon="images-outline"
                        color="#2563EB"
                        bgColor="#DBEAFE"
                    />
                    <AttachmentList attachments={work.attachments} />
                </View>
                <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <RequestModalSectionTitle
                        title="Assign Handler"
                        icon="person-add-outline"
                        color="#0F766E"
                        bgColor="#CCFBF1"
                    />
                    <View className="flex-row flex-wrap gap-2">
                        {handlerOptions.map((handler) => {
                            const active =
                                (work.assignee ?? 'Unassigned') === handler;

                            return (
                                <TouchableOpacity
                                    key={handler}
                                    onPress={() => updateHandler(handler)}
                                    className="px-3 py-2 rounded-full border"
                                    style={{
                                        backgroundColor: active
                                            ? '#CCFBF1'
                                            : '#FFFFFF',
                                        borderColor: active
                                            ? '#0F766E'
                                            : '#F1F5F9',
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{
                                            color: active
                                                ? '#0F766E'
                                                : '#64748B',
                                        }}
                                    >
                                        {handler}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <RequestModalSectionTitle
                        title="Progress"
                        icon="git-compare-outline"
                        color="#7C3AED"
                        bgColor="#EDE9FE"
                    />
                    <View className="flex-row gap-2">
                        {progressOptions.map((status) => {
                            const active = work.status === status;
                            const colors =
                                status === 'Pending'
                                    ? ['#FEF3C7', '#D97706']
                                    : status === 'In Progress'
                                      ? ['#DBEAFE', '#2563EB']
                                      : ['#DCFCE7', '#16A34A'];

                            return (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => updateProgress(status)}
                                    className="flex-1 rounded-2xl py-3 border items-center"
                                    style={{
                                        backgroundColor: active
                                            ? colors[0]
                                            : '#FFFFFF',
                                        borderColor: active
                                            ? colors[1]
                                            : '#F1F5F9',
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{
                                            color: active
                                                ? colors[1]
                                                : '#64748B',
                                        }}
                                    >
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function BackButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-11 h-11 rounded-full bg-white border border-gray-100 items-center justify-center"
        >
            <Ionicons name="chevron-back" size={22} color="#1E293B" />
        </TouchableOpacity>
    );
}

function ActionButton({
    label,
    color,
    onPress,
}: {
    label: string;
    color: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-1 rounded-2xl py-3 items-center"
            style={{ backgroundColor: color }}
        >
            <Text className="text-white font-bold">{label}</Text>
        </TouchableOpacity>
    );
}
