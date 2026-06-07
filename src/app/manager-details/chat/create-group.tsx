import {
    ManagerChatAvatar,
    ManagerMemberSelectCard,
} from '@/components/manager-chat';
import {
    createMockManagerGroup,
    currentManager,
    managerChatParticipants,
} from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function CreateManagerGroupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const availableParticipants = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        return managerChatParticipants.filter(
            (participant) =>
                participant.id !== currentManager.id &&
                (participant.name.toLowerCase().includes(normalizedSearch) ||
                    participant.detail.toLowerCase().includes(normalizedSearch))
        );
    }, [searchQuery]);

    const selectedParticipants = selectedIds
        .map((id) =>
            managerChatParticipants.find((participant) => participant.id === id)
        )
        .filter((participant) => participant !== undefined);

    const toggleParticipant = (id: string) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((participantId) => participantId !== id)
                : [...current, id]
        );
    };

    const createGroup = () => {
        if (!groupName.trim()) {
            toast.error('Group name is required');
            return;
        }
        if (selectedIds.length < 2) {
            toast.error('Select at least two members');
            return;
        }

        const group = createMockManagerGroup(groupName.trim(), selectedIds);
        toast.success('Group chat created', {
            description: `${selectedIds.length + 1} members`,
        });
        router.replace({
            pathname: '/manager-details/chat/[id]',
            params: { id: group.id },
        });
    };

    return (
        <View
            className="flex-1 bg-[#F4FAFD]"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center"
                >
                    <Ionicons name="chevron-back" size={22} color="#1E293B" />
                </TouchableOpacity>
                <View className="ml-3 flex-1">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        Create Group Chat
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                        Select members from managers and students
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={createGroup}
                    className="bg-blue-600 rounded-xl px-4 py-2.5"
                >
                    <Text className="text-white text-xs font-bold">Create</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: Math.max(insets.bottom, 16),
                    gap: 14,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="bg-white rounded-2xl p-4 border border-gray-100">
                    <Text className="text-[#1E293B] text-sm font-bold mb-2">
                        Group name
                    </Text>
                    <TextInput
                        className="h-12 bg-[#F8FAFC] border border-gray-100 rounded-xl px-3 text-[#1E293B]"
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholder="Example: Block A Support"
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                {selectedParticipants.length > 0 && (
                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-[#1E293B] text-sm font-bold mb-3">
                            Selected members ({selectedParticipants.length})
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 12 }}
                        >
                            {selectedParticipants.map((participant) => (
                                <TouchableOpacity
                                    key={participant.id}
                                    activeOpacity={0.75}
                                    onPress={() =>
                                        toggleParticipant(participant.id)
                                    }
                                    className="items-center w-16"
                                >
                                    <ManagerChatAvatar
                                        participant={participant}
                                        showStatus
                                    />
                                    <Text
                                        className="text-[#64748B] text-[10px] font-bold mt-1.5 text-center"
                                        numberOfLines={1}
                                    >
                                        {participant.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View className="h-12 bg-white rounded-2xl px-3 border border-gray-100 flex-row items-center">
                    <Ionicons name="search-outline" size={19} color="#94A3B8" />
                    <TextInput
                        className="flex-1 ml-2 text-[#1E293B]"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search managers or students..."
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View className="gap-2">
                    {availableParticipants.map((participant) => (
                        <ManagerMemberSelectCard
                            key={participant.id}
                            participant={participant}
                            selected={selectedIds.includes(participant.id)}
                            onPress={() => toggleParticipant(participant.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
