import { ManagerHeader } from '@/components/manager-dashboard';
import { ActivityActorRole, activityLog } from '@/data/activity-log';
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

type ActivityFilter = 'All' | ActivityActorRole;

export default function ManagerActivityLogScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState<ActivityFilter>('All');
    const [, refreshLog] = useState(0);

    useFocusEffect(
        useCallback(() => {
            refreshLog((value) => value + 1);
        }, [])
    );

    const filteredLog = activityLog.filter(
        (item) => filter === 'All' || item.actorRole === filter
    );

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ManagerHeader
                title="Activity Log"
                subtitle="Review manager, student, and system activity"
                onBack={() => router.back()}
            />
            <View className="-mt-8 flex-1 px-4">
                <View className="bg-white rounded-2xl p-1.5 border border-gray-100 shadow-xl flex-row">
                    {(
                        [
                            'All',
                            'Manager',
                            'Student',
                            'System',
                        ] as ActivityFilter[]
                    ).map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => setFilter(option)}
                            className={`flex-1 rounded-xl py-2.5 items-center ${
                                filter === option ? 'bg-blue-600' : 'bg-white'
                            }`}
                        >
                            <Text
                                className={`text-xs font-bold ${
                                    filter === option
                                        ? 'text-white'
                                        : 'text-[#64748B]'
                                }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <ScrollView
                    className="flex-1 mt-4"
                    contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
                >
                    {filteredLog.map((activity) => (
                        <View
                            key={activity.id}
                            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex-row items-start"
                        >
                            <View
                                className="w-11 h-11 rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: `${activity.color}18`,
                                }}
                            >
                                <Ionicons
                                    name={activity.icon}
                                    size={20}
                                    color={activity.color}
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-sm font-bold">
                                    {activity.action}
                                </Text>
                                <Text className="text-[#64748B] text-xs font-medium mt-1">
                                    {activity.detail}
                                </Text>
                                <Text className="text-[#94A3B8] text-[10px] font-bold mt-2">
                                    {activity.time} - {activity.actorName} (
                                    {activity.actorRole})
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
