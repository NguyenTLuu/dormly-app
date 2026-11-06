import { getStaffProfile, updateStaffProfile } from '@/api/staffProfileApi';
import { useAuth } from '@/auth/AuthContext';
import { ManagerHeader } from '@/components/manager-dashboard';
import type { AdminUser } from '@/types/admin';
import { profileBirthDate } from '@/utils/resident-profile';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

interface ProfileDraft {
    name: string;
    phone: string;
    birthDate: string;
}

function draftFromProfile(profile: AdminUser): ProfileDraft {
    return {
        name: profile.fullName || '',
        phone: profile.phoneNumber || '',
        birthDate: profile.dateOfBirth?.slice(0, 10) || '',
    };
}

export default function ManagerSettingScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { session, signOut, updateProfileName, hasRole } = useAuth();
    const userId = session?.userId;
    const [draft, setDraft] = useState<ProfileDraft | null>(null);
    const profile = useQuery({
        queryKey: ['staff-profile', userId],
        queryFn: () => getStaffProfile(userId!),
        enabled: Boolean(userId),
    });
    const save = useMutation({
        mutationFn: (input: {
            fullName: string;
            phoneNumber?: string;
            dateOfBirth?: string;
        }) => updateStaffProfile(userId!, input),
        onSuccess: (updated) => {
            queryClient.setQueryData(['staff-profile', userId], updated);
            setDraft(null);
            void updateProfileName(updated.fullName).catch(() =>
                toast.error('Profile saved, but the session name could not refresh')
            );
            void Promise.all(
                [
                    ['admin-users'],
                    ['manager-resident-users'],
                    ['room-management'],
                    ['manager-tickets'],
                    ['admin-tickets'],
                ].map((queryKey) => queryClient.invalidateQueries({ queryKey }))
            );
            toast.success('Profile updated');
        },
        onError: () => toast.error('Could not update profile'),
    });
    const current = profile.data;
    const editing = draft !== null;
    const name = current?.fullName || session?.fullName || session?.email || '';
    const roleNames = current?.roles ?? session?.roles ?? [];
    const role = roleNames.some(
        (item) => item.replace(/^ROLE_/i, '').toUpperCase() === 'ADMIN'
    )
        ? 'Administrator'
        : 'Staff';

    const saveProfile = () => {
        if (!draft || !current || !userId) return;
        const fullName = draft.name.trim();
        const phoneNumber = draft.phone.trim();
        const birthDate = draft.birthDate.trim();
        if (!fullName || fullName.length > 255) {
            toast.error('Enter a name of up to 255 characters');
            return;
        }
        if (current.phoneNumber && !phoneNumber) {
            toast.error('This API cannot clear an existing phone number');
            return;
        }
        if (
            phoneNumber &&
            (!/^\+?[0-9]{10,15}$/.test(phoneNumber) ||
                phoneNumber.length > 15)
        ) {
            toast.error('Enter a phone number with 10–15 digits');
            return;
        }
        if (current.dateOfBirth && !birthDate) {
            toast.error('This API cannot clear an existing birth date');
            return;
        }
        const dateOfBirth = birthDate ? profileBirthDate(birthDate) : null;
        if (birthDate && !dateOfBirth) {
            toast.error('Enter a valid past birth date (YYYY-MM-DD)');
            return;
        }
        save.mutate({
            fullName,
            ...(phoneNumber ? { phoneNumber } : {}),
            ...(dateOfBirth ? { dateOfBirth } : {}),
        });
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={profile.isRefetching}
                        onRefresh={() => void profile.refetch()}
                        tintColor="#2563EB"
                    />
                }
            >
                <ManagerHeader
                    title="Settings"
                    subtitle="Manage account and review activity"
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <SettingTitle
                            title="My Profile"
                            icon="person-outline"
                            color="#2563EB"
                            actionLabel={
                                current ? (editing ? 'Cancel' : 'Edit') : undefined
                            }
                            onAction={() => {
                                if (!current || save.isPending) return;
                                setDraft(
                                    editing ? null : draftFromProfile(current)
                                );
                            }}
                        />
                        {profile.isLoading ? (
                            <ActivityIndicator color="#2563EB" />
                        ) : null}
                        {profile.isError ? (
                            <TouchableOpacity
                                onPress={() => void profile.refetch()}
                                className="bg-red-50 rounded-xl p-3"
                            >
                                <Text className="text-red-700 font-semibold">
                                    Could not load your profile. Tap to retry.
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {current ? (
                            <>
                                <View className="flex-row items-center mb-4">
                                    <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center">
                                        <Text className="text-[#2563EB] text-xl font-bold">
                                            {name
                                                .split(' ')
                                                .filter(Boolean)
                                                .slice(-2)
                                                .map((part) => part[0])
                                                .join('')
                                                .toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-[#1E293B] text-lg font-bold">
                                            {name}
                                        </Text>
                                        <Text className="text-[#64748B] text-xs font-semibold mt-1">
                                            {role}
                                        </Text>
                                    </View>
                                </View>
                                <View className="gap-3">
                                    <ProfileField
                                        label="Full name"
                                        value={draft?.name ?? current.fullName}
                                        editable={editing && !save.isPending}
                                        onChangeText={(value) =>
                                            setDraft((previous) =>
                                                previous
                                                    ? { ...previous, name: value }
                                                    : previous
                                            )
                                        }
                                    />
                                    <ProfileField
                                        label="Email"
                                        value={current.email}
                                        editable={false}
                                    />
                                    <ProfileField
                                        label="Phone"
                                        value={draft?.phone ?? current.phoneNumber ?? ''}
                                        editable={editing && !save.isPending}
                                        keyboardType="phone-pad"
                                        onChangeText={(value) =>
                                            setDraft((previous) =>
                                                previous
                                                    ? { ...previous, phone: value }
                                                    : previous
                                            )
                                        }
                                    />
                                    <ProfileField
                                        label="Birth date (YYYY-MM-DD)"
                                        value={draft?.birthDate ?? current.dateOfBirth?.slice(0, 10) ?? ''}
                                        editable={editing && !save.isPending}
                                        placeholder="YYYY-MM-DD"
                                        onChangeText={(value) =>
                                            setDraft((previous) =>
                                                previous
                                                    ? { ...previous, birthDate: value }
                                                    : previous
                                            )
                                        }
                                    />
                                </View>
                                {editing ? (
                                    <TouchableOpacity
                                        activeOpacity={0.75}
                                        disabled={save.isPending}
                                        onPress={saveProfile}
                                        className="bg-blue-600 rounded-xl py-3 items-center mt-4"
                                    >
                                        <Text className="text-white text-sm font-bold">
                                            {save.isPending
                                                ? 'Saving...'
                                                : 'Save Profile'}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </>
                        ) : null}
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <SettingTitle
                            title="System Settings"
                            icon="options-outline"
                            color="#7C3AED"
                        />
                        {hasRole('ADMIN') ? <SettingsLink title="System administration" subtitle="Accounts, roles and system configuration" icon="shield-checkmark-outline" color="#7C3AED" onPress={() => router.push('/admin-details/system' as Href)} /> : null}
                        <SettingsLink
                            title="Change password"
                            subtitle="Update your account password"
                            icon="lock-closed-outline"
                            color="#2563EB"
                            onPress={() => router.push('/manager-settings-details/change-password' as Href)}
                        />
                        <SettingsLink
                            title="Activity Log"
                            subtitle="Review staff, student, and system activity"
                            icon="time-outline"
                            color="#0F766E"
                            onPress={() =>
                                router.push(
                                    '/manager-settings-details/activity-log'
                                )
                            }
                            last
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => {
                            void signOut();
                        }}
                        className="bg-red-50 border border-red-100 rounded-2xl py-4 flex-row items-center justify-center"
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={20}
                            color="#DC2626"
                        />
                        <Text className="text-[#DC2626] text-sm font-bold ml-2">
                            Log out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

function SettingsLink({
    title,
    subtitle,
    icon,
    color,
    onPress,
    last = false,
}: {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
    last?: boolean;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className={`flex-row items-center py-3.5 ${
                last ? '' : 'border-b border-gray-100'
            }`}
        >
            <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: `${color}18` }}
            >
                <Ionicons name={icon} size={21} color={color} />
            </View>
            <View className="ml-3 flex-1">
                <Text className="text-[#1E293B] text-sm font-bold">
                    {title}
                </Text>
                <Text className="text-[#64748B] text-xs font-semibold mt-1">
                    {subtitle}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color="#94A3B8" />
        </TouchableOpacity>
    );
}

function SettingTitle({
    title,
    icon,
    color,
    actionLabel,
    onAction,
}: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <View className="flex-row items-center mb-3">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${color}18` }}
            >
                <Ionicons name={icon} size={19} color={color} />
            </View>
            <Text className="text-[#1E293B] text-base font-bold ml-2.5 flex-1">
                {title}
            </Text>
            {actionLabel && onAction && (
                <TouchableOpacity onPress={onAction}>
                    <Text className="text-[#2563EB] text-xs font-bold">
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function ProfileField({
    label,
    editable,
    ...props
}: React.ComponentProps<typeof TextInput> & {
    label: string;
    editable: boolean;
}) {
    return (
        <View>
            <Text className="text-[#94A3B8] text-[10px] font-bold mb-1">
                {label}
            </Text>
            <TextInput
                {...props}
                editable={editable}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold border ${
                    editable
                        ? 'bg-white border-blue-100 text-[#1E293B]'
                        : 'bg-[#F8FAFC] border-gray-100 text-[#64748B]'
                }`}
            />
        </View>
    );
}
