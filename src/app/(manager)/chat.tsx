import { ManagerHeader } from '@/components/manager-dashboard';
import {
    ManagerChatFilter,
    ManagerChatFilterTabs,
    ManagerConversationCard,
} from '@/components/manager-chat';
import { managerConversations } from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ManagerChatScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<ManagerChatFilter>('all');
    const [, refreshConversations] = useState(0);

    useFocusEffect(
        useCallback(() => {
            refreshConversations((value) => value + 1);
        }, [])
    );

    const counts = {
        all: managerConversations.length,
        direct: managerConversations.filter(
            (conversation) => conversation.type === 'direct'
        ).length,
        group: managerConversations.filter(
            (conversation) => conversation.type === 'group'
        ).length,
    };

    const filteredConversations = managerConversations.filter(
        (conversation) => {
            const matchesFilter =
                activeFilter === 'all' || conversation.type === activeFilter;
            const matchesSearch = conversation.name
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase());
            return matchesFilter && matchesSearch;
        }
    );

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ManagerHeader
                title="Messages"
                subtitle="Chat with managers and resident students"
            />

            <View className="-mt-8 flex-1 px-4">
                <View className="bg-white rounded-2xl p-2 border border-gray-100 flex-row items-center">
                    <View className="flex-1 h-11 rounded-xl bg-[#F8FAFC] px-3 flex-row items-center">
                        <Ionicons
                            name="search-outline"
                            size={19}
                            color="#94A3B8"
                        />
                        <TextInput
                            className="flex-1 ml-2 text-[#1E293B] text-sm"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search conversations..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() =>
                            router.push('/manager-details/chat/create-group')
                        }
                        className="w-11 h-11 rounded-xl bg-blue-600 items-center justify-center ml-2"
                    >
                        <Ionicons
                            name="people-outline"
                            size={21}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <View className="mt-3">
                    <ManagerChatFilterTabs
                        activeFilter={activeFilter}
                        counts={counts}
                        onChange={setActiveFilter}
                    />
                </View>

                <ScrollView
                    className="flex-1 mt-4"
                    contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredConversations.map((conversation) => (
                        <ManagerConversationCard
                            key={conversation.id}
                            conversation={conversation}
                            onPress={() =>
                                router.push({
                                    pathname: '/manager-details/chat/[id]',
                                    params: { id: conversation.id },
                                })
                            }
                        />
                    ))}

                    {filteredConversations.length === 0 && (
                        <View className="bg-white rounded-2xl p-6 border border-gray-100 items-center">
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                                <Ionicons
                                    name="chatbubble-ellipses-outline"
                                    size={23}
                                    color="#2563EB"
                                />
                            </View>
                            <Text className="text-[#1E293B] font-bold mt-3">
                                No conversations found
                            </Text>
                            <Text className="text-[#64748B] text-sm text-center mt-1">
                                Try another search or create a group chat.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
