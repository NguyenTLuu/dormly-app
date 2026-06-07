import { ManagerHeader } from '@/components/manager-dashboard';
import { addActivityLog } from '@/data/activity-log';
import { ManagerProfile, managerProfile } from '@/data/manager-settings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function ManagerSettingScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<ManagerProfile>({
        ...managerProfile,
    });
    const [profileDraft, setProfileDraft] = useState(profile);
    const [editingProfile, setEditingProfile] = useState(false);

    const saveProfile = () => {
        if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
            toast.error('Name and email are required');
            return;
        }
        setProfile({ ...profileDraft });
        setEditingProfile(false);
        addActivityLog({
            action: 'Updated manager profile',
            detail: `Updated profile information for ${profileDraft.name}.`,
            actorName: profileDraft.name,
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'person-outline',
            color: '#DB2777',
        });
        toast.success('Manager profile updated');
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ManagerHeader
                    title="Settings"
                    subtitle="Manage account, chatbot knowledge, and activity"
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <SettingTitle
                            title="Manager Profile"
                            icon="person-outline"
                            color="#2563EB"
                            actionLabel={editingProfile ? 'Cancel' : 'Edit'}
                            onAction={() => {
                                setProfileDraft(profile);
                                setEditingProfile((value) => !value);
                            }}
                        />
                        <View className="flex-row items-center mb-4">
                            <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center">
                                <Text className="text-[#2563EB] text-xl font-bold">
                                    {profile.name
                                        .split(' ')
                                        .slice(-2)
                                        .map((part) => part[0])
                                        .join('')}
                                </Text>
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-lg font-bold">
                                    {profile.name}
                                </Text>
                                <Text className="text-[#64748B] text-xs font-semibold mt-1">
                                    {profile.employeeId} - {profile.role}
                                </Text>
                            </View>
                        </View>
                        <View className="gap-3">
                            <ProfileField
                                label="Full name"
                                value={
                                    editingProfile
                                        ? profileDraft.name
                                        : profile.name
                                }
                                editable={editingProfile}
                                onChangeText={(name) =>
                                    setProfileDraft((current) => ({
                                        ...current,
                                        name,
                                    }))
                                }
                            />
                            <ProfileField
                                label="Email"
                                value={
                                    editingProfile
                                        ? profileDraft.email
                                        : profile.email
                                }
                                editable={editingProfile}
                                onChangeText={(email) =>
                                    setProfileDraft((current) => ({
                                        ...current,
                                        email,
                                    }))
                                }
                            />
                            <ProfileField
                                label="Phone"
                                value={
                                    editingProfile
                                        ? profileDraft.phone
                                        : profile.phone
                                }
                                editable={editingProfile}
                                onChangeText={(phone) =>
                                    setProfileDraft((current) => ({
                                        ...current,
                                        phone,
                                    }))
                                }
                            />
                            <ProfileField
                                label="Assigned area"
                                value={
                                    editingProfile
                                        ? profileDraft.assignedArea
                                        : profile.assignedArea
                                }
                                editable={editingProfile}
                                onChangeText={(assignedArea) =>
                                    setProfileDraft((current) => ({
                                        ...current,
                                        assignedArea,
                                    }))
                                }
                            />
                        </View>
                        {editingProfile && (
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={saveProfile}
                                className="bg-blue-600 rounded-xl py-3 items-center mt-4"
                            >
                                <Text className="text-white text-sm font-bold">
                                    Save Profile
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
                        <SettingTitle
                            title="System Settings"
                            icon="options-outline"
                            color="#7C3AED"
                        />
                        <SettingsLink
                            title="Chatbot FAQ"
                            subtitle="Create and update chatbot questions"
                            icon="chatbubble-ellipses-outline"
                            color="#7C3AED"
                            onPress={() =>
                                router.push('/manager-settings-details/faq')
                            }
                        />
                        <SettingsLink
                            title="Activity Log"
                            subtitle="Review manager, student, and system activity"
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
                        onPress={() => router.replace('/(auth)/login')}
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
