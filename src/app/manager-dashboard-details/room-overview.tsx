import {
    ManagerHeader,
    MetricTile,
    ProgressRow,
    SectionTitle,
} from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import {
    dashboardSummary,
    fullRoomsByBlock,
    roomOverviewStats,
    vacantBedsByBlock,
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

interface ExpandableBlockProps {
    label: string;
    total: number;
    summary: string;
    valueText?: string;
    floors: {
        label: string;
        count: number;
        total: number;
    }[];
    isLast?: boolean;
}

function ExpandableBlock({
    label,
    total,
    summary,
    valueText,
    floors,
    isLast = false,
}: ExpandableBlockProps) {
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
                            {summary}
                        </Text>
                    </View>
                    {valueText && (
                        <Text className="text-[#2566E2] text-sm font-bold mr-2">
                            {valueText}
                        </Text>
                    )}
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
                                {floor.count}/{floor.total}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

export default function RoomOverviewScreen() {
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
                    title="Full Rooms"
                    subtitle="Rooms at full bed capacity by block and floor"
                    onBack={() => router.back()}
                />

                <View className="-mt-8 px-4 pb-8">
                    <View className="flex-row flex-wrap justify-between gap-y-3">
                        <MetricTile
                            label="Full rooms"
                            value={`${dashboardSummary.fullRooms}/${dashboardSummary.totalRooms}`}
                            caption="Current full room ratio"
                            icon="bed-outline"
                            color="#2365E7"
                            bgColor="#E1EDFD"
                        />
                        <MetricTile
                            label="Students"
                            value={`${dashboardSummary.currentStudents}`}
                            caption="Residents in dorm"
                            icon="people-outline"
                            color="#22C55E"
                            bgColor="#E8F5E9"
                        />
                    </View>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Full Rooms by Block"
                            icon="business-outline"
                        />
                        <ProgressRow
                            label="Overall full rooms"
                            value={`${roomOverviewStats.fullRooms}/${roomOverviewStats.totalRooms}`}
                            percent={
                                (roomOverviewStats.fullRooms /
                                    roomOverviewStats.totalRooms) *
                                100
                            }
                            color="#2365E7"
                        />
                        {fullRoomsByBlock.map((block, index) => (
                            <ExpandableBlock
                                key={block.label}
                        label={block.label}
                        total={block.total}
                        summary={`${block.floors.reduce((sum, floor) => sum + floor.count, 0)}/${block.total} rooms are full`}
                        valueText={`${block.total > 0 ? Math.round((block.floors.reduce((sum, floor) => sum + floor.count, 0) / block.total) * 100) : 0}%`}
                        floors={block.floors}
                        isLast={index === fullRoomsByBlock.length - 1}
                    />
                ))}
            </SectionCard>

                    <SectionCard className="mt-4">
                        <SectionTitle
                            title="Vacant Beds by Block"
                            icon="layers-outline"
                        />
                        <ProgressRow
                            label="Overall vacant beds"
                            value={`${roomOverviewStats.totalBeds - roomOverviewStats.occupiedBeds}/${roomOverviewStats.totalBeds}`}
                            percent={
                                ((roomOverviewStats.totalBeds -
                                    roomOverviewStats.occupiedBeds) /
                                    roomOverviewStats.totalBeds) *
                                100
                            }
                            color="#22C55E"
                        />
                        {vacantBedsByBlock.map((block, index) => (
                            <ExpandableBlock
                                key={block.label}
                                label={block.label}
                                total={block.total}
                                summary={`${block.total} vacant beds`}
                                valueText={`${block.total}`}
                                floors={block.floors}
                                isLast={index === vacantBedsByBlock.length - 1}
                            />
                        ))}
                    </SectionCard>
                </View>
            </ScrollView>
        </>
    );
}
