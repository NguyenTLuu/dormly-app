import {
    deleteAdminUser,
    getAdminUsers,
    toggleAdminUserStatus,
} from '@/api/adminApi';
import { AdminHeader } from '@/components/admin';
import type { AdminUser } from '@/types/admin';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
import { useRouter, type Href } from 'expo-router';

type RoleFilter = 'ALL' | 'ADMIN' | 'STAFF' | 'USER';
type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function AdminUsersScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
    const queryClient = useQueryClient();
    const users = useQuery({
        queryKey: ['admin-users'],
        queryFn: getAdminUsers,
    });
    const refresh = () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
            queryClient.invalidateQueries({
                queryKey: ['inactive-resident-accounts'],
            }),
        ]);
    const toggle = useMutation({
        mutationFn: toggleAdminUserStatus,
        onSuccess: () => {
            toast.success('User status updated');
            refresh();
        },
        onError: () => toast.error('Could not update user status'),
    });
    const remove = useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => {
            toast.success('User deleted');
            setDeleteTarget(null);
            refresh();
        },
        onError: () => toast.error('Could not delete user'),
    });
    const filteredUsers = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        return (users.data ?? []).filter((user) => {
            const roles = user.roles.map(normalizeRole);
            const matchesQuery =
                !keyword ||
                [user.fullName, user.email, user.roles.join(' ')]
                    .join(' ')
                    .toLowerCase()
                    .includes(keyword);
            const matchesRole =
                roleFilter === 'ALL' || roles.includes(roleFilter);
            const matchesStatus =
                statusFilter === 'ALL' ||
                (statusFilter === 'ACTIVE' ? user.isActive : !user.isActive);
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [query, roleFilter, statusFilter, users.data]);

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                title="User Management"
                subtitle="Manage system accounts"
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={users.isRefetching}
                        onRefresh={() => void users.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <View className="bg-white rounded-2xl border border-slate-100 p-3 mb-4">
                    <TouchableOpacity onPress={() => router.push('/admin-details/system' as Href)} className="bg-blue-50 rounded-xl p-3 mb-3"><Text className="text-blue-700 font-bold">Create accounts, assign roles and configure system</Text></TouchableOpacity>
                    <View className="flex-row items-center border border-slate-200 rounded-xl px-3">
                        <Ionicons
                            name="search-outline"
                            size={22}
                            color="#64748B"
                        />
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search name, email or role"
                            placeholderTextColor="#94A3B8"
                            className="flex-1 ml-2 py-3 text-[#1E293B]"
                        />
                        <Ionicons
                            name="options-outline"
                            size={21}
                            color="#2563EB"
                        />
                    </View>
                    <FilterRow
                        values={['ALL', 'ADMIN', 'STAFF', 'USER']}
                        selected={roleFilter}
                        onChange={(value) => setRoleFilter(value as RoleFilter)}
                    />
                    <FilterRow
                        values={['ALL', 'ACTIVE', 'INACTIVE']}
                        selected={statusFilter}
                        onChange={(value) =>
                            setStatusFilter(value as StatusFilter)
                        }
                    />
                </View>
                {users.isLoading ? (
                    <ActivityIndicator color="#2563EB" className="mt-4" />
                ) : null}
                {users.isError ? <LoadError /> : null}
                <View className="gap-3">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onToggle={() => toggle.mutate(user.id)}
                            onDelete={() => setDeleteTarget(user)}
                            busy={toggle.isPending || remove.isPending}
                        />
                    ))}
                    {!users.isLoading && filteredUsers.length === 0 ? (
                        <EmptyUsers />
                    ) : null}
                </View>
            </ScrollView>
            <DeleteUserModal
                user={deleteTarget}
                busy={remove.isPending}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
            />
        </View>
    );
}

