import {
    ManagerHeader,
    MetricTile,
    ProgressRow,
    RequestStatusSummary,
    SectionTitle,
} from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import {
    complaintAverageRating,
    complaintLocationBreakdown,
    incidentTypeBreakdown,
    issueAverageRating,
    issueLocationBreakdown,
    openComplaints,
    openIssues,
    requestStatusSummary,
} from '@/data/manager-dashboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ExpandableLocationProps {
    label: string;
    total: number;
    floors: {
        label: string;
        count: number;
        total: number;
    }[];
    isLast?: boolean;
    itemLabel: string;
}

function ExpandableLocation({
    label,
    total,
    floors,
    isLast = false,
    itemLabel,
}: ExpandableLocationProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className={!isLast ? 'border-b border-gray-100' : ''}>
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setIsExpanded((value) => !value)}
                className="py-3"
            >
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            {label}
                        </Text>
                        <Text className="text-[#64748B] text-xs font-medium mt-1">
                            {total} open {itemLabel} reported
                        </Text>
                    </View>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#94A3B8"
                    />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="bg-[#F8FAFC] rounded-xl px-3 py-2 mb-3">
                    {floors.map((floor, index) => (
                        <View
                            key={floor.label}
                            className={`flex-row items-center py-2 ${index !== floors.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <Text className="flex-1 text-[#475569] text-sm font-semibold">
                                {floor.label}
                            </Text>
                            <Text className="text-[#1E293B] text-sm font-bold">
                                {floor.count}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

export default function IssueComplaintStatsScreen() {
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
                    title="Issue & Complaint Stats"
                    subtitle="Open room, facility, and complaint signals"
                    onBack={() => router.back()}
                />

                <View className="-mt-8 px-4 pb-8">
                    <View className="flex-row flex-wrap justify-between gap-y-3">
                        <MetricTile
                            label="Open issues"
                            value={`${openIssues.length}`}
                            caption="Electric, water, internet, facility"
                            icon="construct-outline"
                            color="#F97316"
                            bgColor="#FFEDD5"
                        />
                        <MetricTile
                            label="Open complaints"
                            value={`${openComplaints.length}`}
                            caption="Noise, order, security, conduct"
                            icon="chatbox-ellipses-outline"
                            color="#A855F7"
                            bgColor="#F3E8FF"
                        />
                    </View>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Open Request Status"
                            icon="pulse-outline"
                        />
                        <View className="flex-row gap-3">
                            <RequestStatusSummary
                                title="Issues"
                                icon="construct-outline"
                                color="#F97316"
                                backgroundColor="#FFEDD5"
                                pending={requestStatusSummary.issues.pending}
                                inProgress={
                                    requestStatusSummary.issues.inProgress
                                }
                            />
                            <RequestStatusSummary
                                title="Complaints"
                                icon="chatbox-ellipses-outline"
                                color="#A855F7"
                                backgroundColor="#F3E8FF"
                                pending={
                                    requestStatusSummary.complaints.pending
                                }
                                inProgress={
                                    requestStatusSummary.complaints.inProgress
                                }
                            />
                        </View>
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Resolved Ratings"
                            icon="star-outline"
                        />
                        <ProgressRow
                            label="Issue rating"
                            value={`${issueAverageRating}/5`}
                            percent={(issueAverageRating / 5) * 100}
                            color="#F97316"
                        />
                        <ProgressRow
                            label="Complaint rating"
                            value={`${complaintAverageRating}/5`}
                            percent={(complaintAverageRating / 5) * 100}
                            color="#A855F7"
                        />
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Open Issue Types"
                            icon="pricetags-outline"
                        />
                        {incidentTypeBreakdown.map((item) => (
                            <ProgressRow
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                percent={item.percent}
                                color="#F97316"
                            />
                        ))}
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Open Issues by Location"
                            icon="map-outline"
                        />
                        {issueLocationBreakdown.map((location, index) => (
                            <ExpandableLocation
                                key={location.label}
                                label={location.label}
                                total={location.total}
                                floors={location.floors}
                                itemLabel="issues"
                                isLast={
                                    index === issueLocationBreakdown.length - 1
                                }
                            />
                        ))}
                    </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Open Complaints by Location"
                            icon="location-outline"
                        />
                        {complaintLocationBreakdown.map((location, index) => (
                            <ExpandableLocation
                                key={location.label}
                                label={location.label}
                                total={location.total}
                                floors={location.floors}
                                itemLabel="complaints"
                                isLast={
                                    index ===
                                    complaintLocationBreakdown.length - 1
                                }
                            />
                        ))}
                    </SectionCard>
                </View>
            </ScrollView>
        </>
    );
}
