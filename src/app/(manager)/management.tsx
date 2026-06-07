import { ManagerHeader } from '@/components/manager-dashboard';
import {
    ManagementTopTabs,
    RoomManagementView,
    StudentManagementView,
} from '@/components/manager-management';
import {
    DormRoom,
    ManagementTab,
    dormRooms,
    dormStudents,
} from '@/data/manager-management';
import { getMockRoomTickets } from '@/utils/manager-room-tickets';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';

export default function Management() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ManagementTab>('rooms');

    const openRoom = (room: DormRoom) => {
        router.push({
            pathname: '/manager-details/room/[code]',
            params: { code: room.code },
        });
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ManagerHeader
                title="Manage"
                subtitle="Manage rooms and resident students"
            />

            <View className="-mt-8 flex-1 px-4">
                <ManagementTopTabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
                <View className="flex-1 pt-4">
                    {activeTab === 'rooms' ? (
                        <RoomManagementView
                            rooms={dormRooms}
                            getRoomTickets={getMockRoomTickets}
                            onRoomPress={openRoom}
                        />
                    ) : (
                        <StudentManagementView
                            students={dormStudents}
                            onStudentPress={(student) =>
                                router.push({
                                    pathname: '/manager-details/student/[id]',
                                    params: { id: student.id },
                                })
                            }
                        />
                    )}
                </View>
            </View>
        </View>
    );
}
