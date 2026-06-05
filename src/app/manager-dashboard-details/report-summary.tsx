import {
    ExportActionButton,
    InfoListRow,
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
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, Text, View } from 'react-native';

const showMockExport = (format: 'PDF' | 'Excel') => {
    Alert.alert(
        `${format} export`,
        `Mock ${format} summary report is ready for preview. File generation will be connected later.`
    );
};

export default function ReportSummaryScreen() {
    const router = useRouter();

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-[#F4FAFD] flex-1">
                <ManagerHeader
                    title="Report Summary"
                    subtitle="Overview report and mock export actions"
                    onBack={() => router.back()}
                />

                <View className="-mt-8 px-4 pb-8">
                    <View className="flex-row flex-wrap justify-between gap-y-3">
                        <MetricTile
                            label="Full rooms"
                            value={`${dashboardSummary.fullRooms}/${dashboardSummary.totalRooms}`}
                            caption="Rooms at full capacity"
                            icon="bed-outline"
                            color="#2365E7"
                            bgColor="#E1EDFD"
                        />
                        <MetricTile
                            label="Students"
                            value={`${dashboardSummary.currentStudents}`}
                            caption={`${roomOverviewStats.totalBeds} total beds`}
                            icon="people-outline"
                            color="#F97316"
                            bgColor="#FFEDD5"
                        />
                    </View>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Summary Highlights"
                            icon="document-text-outline"
                        />
                        {managerReportSummaries.map((summary, index) => (
                            <View
                                key={summary.id}
                                className={`py-3 ${index !== managerReportSummaries.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <View className="flex-row items-center">
                                    <View className="flex-1">
                                        <Text className="text-[#1E293B] text-sm font-bold">
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
                            </View>
                        ))}
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Operational Notes"
                            icon="clipboard-outline"
                        />
                        <InfoListRow
                            title="Room capacity"
                            subtitle="Full rooms compared with all rooms"
                            value={`${dashboardSummary.fullRooms}/${dashboardSummary.totalRooms}`}
                            statusColor="#22C55E"
                        />
                        <InfoListRow
                            title="Issue rating"
                            subtitle="Average rating from resolved issues"
                            value={`${issueAverageRating}/5`}
                            statusColor="#F97316"
                        />
                        <InfoListRow
                            title="Complaint rating"
                            subtitle="Average rating from resolved complaints"
                            value={`${complaintAverageRating}/5`}
                            statusColor="#A855F7"
                            isLast
                        />
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Export Report"
                            icon="download-outline"
                        />
                        <Text className="text-[#64748B] text-sm font-medium mb-4">
                            Export actions are mocked for this version. No file
                            will be generated.
                        </Text>
                        <View className="flex-row gap-3">
                            <ExportActionButton
                                label="PDF"
                                icon="document-outline"
                                onPress={() => showMockExport('PDF')}
                            />
                            <ExportActionButton
                                label="Excel"
                                icon="grid-outline"
                                onPress={() => showMockExport('Excel')}
                            />
                        </View>
                    </SectionCard>
                </View>
            </ScrollView>
        </>
    );
}
