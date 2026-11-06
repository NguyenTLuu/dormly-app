import {
    getManagerTickets,
    getManagerTransfers,
} from '@/api/managerRequestsApi';
import {
    DetailLinkCard,
    ManagerHeader,
    MetricTile,
    SectionTitle,
} from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import { useAppNotifications } from '@/contexts/AppNotificationsContext';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Dashboard() {
    const router = useRouter();
    const inbox = useAppNotifications();
    const tickets = useQuery({
        queryKey: ['manager-tickets'],
        queryFn: getManagerTickets,
    });
    const transfers = useQuery({
        queryKey: ['manager-transfers'],
        queryFn: getManagerTransfers,
    });
    const summary = useMemo(() => {
        const ticketItems = tickets.data ?? [];
        const transferItems = transfers.data ?? [];
        return {
            openTickets: ticketItems.filter(
                (item) =>
                    item.status === 'OPEN' || item.status === 'IN_PROGRESS'
            ).length,
            pendingTickets: ticketItems.filter((item) => item.status === 'OPEN')
                .length,
            activeTickets: ticketItems.filter(
                (item) => item.status === 'IN_PROGRESS'
            ).length,
            pendingTransfers: transferItems.filter(
                (item) => item.status === 'PENDING'
            ).length,
            approvedTransfers: transferItems.filter(
                (item) => item.status === 'APPROVED'
            ).length,
        };
    }, [tickets.data, transfers.data]);
    const loading = tickets.isLoading || transfers.isLoading;
    const error = tickets.isError || transfers.isError;

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView
                className="bg-[#F4FAFD] flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={
                            tickets.isRefetching || transfers.isRefetching
                        }
                        onRefresh={() => {
                            void tickets.refetch();
                            void transfers.refetch();
                        }}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <ManagerHeader
                    title="Admin Dashboard"
                    subtitle="Ticket and room-transfer operations"
                    rightAction={
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() =>
                                router.push(
                                    '/manager-dashboard-details/notification-inbox'
                                )
                            }
                            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center ml-3"
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={22}
                                color="white"
                            />
                            {inbox.unread > 0 ? <View className="absolute top-1 right-1 rounded-full bg-red-500 px-1"><Text className="text-white text-[9px]">{inbox.unread}</Text></View> : null}
                        </TouchableOpacity>
                    }
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    {loading ? (
                        <View className="bg-white rounded-2xl p-8 items-center">
                            <ActivityIndicator color="#2563EB" />
                            <Text className="text-slate-500 text-sm mt-3">
                                Loading operational data...
                            </Text>
                        </View>
                    ) : null}
                    {error ? (
                        <View className="bg-red-50 border border-red-100 rounded-2xl p-4">
                            <Text className="text-red-700 font-semibold">
                                Could not load tickets or transfer requests.
                                Ticket APIs require an ADMIN or STAFF backend
                                role.
                            </Text>
                        </View>
                    ) : null}
                    {!loading && !error ? (
                        <>
                            <View className="flex-row gap-3">
                                <MetricTile
                                    className="flex-1"
                                    label="Open tickets"
                                    value={String(summary.openTickets)}
                                    caption={`${summary.pendingTickets} pending · ${summary.activeTickets} in progress`}
                                    icon="ticket-outline"
                                    color="#F97316"
                                    bgColor="#FFEDD5"
                                />
                                <MetricTile
                                    className="flex-1"
                                    label="Pending transfers"
                                    value={String(summary.pendingTransfers)}
                                    caption={`${summary.approvedTransfers} approved`}
                                    icon="swap-horizontal-outline"
                                    color="#2563EB"
                                    bgColor="#DBEAFE"
                                />
                            </View>
                            <SectionCard>
                                <SectionTitle
                                    title="Requests"
                                    icon="clipboard-outline"
                                />
                                <DetailLinkCard
                                    href="/(admin)/requests"
                                    title="Tickets"
                                    subtitle="Maintenance, facilities, roommates, security, billing, and other requests"
                                    icon="ticket-outline"
                                    accentColor="#F97316"
                                    rightText={`${summary.openTickets} open`}
                                />
                                <DetailLinkCard
                                    href="/(admin)/requests"
                                    title="Room transfers"
                                    subtitle="Review pending requests and approved moves"
                                    icon="swap-horizontal-outline"
                                    accentColor="#2563EB"
                                    rightText={`${summary.pendingTransfers} pending`}
                                />
                            </SectionCard>
                        </>
                    ) : null}
                    <SectionCard>
                        <SectionTitle
                            title="Statistics"
                            icon="bar-chart-outline"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/report-summary"
                            title="Report summary"
                            subtitle="Live occupancy, requests and monthly ticket volume"
                            icon="pie-chart-outline"
                            accentColor="#2563EB"
                            rightText="Open"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/room-overview"
                            title="Room statistics"
                            subtitle="Beds and full rooms by building and floor"
                            icon="bed-outline"
                            accentColor="#0F766E"
                            rightText="Open"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/issue-complaint-stats"
                            title="Ticket statistics"
                            subtitle="Status, category and monthly activity"
                            icon="ticket-outline"
                            accentColor="#F97316"
                            rightText="Open"
                        />
                    </SectionCard>
                    <SectionCard>
                        <SectionTitle title="Billing" icon="receipt-outline" />
                        <DetailLinkCard
                            href="/admin-details/invoices"
                            title="Invoices"
                            subtitle="View resident invoices, generate bills, and record payments"
                            icon="receipt-outline"
                            accentColor="#0F766E"
                            rightText="Open"
                        />
                    </SectionCard>
                    <SectionCard>
                        <SectionTitle
                            title="Administration"
                            icon="shield-checkmark-outline"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/notifications"
                            title="Notifications"
                            subtitle="Publish and manage resident announcements"
                            icon="notifications-outline"
                            accentColor="#0EA5E9"
                            rightText="Open"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/account-requests"
                            title="Account activation"
                            subtitle="Review and activate inactive residents"
                            icon="person-add-outline"
                            accentColor="#7C3AED"
                            rightText="Review"
                        />
                    </SectionCard>
                </View>
            </ScrollView>
        </>
    );
}
