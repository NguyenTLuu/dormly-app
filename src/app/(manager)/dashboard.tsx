import {
    DetailLinkCard,
    ManagerHeader,
    MetricTile,
    SectionTitle,
} from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import {
    complaintAverageRating,
    dashboardSummary,
    issueAverageRating,
    managerReportSummaries,
    requestStatusSummary,
    roomOverviewStats,
} from '@/data/manager-dashboard';
import { dashboardActionSummary } from '@/data/manager-dashboard-actions';
import { managerUnreadNotificationCount } from '@/data/manager-app-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Dashboard() {
    const router = useRouter();
    const [, refreshNotifications] = useState(0);

    useFocusEffect(
        useCallback(() => {
            refreshNotifications((value) => value + 1);
        }, [])
    );

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-[#F4FAFD] flex-1">
                <ManagerHeader
                    title="Dashboard"
                    subtitle="Dormitory overview and operational signals"
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
                            <View className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 items-center justify-center">
                                <Text className="text-white text-[8px] font-bold">
                                    {managerUnreadNotificationCount()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />

                <View className="-mt-8 px-4 pb-8">
                    <View className="gap-3">
                        <View className="flex-row justify-between">
                            <MetricTile
                                className="w-[48%]"
                                label="Full rooms"
                                value={`${dashboardSummary.fullRooms}/${dashboardSummary.totalRooms}`}
                                caption="Rooms at full bed capacity"
                                icon="bed-outline"
                                color="#2365E7"
                                bgColor="#E1EDFD"
                            />
                            <MetricTile
                                className="w-[48%]"
                                label="Resident students"
                                value={`${dashboardSummary.currentStudents}`}
                                caption="Currently staying in dorm"
                                icon="people-outline"
                                color="#22C55E"
                                bgColor="#E8F5E9"
                            />
                        </View>
                        <View className="flex-row justify-between">
                            <MetricTile
                                className="w-[31.5%]"
                                compact
                                label="Issues"
                                value={`${dashboardSummary.openIssues}`}
                                caption={`${requestStatusSummary.issues.pending} pending / ${requestStatusSummary.issues.inProgress} active`}
                                icon="warning-outline"
                                color="#F97316"
                                bgColor="#FFEDD5"
                            />
                            <MetricTile
                                className="w-[31.5%]"
                                compact
                                label="Complaints"
                                value={`${dashboardSummary.openComplaints}`}
                                caption={`${requestStatusSummary.complaints.pending} pending / ${requestStatusSummary.complaints.inProgress} active`}
                                icon="chatbox-ellipses-outline"
                                color="#A855F7"
                                bgColor="#F3E8FF"
                            />
                            <MetricTile
                                className="w-[31.5%]"
                                compact
                                label="Transfers"
                                value={`${dashboardSummary.transferRequests}`}
                                caption="Room changes"
                                icon="swap-horizontal-outline"
                                color="#0EA5E9"
                                bgColor="#E0F2FE"
                            />
                        </View>
                    </View>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Resolved Ratings"
                            icon="star-outline"
                        />
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-[#FFEDD5] rounded-xl p-3">
                                <Text className="text-[#F97316] text-xs font-bold">
                                    Issue rating
                                </Text>
                                <Text className="text-[#1E293B] text-2xl font-bold mt-1">
                                    {issueAverageRating}/5
                                </Text>
                                <Text className="text-[#64748B] text-xs font-medium mt-1">
                                    Resolved issues
                                </Text>
                            </View>
                            <View className="flex-1 bg-[#F3E8FF] rounded-xl p-3">
                                <Text className="text-[#A855F7] text-xs font-bold">
                                    Complaint rating
                                </Text>
                                <Text className="text-[#1E293B] text-2xl font-bold mt-1">
                                    {complaintAverageRating}/5
                                </Text>
                                <Text className="text-[#64748B] text-xs font-medium mt-1">
                                    Resolved complaints
                                </Text>
                            </View>
                        </View>
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Dashboard Details"
                            icon="grid-outline"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/room-overview"
                            title="Full room breakdown"
                            subtitle="View full rooms by block and expand floors"
                            icon="business-outline"
                            accentColor="#2365E7"
                            rightText={`${dashboardSummary.fullRooms}/${roomOverviewStats.totalRooms}`}
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/issue-complaint-stats"
                            title="Issue and complaint stats"
                            subtitle="Pending, in progress, type, and location"
                            icon="construct-outline"
                            accentColor="#F97316"
                            rightText={`${requestStatusSummary.issues.pending + requestStatusSummary.complaints.pending} pending`}
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/report-summary"
                            title="Summary report"
                            subtitle="Mock PDF and Excel export actions"
                            icon="document-text-outline"
                            accentColor="#22C55E"
                            rightText="Export"
                        />
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Administration"
                            icon="shield-checkmark-outline"
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/notifications"
                            title="Notifications"
                            subtitle="Create and manage resident announcements"
                            icon="notifications-outline"
                            accentColor="#0EA5E9"
                            rightText={`${dashboardActionSummary.draftNotifications + dashboardActionSummary.scheduledNotifications} active`}
                        />
                        <DetailLinkCard
                            href="/manager-dashboard-details/account-requests"
                            title="New account requests"
                            subtitle="Approve or reject pending registrations"
                            icon="person-add-outline"
                            accentColor="#7C3AED"
                            rightText={`${dashboardActionSummary.pendingAccounts} pending`}
                        />
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Report Summary"
                            icon="bar-chart-outline"
                        />
                        {managerReportSummaries.map((summary, index) => (
                            <View
                                key={summary.id}
                                className={`flex-row py-3 ${index !== managerReportSummaries.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <View className="flex-1">
                                    <Text className="text-[#1E293B] font-bold">
                                        {summary.title}
                                    </Text>
                                    <Text className="text-[#64748B] text-xs font-medium mt-1">
                                        {summary.description}
                                    </Text>
                                </View>
                                <Text className="text-[#2365E7] font-bold ml-3">
                                    {summary.value}
                                </Text>
                            </View>
                        ))}
                    </SectionCard>
                </View>
            </ScrollView>
        </>
    );
}
