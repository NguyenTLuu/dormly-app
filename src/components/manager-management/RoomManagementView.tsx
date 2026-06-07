import {
    DormRoom,
    RoomTicketSummary,
    managementBlockOptions,
    managementFloorsByBlock,
} from '@/data/manager-management';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import RoomBlockTabs from './RoomBlockTabs';
import RoomCard from './RoomCard';
import RoomFloorSelector from './RoomFloorSelector';

interface RoomManagementViewProps {
    rooms: DormRoom[];
    getRoomTickets: (room: DormRoom) => RoomTicketSummary[];
    onRoomPress: (room: DormRoom) => void;
}

export default function RoomManagementView({
    rooms,
    getRoomTickets,
    onRoomPress,
}: RoomManagementViewProps) {
    const blocks = managementBlockOptions.filter((block) => block !== 'All');
    const [selectedBlock, setSelectedBlock] = useState(blocks[0]);
    const [selectedFloor, setSelectedFloor] = useState('All');
    const floors = managementFloorsByBlock[selectedBlock] || ['All'];

    const filteredRooms = useMemo(
        () =>
            rooms.filter(
                (room) =>
                    room.block === selectedBlock &&
                    (selectedFloor === 'All' || room.floor === selectedFloor)
            ),
        [rooms, selectedBlock, selectedFloor]
    );

    const handleBlockChange = (block: string) => {
        setSelectedBlock(block);
        setSelectedFloor('All');
    };

    return (
        <FlatList
            key={`room-grid-${selectedBlock}-${selectedFloor}`}
            data={filteredRooms}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 28 }}
            ListHeaderComponent={
                <View className="gap-3 pb-2">
                    <RoomBlockTabs
                        blocks={blocks}
                        selectedBlock={selectedBlock}
                        onChange={handleBlockChange}
                    />
                    <RoomFloorSelector
                        floors={floors}
                        selectedFloor={selectedFloor}
                        onChange={setSelectedFloor}
                    />
                    <View className="flex-row items-center justify-between pt-1">
                        <Text className="text-[#1E293B] text-lg font-bold">
                            Room Overview
                        </Text>
                        <Text className="text-[#64748B] text-sm font-bold">
                            {filteredRooms.length} rooms
                        </Text>
                    </View>
                </View>
            }
            renderItem={({ item }) => {
                const tickets = getRoomTickets(item);

                return (
                    <View className="w-[48%]">
                        <RoomCard
                            room={item}
                            ticketTypes={tickets.map((ticket) => ticket.type)}
                            ticketCount={tickets.length}
                            onPress={onRoomPress}
                        />
                    </View>
                );
            }}
            ListEmptyComponent={
                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                    <Text className="text-[#64748B] text-sm font-semibold text-center">
                        No rooms match this floor.
                    </Text>
                </View>
            }
        />
    );
}
