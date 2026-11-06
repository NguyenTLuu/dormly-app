import { getAdminDashboard } from '@/api/adminApi';
import { AdminHeader } from '@/components/admin';
import MetricTile from '@/components/manager-dashboard/MetricTile';
import { Href, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const quickActions = [
    {
        label: 'Users',
        subtitle: 'Manage users',
        icon: 'people-outline' as const,
        href: '/(admin-console)/users',
    },
    {
        label: 'Tickets',
        subtitle: 'View & manage',
        icon: 'ticket-outline' as const,
        href: '/(admin-console)/tickets',
    },
    {
        label: 'Invoices',
        subtitle: 'View & manage',
        icon: 'receipt-outline' as const,
        href: '/(admin-console)/invoices',
    },
    {
        label: 'Announcements',
        subtitle: 'Create & manage',
        icon: 'megaphone-outline' as const,
        href: '/(admin-console)/announcements',
    },
];

export default function AdminDashboardScreen() {
    const router = useRouter();
    const dashboard = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: getAdminDashboard,
    });

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                title="Admin Overview"
                subtitle="Dormitory admin operations at a glance"
                rightAction={
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() =>
                                router.push('/(admin-console)/announcements' as Href)
                            }
                            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel="Open notices"
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color="white"
                            />
                            <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-400 items-center justify-center">
                                <Text className="text-white text-[10px] font-bold">
                                    3
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={dashboard.isRefetching}
                        onRefresh={() => void dashboard.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                {dashboard.isLoading ? (
                    <View className="bg-white rounded-2xl p-8 items-center">
                        <ActivityIndicator color="#2563EB" />
                        <Text className="text-slate-500 text-sm mt-3">
                            Loading system data...
                        </Text>
                    </View>
                ) : dashboard.isError ? (
                    <ErrorCard />
                ) : dashboard.data ? (
                    <>
                        <View className="flex-row justify-between gap-3">
                            <MetricTile
                                className="flex-1"
                                label="Total users"
                                value={dashboard.data.users.toLocaleString()}
                                caption={`${dashboard.data.activeUsers.toLocaleString()} active accounts`}
                                icon="people-outline"
                                color="#2563EB"
                                bgColor="#E8F1FF"
                            />
                            <MetricTile
                                className="flex-1"
                                label="Active accounts"
                                value={dashboard.data.activeUsers.toLocaleString()}
                                caption="Currently enabled"
                                icon="person-outline"
                                color="#2563EB"
                                bgColor="#E8F1FF"
                            />
                        </View>
                        <View className="flex-row justify-between gap-2 mt-3">
                            <MetricTile
                                className="flex-1"
                                compact
                                label="Tickets"
                                value={String(dashboard.data.openTickets)}
                                caption="Open + active"
                                icon="ticket-outline"
                                color="#2563EB"
                                bgColor="#E8F1FF"
                            />
                            <MetricTile
                                className="flex-1"
                                compact
                                label="Invoices"
                                value={String(dashboard.data.invoices)}
                                caption="Total"
                                icon="receipt-outline"
                                color="#16A34A"
                                bgColor="#EAF8EE"
                            />
                            <MetricTile
                                className="flex-1"
                                compact
                                label="Unpaid"
                                value={String(dashboard.data.unpaidInvoices)}
                                caption="Needs action"
                                icon="wallet-outline"
                                color="#EA580C"
                                bgColor="#FFF1E5"
                            />
                            <MetricTile
                                className="flex-1"
                                compact
                                label="Notices"
                                value={String(dashboard.data.announcements)}
                                caption="Published"
                                icon="megaphone-outline"
                                color="#7C3AED"
                                bgColor="#F1EAFE"
                            />
                        </View>
                        <Text className="text-[#1E293B] text-lg font-bold mt-6 mb-3">
                            Quick Actions
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-3">
                            {quickActions.map((action) => (
                                <TouchableOpacity
                                    key={action.label}
                                    onPress={() =>
                                        router.push(action.href as Href)
                                    }
                                    className="w-[48.5%] bg-white rounded-2xl border border-slate-100 p-4 items-center"
                                >
                                    <View className="w-12 h-12 rounded-full bg-[#E8F1FF] items-center justify-center">
                                        <Ionicons
                                            name={action.icon}
                                            size={25}
                                            color="#2563EB"
                                        />
                                    </View>
                                    <Text className="text-[#1E293B] font-bold mt-3">
                                        {action.label}
                                    </Text>
                                    <Text className="text-[#64748B] text-xs mt-1">
                                        {action.subtitle}
                                    </Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color="#2563EB"
                                        style={{ marginTop: 8 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text className="text-[#1E293B] text-lg font-bold mt-6">
                            System States
                        </Text>
                        <Text className="text-[#64748B] text-sm mt-1 mb-3">
                            Current connection and operational status
                        </Text>
                        <View className="bg-white rounded-2xl border border-slate-100 p-4 flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={24}
                                    color="#16A34A"
                                />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-[#1E293B] font-bold">
                                    Backend connected
                                </Text>
                                <Text className="text-[#64748B] text-xs mt-1">
                                    Live administrative data is available.
                                </Text>
                            </View>
                            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </View>
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}

function ErrorCard() {
    return (
        <View className="bg-red-50 border border-red-200 rounded-2xl p-5 flex-row items-center">
            <Ionicons name="warning-outline" size={28} color="#DC2626" />
            <View className="flex-1 ml-3">
                <Text className="text-red-700 font-bold">
                    Unable to load system data
                </Text>
                <Text className="text-red-600 text-xs mt-1 leading-4">
                    Check your connection and try again.
                </Text>
            </View>
        </View>
    );
}
