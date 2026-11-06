import {
    addAdminTicketComment,
    getAdminTicketDetail,
    updateAdminTicketPriority,
    updateAdminTicketStatus,
} from '@/api/adminApi';
import TicketFiles from '@/components/admin/TicketFiles';
import * as DocumentPicker from 'expo-document-picker';
import { AdminHeader } from '@/components/admin';
import TicketWorkEditor from '@/components/admin/TicketWorkEditor';
import { useKeyboardBottomPadding } from '@/hooks/useKeyboardBottomPadding';
import type {
    AdminTicketDetail,
    AdminTicketPriority,
    AdminTicketStatus,
} from '@/types/admin';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const transitions: Record<AdminTicketStatus, AdminTicketStatus[]> = {
    OPEN: ['IN_PROGRESS', 'REJECTED'],
    IN_PROGRESS: ['RESOLVED', 'REJECTED', 'OPEN'],
    RESOLVED: ['CLOSED', 'IN_PROGRESS'],
    REJECTED: [],
    CLOSED: [],
};
const priorities: AdminTicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AdminTicketDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const paddingBottom = useKeyboardBottomPadding(32, 240);
    const queryClient = useQueryClient();
    const [updateVisible, setUpdateVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [internal, setInternal] = useState(true);
    const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
    const pickFiles = async () => {
        try {
        const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true, type: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'] });
        if (result.canceled) return;
        if (files.length + result.assets.length > 5 || result.assets.some((file) => !file.size || file.size > 10 * 1024 * 1024)) return toast.error('Maximum 5 files, 10 MB per file');
        setFiles((current) => [...current, ...result.assets]);
        } catch { toast.error('Could not select files'); }
    };
    const ticket = useQuery({
        queryKey: ['admin-ticket', id],
        queryFn: () => getAdminTicketDetail(id),
        enabled: Boolean(id),
    });
    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-ticket', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['manager-tickets'] });
        queryClient.invalidateQueries({ queryKey: ['operational-insights'] });
    };
    const statusMutation = useMutation({
        mutationFn: ({
            status,
            resolutionNote,
        }: {
            status: AdminTicketStatus;
            resolutionNote?: string;
        }) => updateAdminTicketStatus(id, status, resolutionNote),
        onSuccess: () => {
            toast.success('Status updated');
            setUpdateVisible(false);
            refresh();
        },
        onError: () => toast.error('Could not update status'),
    });
    const priorityMutation = useMutation({
        mutationFn: (priority: AdminTicketPriority) =>
            updateAdminTicketPriority(id, priority),
        onSuccess: () => {
            toast.success('Priority updated');
            refresh();
        },
        onError: () => toast.error('Could not update priority'),
    });
    const commentMutation = useMutation({
        mutationFn: () => addAdminTicketComment(id, comment.trim(), internal, files),
        onSuccess: () => {
            setComment('');
            setFiles([]);
            toast.success('Comment added');
            refresh();
        },
        onError: () => toast.error('Could not add comment'),
    });

    if (ticket.isLoading) {
        return (
            <View className="flex-1 bg-[#F4FAFD] items-center justify-center">
                <ActivityIndicator color="#2563EB" />
            </View>
        );
    }
    if (ticket.isError || !ticket.data) {
        return (
            <View className="flex-1 bg-[#F4FAFD]">
                <AdminHeader
                    title="Ticket Detail"
                    subtitle="Unable to load ticket"
                    onBack={() => router.back()}
                />
                <View className="m-4 bg-red-50 border border-red-200 rounded-2xl p-5">
                    <Text className="text-red-700 font-bold">
                        Could not load this ticket.
                    </Text>
                </View>
            </View>
        );
    }
    const item = ticket.data;
    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F4FAFD]"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <AdminHeader
                title="Ticket Detail"
                subtitle={`${item.category} · ${item.code}`}
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={ticket.isRefetching}
                        onRefresh={() => void ticket.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <TicketSummary
                    ticket={item}
                    onUpdate={() => setUpdateVisible(true)}
                />
                <TicketWorkEditor ticket={item} onSaved={refresh} />
                <InfoCard title="Description" icon="document-text-outline">
                    <Text className="text-[#334155] text-sm leading-6">
                        {item.description || 'No description provided.'}
                    </Text>
                </InfoCard>
                <InfoCard
                    title={`Attachments (${item.attachments?.length ?? 0})`}
                    icon="attach-outline"
                >
                    <TicketFiles files={item.attachments ?? []} onChanged={refresh} />
                </InfoCard>
                <InfoCard
                    title={`Comments (${item.comments?.length ?? 0})`}
                    icon="chatbubble-ellipses-outline"
                >
                    {item.comments?.length ? (
                        item.comments.map((entry) => (
                            <View
                                key={entry.id}
                                className="border-b border-slate-100 pb-3 mb-3"
                            >
                                <View className="flex-row items-center">
                                    <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
                                        <Text className="text-blue-600 font-bold">
                                            {initials(entry.authorName)}
                                        </Text>
                                    </View>
                                    <Text className="text-[#1E293B] text-sm font-bold ml-2">
                                        {entry.authorName}
                                    </Text>
                                    <View
                                        className={`ml-2 px-2 py-0.5 rounded-full ${entry.internal ? 'bg-blue-50' : 'bg-purple-50'}`}
                                    >
                                        <Text
                                            className={`text-[10px] font-bold ${entry.internal ? 'text-blue-600' : 'text-purple-600'}`}
                                        >
                                            {entry.internal
                                                ? 'Internal'
                                                : 'Student'}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-[#334155] text-sm leading-5 mt-2 ml-11">
                                    {entry.body}
                                </Text>
                                <TicketFiles files={entry.attachments ?? []} onChanged={refresh} />
                                <Text className="text-[#94A3B8] text-[10px] mt-1 ml-11">
                                    {entry.createdAt
                                        ? formatDateTime(entry.createdAt)
                                        : 'Just now'}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-slate-500 text-sm">
                            No comments yet.
                        </Text>
                    )}
                    <View className="border border-slate-200 rounded-xl mt-1">
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            placeholder="Add a comment..."
                            placeholderTextColor="#94A3B8"
                            className="min-h-20 px-3 py-3 text-[#1E293B]"
                            textAlignVertical="top"
                        />
                        <View className="p-3 gap-2">
                            <TouchableOpacity disabled={commentMutation.isPending} onPress={() => void pickFiles()}><Text className="text-blue-700 font-bold">Attach images / PDF (max 5)</Text></TouchableOpacity>
                            {files.map((file, index) => <TouchableOpacity key={file.uri + index} disabled={commentMutation.isPending} onPress={() => setFiles((current) => current.filter((_, position) => position !== index))}><Text className="text-slate-600">{file.name} · Remove</Text></TouchableOpacity>)}
                        </View>
                        <View className="flex-row items-center justify-between border-t border-slate-100 px-3 py-2">
                            <TouchableOpacity
                                onPress={() => setInternal((value) => !value)}
                                className={`px-2.5 py-1.5 rounded-lg ${internal ? 'bg-blue-50' : 'bg-purple-50'}`}
                            >
                                <Text
                                    className={`text-[10px] font-bold ${internal ? 'text-blue-600' : 'text-purple-600'}`}
                                >
                                    {internal
                                        ? 'Internal comment'
                                        : 'Student-visible'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={
                                    !comment.trim() || commentMutation.isPending
                                }
                                onPress={() => commentMutation.mutate()}
                                className="w-9 h-9 rounded-full bg-blue-600 items-center justify-center"
                            >
                                <Ionicons name="send" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </InfoCard>
            </ScrollView>
            <UpdateTicketModal
                ticket={item}
                visible={updateVisible}
                busy={statusMutation.isPending || priorityMutation.isPending}
                onClose={() => setUpdateVisible(false)}
                onStatus={(status) =>
                    statusMutation.mutate({
                        status,
                        resolutionNote:
                            status === 'RESOLVED'
                                ? 'Resolved by staff review.'
                                : undefined,
                    })
                }
                onPriority={(priority) => priorityMutation.mutate(priority)}
            />
        </KeyboardAvoidingView>
    );
}

function TicketSummary({
    ticket,
    onUpdate,
}: {
    ticket: AdminTicketDetail;
    onUpdate: () => void;
}) {
    return (
        <View className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center">
                    <Ionicons name="ticket-outline" size={25} color="#2563EB" />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-blue-600 font-bold text-sm">
                        {ticket.code}
                    </Text>
                    <Text className="text-[#1E293B] text-xl font-bold mt-1">
                        {ticket.title}
                    </Text>
                </View>
                <StatusChip status={ticket.status} />
            </View>
            <View className="flex-row flex-wrap gap-x-4 gap-y-2 mt-5">
                <Meta
                    icon="person-outline"
                    label="Reported by"
                    value={ticket.reporterName || 'Unknown'}
                />
                <Meta
                    icon="business-outline"
                    label="Location"
                    value={ticket.buildingNodeName || 'Not assigned'}
                />
                <Meta
                    icon="calendar-outline"
                    label="Created"
                    value={
                        ticket.createdAt
                            ? formatDateTime(ticket.createdAt)
                            : 'Unknown'
                    }
                />
                <Meta
                    icon="alarm-outline"
                    label="Due date"
                    value={
                        ticket.dueDate
                            ? formatDateTime(ticket.dueDate)
                            : 'Not set'
                    }
                />
            </View>
            <TouchableOpacity
                onPress={onUpdate}
                className="border-t border-slate-100 mt-4 pt-3 flex-row items-center justify-center"
            >
                <Ionicons name="create-outline" size={18} color="#2563EB" />
                <Text className="text-blue-600 font-bold text-sm ml-2">
                    Update ticket
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function InfoCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    children: React.ReactNode;
}) {
    return (
        <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                    <Ionicons name={icon} size={21} color="#2563EB" />
                </View>
                <Text className="text-[#1E293B] text-base font-bold ml-3">
                    {title}
                </Text>
            </View>
            {children}
        </View>
    );
}

function Meta({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) {
    return (
        <View className="w-[47%]">
            <View className="flex-row items-center">
                <Ionicons name={icon} size={15} color="#2563EB" />
                <Text className="text-[#64748B] text-xs ml-1">{label}</Text>
            </View>
            <Text
                className="text-[#1E293B] text-sm font-semibold mt-1"
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );
}

function StatusChip({ status }: { status: AdminTicketStatus }) {
    const color =
        status === 'OPEN'
            ? 'text-blue-600 bg-blue-50'
            : status === 'IN_PROGRESS'
              ? 'text-orange-600 bg-orange-50'
              : status === 'RESOLVED'
                ? 'text-emerald-600 bg-emerald-50'
                : status === 'REJECTED'
                  ? 'text-red-600 bg-red-50'
                  : 'text-purple-600 bg-purple-50';
    const pieces = color.split(' ');
    return (
        <View className={`px-2.5 py-1.5 rounded-lg ${pieces[1]}`}>
            <Text className={`text-[10px] font-bold ${pieces[0]}`}>
                {status.replace('_', ' ')}
            </Text>
        </View>
    );
}

function UpdateTicketModal({
    ticket,
    visible,
    busy,
    onClose,
    onStatus,
    onPriority,
}: {
    ticket: AdminTicketDetail;
    visible: boolean;
    busy: boolean;
    onClose: () => void;
    onStatus: (status: AdminTicketStatus) => void;
    onPriority: (priority: AdminTicketPriority) => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-slate-900/35 justify-end">
                <View className="bg-white rounded-t-3xl px-5 pt-3 pb-8">
                    <View className="w-12 h-1.5 rounded-full bg-slate-300 self-center mb-5" />
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-[#1E293B] text-xl font-bold">
                                Update Ticket
                            </Text>
                            <Text className="text-[#64748B] text-sm mt-1">
                                Update the details for {ticket.code}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[#1E293B] font-bold mt-5 mb-2">
                        Status
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View className="flex-row gap-2">
                            {transitions[ticket.status].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    disabled={busy}
                                    onPress={() => onStatus(status)}
                                    className={`px-3 py-3 rounded-xl border ${ticket.status === status ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
                                >
                                    <Text
                                        className={`text-xs font-bold ${ticket.status === status ? 'text-blue-600' : 'text-slate-600'}`}
                                    >
                                        {status.replace('_', ' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    {transitions[ticket.status].length === 0 ? (
                        <Text className="text-slate-500 text-sm">
                            This ticket is closed to status changes.
                        </Text>
                    ) : null}
                    <Text className="text-[#1E293B] font-bold mt-5 mb-2">
                        Priority
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {priorities.map((priority) => (
                            <TouchableOpacity
                                key={priority}
                                disabled={busy}
                                onPress={() => onPriority(priority)}
                                className={`flex-1 min-w-[22%] py-3 rounded-xl border items-center ${ticket.priority === priority ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
                            >
                                <Text
                                    className={`text-xs font-bold ${ticket.priority === priority ? 'text-blue-600' : 'text-slate-600'}`}
                                >
                                    {priority}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text className="text-[#1E293B] font-bold mt-5 mb-2">
                        Assigned staff
                    </Text>
                    {ticket.assignees?.length ? (
                        ticket.assignees.map((assignee) => (
                            <View
                                key={assignee.id}
                                className="border border-slate-200 rounded-xl p-3 flex-row items-center"
                            >
                                <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
                                    <Text className="text-blue-600 font-bold">
                                        {initials(assignee.fullName)}
                                    </Text>
                                </View>
                                <View className="ml-2">
                                    <Text className="text-[#1E293B] text-sm font-semibold">
                                        {assignee.fullName}
                                    </Text>
                                    <Text className="text-[#64748B] text-xs mt-1">
                                        {assignee.email}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-slate-500 text-sm">
                            No staff assigned.
                        </Text>
                    )}
                    <TouchableOpacity
                        onPress={onClose}
                        className="border border-slate-200 rounded-xl py-3 mt-5 items-center"
                    >
                        <Text className="text-blue-600 font-bold">Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function initials(name?: string) {
    return (name || 'User')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}