function FilterRow({
    values,
    selected,
    onChange,
}: {
    values: string[];
    selected: string;
    onChange: (value: string) => void;
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
        >
            <View className="flex-row gap-2">
                {values.map((value) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => onChange(value)}
                        className={`px-4 py-2 rounded-xl border ${selected === value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}
                    >
                        <Text
                            className={`text-xs font-bold ${selected === value ? 'text-blue-600' : 'text-slate-600'}`}
                        >
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

function UserCard({
    user,
    onToggle,
    onDelete,
    busy,
}: {
    user: AdminUser;
    onToggle: () => void;
    onDelete: () => void;
    busy: boolean;
}) {
    const role = normalizeRole(user.roles[0]);
    const canDelete = role !== 'ADMIN';
    const roleStyle =
        role === 'ADMIN'
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : role === 'STAFF'
              ? 'bg-purple-50 text-purple-600 border-purple-200'
              : 'bg-sky-50 text-sky-600 border-sky-200';
    return (
        <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <View className="flex-row items-start">
                <View className="w-14 h-14 rounded-full bg-blue-50 items-center justify-center">
                    <Ionicons name="person" size={26} color="#2563EB" />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {user.fullName || 'Unnamed user'}
                    </Text>
                    <Text className="text-[#64748B] text-sm mt-1">
                        {user.email}
                    </Text>
                    {user.phoneNumber ? (
                        <Text className="text-[#64748B] text-xs mt-1">
                            {user.phoneNumber}
                        </Text>
                    ) : null}
                </View>
                <View className="items-end gap-2">
                    <View
                        className={`px-2.5 py-1 rounded-lg border ${roleStyle}`}
                    >
                        <Text
                            className={`text-[10px] font-bold ${roleStyle.split(' ')[1]}`}
                        >
                            {role}
                        </Text>
                    </View>
                    <View
                        className={`px-2.5 py-1 rounded-lg ${user.isActive ? 'bg-emerald-50' : 'bg-red-50'}`}
                    >
                        <Text
                            className={`text-[10px] font-bold ${user.isActive ? 'text-emerald-700' : 'text-red-600'}`}
                        >
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="border-t border-slate-100 mt-4 pt-3 flex-row items-center justify-between">
                <Text className="text-[#64748B] text-xs">
                    {user.createdAt
                        ? `Created ${formatDate(user.createdAt)}`
                        : 'Account information'}
                </Text>
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        disabled={busy}
                        onPress={onToggle}
                        className="rounded-xl border border-blue-600 px-3 py-2"
                    >
                        <Text className="text-blue-600 text-xs font-bold">
                            {user.isActive ? 'Deactivate' : 'Activate'}
                        </Text>
                    </TouchableOpacity>
                    {canDelete ? (
                        <TouchableOpacity
                            disabled={busy}
                            onPress={onDelete}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2"
                        >
                            <Ionicons
                                name="trash-outline"
                                size={17}
                                color="#DC2626"
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            {!canDelete ? (
                <Text className="text-slate-400 text-[11px] mt-2">
                    Admin accounts cannot be deleted.
                </Text>
            ) : null}
        </View>
    );
}

function DeleteUserModal({
    user,
    busy,
    onCancel,
    onConfirm,
}: {
    user: AdminUser | null;
    busy: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <Modal visible={Boolean(user)} transparent animationType="fade">
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
                        Delete user?
                    </Text>
                    <Text className="text-[#64748B] text-sm text-center mt-2">
                        {user?.fullName || 'This account'} will be permanently
                        removed.
                    </Text>
                    <View className="flex-row gap-3 w-full mt-6">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 rounded-xl border border-slate-200 py-3 items-center"
                        >
                            <Text className="text-slate-700 font-bold">
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

function normalizeRole(role?: string) {
    return (role || 'USER').replace(/^ROLE_/, '').toUpperCase();
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function LoadError() {
    return (
        <Text className="text-red-600 text-sm font-semibold mb-3">
            Could not load users.
        </Text>
    );
}

function EmptyUsers() {
    return (
        <View className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 items-center">
            <Ionicons name="people-outline" size={34} color="#94A3B8" />
            <Text className="text-[#1E293B] font-bold mt-3">
                No users found
            </Text>
            <Text className="text-[#64748B] text-sm mt-1 text-center">
                Try changing the search or filters.
            </Text>
        </View>
    );
}
