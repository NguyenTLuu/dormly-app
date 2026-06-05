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
    roomOverviewStats,
} from '@/data/manager-dashboard';
import React from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';

export default function Dashboard() {
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
                                caption="Open facility"
                                icon="warning-outline"
                                color="#F97316"
                                bgColor="#FFEDD5"
                            />
                            <MetricTile
                                className="w-[31.5%]"
                                compact
                                label="Complaints"
                                value={`${dashboardSummary.openComplaints}`}
                                caption="Open conduct"
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
                            subtitle="View open issues and complaint signals"
                            icon="construct-outline"
                            accentColor="#F97316"
                            rightText={`${dashboardSummary.openIssues + dashboardSummary.openComplaints}`}
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
