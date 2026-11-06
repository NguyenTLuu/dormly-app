import {
    createAdminAnnouncement,
    deleteAdminAnnouncement,
    getAdminAnnouncements,
} from '@/api/adminApi';
import { useAuth } from '@/auth/AuthContext';
import { AdminHeader } from '@/components/admin';
import type { AdminAnnouncement } from '@/types/admin';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const priorities = ['NORMAL', 'IMPORTANT', 'EMERGENCY'];

export default function AdminAnnouncementsScreen() {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const announcements = useQuery({
        queryKey: ['admin-announcements'],
        queryFn: getAdminAnnouncements,
    });
    const [showCreate, setShowCreate] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<AdminAnnouncement | null>(
        null
    );
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('NORMAL');
    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };
    const create = useMutation({
        mutationFn: createAdminAnnouncement,
        onSuccess: () => {
            toast.success('Announcement published');
            setTitle('');
            setContent('');
            setShowCreate(false);
            refresh();
        },
        onError: () => toast.error('Could not publish announcement'),
    });
    const remove = useMutation({
        mutationFn: deleteAdminAnnouncement,
        onSuccess: () => {
            toast.success('Announcement removed');
            setDeleteTarget(null);
            refresh();
        },
        onError: () => toast.error('Could not remove announcement'),
    });
    const submit = () => {
        if (!title.trim() || !content.trim()) {
            toast.error('Enter a title and content');
            return;
        }
        create.mutate({
            title: title.trim(),
            content: content.trim(),
            priority,
            author: session?.fullName || session?.email || 'Admin',
        });
    };
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                title="Announcements"
                subtitle="Official dormitory notices"
                rightAction={
                    <TouchableOpacity
                        onPress={() => setShowCreate((value) => !value)}
                        className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
                    >
                        <Ionicons
                            name={showCreate ? 'close' : 'add'}
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>
                }
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={announcements.isRefetching}
                        onRefresh={() => void announcements.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                {showCreate ? (
                    <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-5">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                                <Ionicons
                                    name="megaphone-outline"
                                    size={22}
                                    color="#2563EB"
                                />
                            </View>
                            <View className="ml-3">
                                <Text className="text-[#1E293B] font-bold text-base">
                                    Create Announcement
                                </Text>
                                <Text className="text-[#64748B] text-xs mt-1">
                                    Publish a dormitory notice
                                </Text>
                            </View>
                        </View>
                        <Text className="text-[#1E293B] text-xs font-bold">
                            Title
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                            placeholder="Enter announcement title"
                            placeholderTextColor="#94A3B8"
                            className="bg-white border border-slate-200 rounded-xl px-3 py-3 mt-2 text-[#1E293B]"
                        />
                        <Text className="text-[#1E293B] text-xs font-bold mt-4">
                            Content
                        </Text>
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            maxLength={1000}
                            multiline
                            textAlignVertical="top"
                            placeholder="Write your announcement here..."
                            placeholderTextColor="#94A3B8"
                            className="bg-white border border-slate-200 rounded-xl px-3 py-3 mt-2 min-h-28 text-[#1E293B]"
                        />
                        <Text className="text-[#1E293B] text-xs font-bold mt-4">
                            Priority
                        </Text>
                        <View className="flex-row gap-2 mt-2">
                            {priorities.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setPriority(item)}
                                    className={`flex-1 rounded-xl border py-3 items-center ${priority === item ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}
                                >
                                    <Ionicons
                                        name={
                                            item === 'NORMAL'
                                                ? 'megaphone-outline'
                                                : item === 'IMPORTANT'
                                                  ? 'alert-circle-outline'
                                                  : 'warning-outline'
                                        }
                                        size={20}
                                        color={
                                            item === 'NORMAL'
                                                ? '#2563EB'
                                                : item === 'IMPORTANT'
                                                  ? '#EA580C'
                                                  : '#DC2626'
                                        }
                                    />
                                    <Text
                                        className={`text-[10px] font-bold mt-1 ${priority === item ? 'text-blue-600' : 'text-slate-600'}`}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="flex-row items-center bg-blue-50 rounded-xl p-3 mt-4">
                            <Ionicons
                                name="person-circle-outline"
                                size={25}
                                color="#2563EB"
                            />
                            <View className="ml-2 flex-1">
                                <Text className="text-[#1E293B] text-xs font-bold">
                                    Current Admin
                                </Text>
                                <Text className="text-[#64748B] text-[11px] mt-1">
                                    {session?.email || 'admin@dormly.com'}
                                </Text>
                            </View>
                            <Text className="text-blue-600 text-[10px] font-bold">
                                ADMIN
                            </Text>
                        </View>
                        <TouchableOpacity
                            disabled={create.isPending}
                            onPress={submit}
                            className="bg-blue-600 rounded-xl py-3 mt-4 items-center"
                        >
                            <Text className="text-white font-bold">
                                {create.isPending
                                    ? 'Publishing...'
                                    : 'Publish Announcement'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        Published
                    </Text>
                    <Text className="text-[#64748B] text-xs">
                        {announcements.data?.length ?? 0} notices
                    </Text>
                </View>
                {announcements.isLoading ? (
                    <ActivityIndicator color="#2563EB" />
                ) : null}
                {announcements.isError ? (
                    <Text className="text-red-600 font-semibold">
                        Could not load announcements.
                    </Text>
                ) : null}
                <View className="gap-3">
                    {(announcements.data ?? []).map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onDelete={() => setDeleteTarget(announcement)}
                        />
                    ))}
                    {!announcements.isLoading &&
                    (announcements.data ?? []).length === 0 ? (
                        <View className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 items-center">
                            <Ionicons
                                name="file-tray-outline"
                                size={35}
                                color="#94A3B8"
                            />
                            <Text className="text-[#1E293B] font-bold mt-3">
                                No announcements yet
                            </Text>
                            <Text className="text-[#64748B] text-sm mt-1 text-center">
                                There are no notices to display at the moment.
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCreate(true)}
                            >
                                <Text className="text-blue-600 font-bold mt-3">
                                    Create Announcement
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
            <DeleteAnnouncementModal
                announcement={deleteTarget}
                busy={remove.isPending}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
            />
        </View>
    );
}

function AnnouncementCard({
    announcement,
    onDelete,
}: {
    announcement: AdminAnnouncement;
    onDelete: () => void;
}) {
    const priority = announcement.priority.toUpperCase();
    const color =
        priority === 'EMERGENCY'
            ? '#DC2626'
            : priority === 'IMPORTANT'
              ? '#EA580C'
              : '#2563EB';
    const bg =
        priority === 'EMERGENCY'
            ? 'bg-red-50'
            : priority === 'IMPORTANT'
              ? 'bg-orange-50'
              : 'bg-blue-50';
    return (
        <View className="bg-white border border-slate-100 rounded-2xl p-4">
            <View className="flex-row items-start">
                <View className="flex-1">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {announcement.title}
                    </Text>
                    <Text className="text-[#64748B] text-sm mt-2 leading-5">
                        {announcement.content}
                    </Text>
                </View>
                <View className={`${bg} rounded-xl px-2.5 py-1`}>
                    <Text style={{ color }} className="text-[10px] font-bold">
                        {priority}
                    </Text>
                </View>
            </View>
            <View className="border-t border-slate-100 mt-4 pt-3 flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                    <Ionicons name="person-outline" size={17} color="#2563EB" />
                </View>
                <Text className="text-[#1E293B] text-xs font-semibold ml-2">
                    {announcement.author}
                </Text>
                <Text className="text-slate-400 text-xs mx-2">•</Text>
                <Text className="text-[#64748B] text-xs">
                    {announcement.createdAt
                        ? formatDate(announcement.createdAt)
                        : 'Just now'}
                </Text>
                <TouchableOpacity onPress={onDelete} className="ml-auto p-1">
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function DeleteAnnouncementModal({
    announcement,
    busy,
    onCancel,
    onConfirm,
}: {
    announcement: AdminAnnouncement | null;
    busy: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <Modal visible={Boolean(announcement)} transparent animationType="fade">
            <View className="flex-1 bg-slate-900/40 items-center justify-center px-6">
                <View className="bg-white rounded-3xl w-full p-6 items-center">
                    <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center">
                        <Ionicons
                            name="trash-outline"
                            size={30}
                            color="#DC2626"
                        />
                    </View>
                    <Text className="text-[#1E293B] text-xl font-bold mt-4">
                        Delete announcement?
                    </Text>
                    <Text className="text-[#64748B] text-sm text-center mt-2">
                        This action cannot be undone. The notice will be
                        permanently removed.
                    </Text>
                    <View className="flex-row gap-3 w-full mt-6">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 rounded-xl border border-slate-200 py-3 items-center"
                        >
                            <Text className="text-blue-600 font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={onConfirm}
                            className="flex-1 rounded-xl bg-red-600 py-3 items-center"
                        >
                            <Text className="text-white font-bold">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
