import {
    studentHomeOverview,
    studentHomeStatus,
    studentWeather,
} from '@/data/student-home';
import {
    getLatestStudentNotifications,
    studentNotifications,
} from '@/data/student-notifications';
import { ManagerNotification } from '@/data/manager-dashboard-actions';
import { dormitoryHotline } from '@/data/student-requests';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    Linking,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

const priorityStyles: Record<
    ManagerNotification['priority'],
    { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
    Normal: {
        color: '#2563EB',
        bg: '#DBEAFE',
        icon: 'information-circle',
    },
    Important: { color: '#D97706', bg: '#FEF3C7', icon: 'alert-circle' },
    Emergency: { color: '#DC2626', bg: '#FEE2E2', icon: 'warning' },
};

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [, refreshNotifications] = useState(0);

    useFocusEffect(
        useCallback(() => {
            refreshNotifications((value) => value + 1);
        }, [])
    );

    const latestNotifications = getLatestStudentNotifications(3);
    const callDormitoryHotline = async () => {
        const phoneUrl = `tel:${dormitoryHotline.replace(/\s/g, '')}`;

        try {
            await Linking.openURL(phoneUrl);
        } catch {
            toast.error('Unable to call dormitory hotline', {
                description: dormitoryHotline,
            });
        }
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 28 }}
            >
                <View
                    className="bg-blue-600 rounded-b-[32px] px-5 pb-20"
                    style={{ paddingTop: insets.top + 18 }}
                >
                    <View className="flex-row items-center">
                        <Link href="/profile" asChild>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-12 h-12 rounded-full bg-white/20 items-center justify-center border border-white/30"
                            >
                                <Image
                                    source={require('@/assets/icons/user-icon.png')}
                                    style={{ width: 40, height: 40 }}
                                    contentFit="contain"
                                />
                            </TouchableOpacity>
                        </Link>
                        <View className="ml-3 flex-1">
                            <Text className="text-blue-100 text-sm font-medium">
                                {studentHomeOverview.greeting}
                            </Text>
                            <Text className="text-white text-xl font-bold mt-0.5">
                                {studentHomeOverview.fullName}
                            </Text>
                        </View>
                        <Link href="/notification" asChild>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-11 h-11 rounded-full bg-white/15 items-center justify-center"
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={22}
                                    color="white"
                                />
                                {studentNotifications.length > 0 && (
                                    <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-blue-600" />
                                )}
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <View className="flex-row items-center mt-5">
                        <View className="flex-row items-center bg-white/15 rounded-full px-3 py-1.5">
                            <Ionicons
                                name="id-card-outline"
                                size={14}
                                color="#DBEAFE"
                            />
                            <Text className="text-blue-50 text-xs font-semibold ml-1.5">
                                {studentHomeOverview.studentId}
                            </Text>
                        </View>
                        <View className="flex-row items-center bg-white/15 rounded-full px-3 py-1.5 ml-2">
                            <Ionicons
                                name="school-outline"
                                size={14}
                                color="#DBEAFE"
                            />
                            <Text
                                className="text-blue-50 text-xs font-semibold ml-1.5"
                                numberOfLines={1}
                            >
                                {studentHomeOverview.major}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="-mt-14 px-4">
                    <View className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xl">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center">
                                <Image
                                    source={require('@/assets/icons/door-icon.png')}
                                    style={{ width: 38, height: 38 }}
                                    contentFit="contain"
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[#64748B] text-xs font-semibold uppercase tracking-wide">
                                    Current room
                                </Text>
                                <Text className="text-[#1E293B] text-xl font-bold mt-0.5">
                                    {studentHomeOverview.room.code}
                                </Text>
                                <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                    {studentHomeOverview.room.location}
                                </Text>
                            </View>
                            <Link href="/room" asChild>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center"
                                >
                                    <Ionicons
                                        name="arrow-forward"
                                        size={18}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <View className="h-px bg-slate-100 my-4" />
                        <View className="flex-row">
                            <OverviewMetric
                                icon="people-outline"
                                label="Occupancy"
                                value={`${studentHomeOverview.room.occupancy}/${studentHomeOverview.room.capacity}`}
                            />
                            <OverviewMetric
                                icon="wallet-outline"
                                label="Monthly fee"
                                value={studentHomeOverview.room.monthlyFee}
                                isLast
                            />
                        </View>
                    </View>
                </View>

                <View className="px-4 mt-5">
                    <SectionHeader title="Today at Dormly" />
                    <View className="bg-[#0F3D78] rounded-3xl p-4 overflow-hidden">
                        <View className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-blue-400/20" />
                        <View className="absolute right-16 -bottom-16 w-28 h-28 rounded-full bg-cyan-300/10" />
                        <View className="flex-row items-start">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-2xl bg-white/15 items-center justify-center">
                                    <Ionicons
                                        name={studentWeather.icon}
                                        size={28}
                                        color="#FDE68A"
                                    />
                                </View>
                                <View className="ml-3">
                                    <Text className="text-white text-3xl font-bold">
                                        {studentWeather.temperature}°
                                    </Text>
                                    <Text className="text-blue-100 text-xs font-semibold">
                                        {studentWeather.condition}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-blue-100 text-xs font-semibold">
                                    {studentWeather.location}
                                </Text>
                                <Text className="text-white text-sm font-bold mt-1">
                                    H: {studentWeather.high}° · L:{' '}
                                    {studentWeather.low}°
                                </Text>
                                <Text className="text-blue-200 text-xs mt-1">
                                    Rain {studentWeather.rainChance}%
                                </Text>
                            </View>
                        </View>
                        <View className="bg-white/10 rounded-2xl p-3 mt-4 flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-white/15 items-center justify-center">
                                <Ionicons
                                    name="sparkles-outline"
                                    size={16}
                                    color="#BAE6FD"
                                />
                            </View>
                            <View className="ml-2.5 flex-1">
                                <Text className="text-blue-100 text-[10px] font-bold uppercase tracking-wide">
                                    Activity suggestion
                                </Text>
                                <Text className="text-white text-sm font-semibold mt-0.5">
                                    {studentWeather.activitySuggestion}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-4 mt-6">
                    <SectionHeader title="Quick actions" />
                    <View className="flex-row justify-between">
                        <QuickAction
                            label="Create issue"
                            icon="construct-outline"
                            color="#EA580C"
                            backgroundColor="#FFEDD5"
                            onPress={() =>
                                router.push('/student-request-details/issue')
                            }
                        />
                        <QuickAction
                            label="Complaint"
                            icon="chatbox-ellipses-outline"
                            color="#7C3AED"
                            backgroundColor="#EDE9FE"
                            onPress={() =>
                                router.push(
                                    '/student-request-details/complaint'
                                )
                            }
                        />
                        <QuickAction
                            label="Emergency"
                            icon="call-outline"
                            color="#DC2626"
                            backgroundColor="#FEE2E2"
                            onPress={callDormitoryHotline}
                        />
                        <QuickAction
                            label="Chat bot"
                            icon="robot-outline"
                            color="#2563EB"
                            backgroundColor="#DBEAFE"
                            onPress={() => router.push('/chat/bot')}
                            material
                        />
                    </View>
                </View>

                <View className="px-4 mt-6">
                    <SectionHeader
                        title="Your status"
                        actionLabel="View room"
                        href="/room"
                    />
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <View className="flex-row">
                            <StatusMetric
                                label="Issues"
                                total={studentHomeStatus.issues.total}
                                active={studentHomeStatus.issues.active}
                                color="#EA580C"
                                backgroundColor="#FFEDD5"
                                icon="construct-outline"
                            />
                            <StatusMetric
                                label="Complaints"
                                total={studentHomeStatus.complaints.total}
                                active={studentHomeStatus.complaints.active}
                                color="#7C3AED"
                                backgroundColor="#EDE9FE"
                                icon="chatbox-ellipses-outline"
                                isLast
                            />
                        </View>
                        <View className="h-px bg-slate-100 my-4" />
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                                <Ionicons
                                    name="swap-horizontal"
                                    size={20}
                                    color="#2563EB"
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-sm font-bold">
                                    Room transfer request
                                </Text>
                                <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                    Waiting for manager review
                                </Text>
                            </View>
                            <View className="bg-amber-100 rounded-full px-3 py-1.5">
                                <Text className="text-amber-700 text-[10px] font-bold">
                                    {studentHomeStatus.transferStatus}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-4 mt-6">
                    <SectionHeader
                        title="New notifications"
                        badge={latestNotifications.length}
                        actionLabel="View all"
                        href="/notification"
                    />
                    <View className="bg-white rounded-3xl px-4 border border-slate-100 shadow-xl">
                        {latestNotifications.map((notification, index) => (
                            <NotificationPreview
                                key={notification.id}
                                notification={notification}
                                isLast={
                                    index === latestNotifications.length - 1
                                }
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function SectionHeader({
    title,
    badge,
    actionLabel,
    href,
}: {
    title: string;
    badge?: number;
    actionLabel?: string;
    href?: '/room' | '/notification';
}) {
    return (
        <View className="flex-row items-center mb-3">
            <Text className="text-[#1E293B] text-lg font-bold">{title}</Text>
            {badge !== undefined && (
                <View className="bg-red-500 rounded-full min-w-5 h-5 px-1 items-center justify-center ml-2">
                    <Text className="text-white text-[10px] font-bold">
                        {badge}
                    </Text>
                </View>
            )}
            <View className="flex-1" />
            {actionLabel && href && (
                <Link href={href} asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text className="text-blue-600 text-sm font-bold">
                            {actionLabel}
                        </Text>
                    </TouchableOpacity>
                </Link>
            )}
        </View>
    );
}

function OverviewMetric({
    icon,
    label,
    value,
    isLast = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    isLast?: boolean;
}) {
    return (
        <View
            className={`flex-1 flex-row items-center ${
                isLast ? 'pl-4' : 'border-r border-slate-100 pr-4'
            }`}
        >
            <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center">
                <Ionicons name={icon} size={18} color="#2563EB" />
            </View>
            <View className="ml-2.5">
                <Text className="text-[#94A3B8] text-[10px] font-bold uppercase">
                    {label}
                </Text>
                <Text className="text-[#1E293B] text-sm font-bold mt-0.5">
                    {value}
                </Text>
            </View>
        </View>
    );
}

function QuickAction({
    label,
    icon,
    color,
    backgroundColor,
    onPress,
    material = false,
}: {
    label: string;
    icon:
        | keyof typeof Ionicons.glyphMap
        | keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    backgroundColor: string;
    onPress: () => void;
    material?: boolean;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            className="w-[23%] bg-white rounded-2xl py-3 px-1 items-center border border-slate-100 shadow-xl"
        >
            <View
                className="w-11 h-11 rounded-2xl items-center justify-center"
                style={{ backgroundColor }}
            >
                {material ? (
                    <MaterialCommunityIcons
                        name={
                            icon as keyof typeof MaterialCommunityIcons.glyphMap
                        }
                        size={22}
                        color={color}
                    />
                ) : (
                    <Ionicons
                        name={icon as keyof typeof Ionicons.glyphMap}
                        size={21}
                        color={color}
                    />
                )}
            </View>
            <Text
                className="text-[#475569] text-[10px] font-bold text-center mt-2"
                numberOfLines={2}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function StatusMetric({
    label,
    total,
    active,
    color,
    backgroundColor,
    icon,
    isLast = false,
}: {
    label: string;
    total: number;
    active: number;
    color: string;
    backgroundColor: string;
    icon: keyof typeof Ionicons.glyphMap;
    isLast?: boolean;
}) {
    return (
        <View className={`flex-1 ${isLast ? 'ml-2' : 'mr-2'}`}>
            <View className="flex-row items-center">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor }}
                >
                    <Ionicons name={icon} size={18} color={color} />
                </View>
                <Text className="text-2xl font-bold ml-auto" style={{ color }}>
                    {total}
                </Text>
            </View>
            <Text className="text-[#1E293B] text-sm font-bold mt-3">
                {label}
            </Text>
            <Text className="text-[#64748B] text-xs font-medium mt-1">
                {active} active - {total - active} resolved
            </Text>
            <View className="h-1.5 rounded-full bg-slate-100 mt-3 overflow-hidden">
                <View
                    className="h-full rounded-full"
                    style={{
                        backgroundColor: color,
                        width: `${total > 0 ? (active / total) * 100 : 0}%`,
                    }}
                />
            </View>
        </View>
    );
}

function NotificationPreview({
    notification,
    isLast,
}: {
    notification: ManagerNotification;
    isLast: boolean;
}) {
    const priority = priorityStyles[notification.priority];

    return (
        <Link href="/notification" asChild>
            <TouchableOpacity
                activeOpacity={0.7}
                className={`flex-row items-center py-4 ${
                    isLast ? '' : 'border-b border-slate-100'
                }`}
            >
                <View
                    className="w-11 h-11 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: priority.bg }}
                >
                    <Ionicons
                        name={priority.icon}
                        size={20}
                        color={priority.color}
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text
                        className="text-[#1E293B] text-sm font-bold"
                        numberOfLines={1}
                    >
                        {notification.title}
                    </Text>
                    <Text
                        className="text-[#64748B] text-xs font-medium mt-1"
                        numberOfLines={1}
                    >
                        {notification.message}
                    </Text>
                    <Text className="text-[#94A3B8] text-[10px] font-semibold mt-1.5">
                        {notification.createdAt}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
        </Link>
    );
}
