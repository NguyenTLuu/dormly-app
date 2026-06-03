import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import SectionCard from '@/components/SectionCard';
import { useRouter } from 'expo-router';

type ChatType = 'manager' | 'group' | 'roommate';

interface ChatProps {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    type: ChatType;
    initials?: string;
}

const MOCK_CHATS: ChatProps[] = [
    {
        id: '1',
        name: 'Dormitory Manager',
        lastMessage: 'Please remember to pay the electricity bill by Friday.',
        time: '10:30 AM',
        unreadCount: 2,
        type: 'manager',
    },
    {
        id: '2',
        name: 'Room A365 Group',
        lastMessage: 'Tran Phuoc: Who is buying water today?',
        time: '9:15 AM',
        unreadCount: 0,
        type: 'group',
    },
    {
        id: '3',
        name: 'Tran Phuoc',
        lastMessage: 'Are you in the room right now?',
        time: 'Yesterday',
        unreadCount: 1,
        type: 'roommate',
        initials: 'TP',
    },
    {
        id: '4',
        name: 'Le Duc',
        lastMessage: 'Okay, I will bring it later.',
        time: 'May 15',
        unreadCount: 0,
        type: 'roommate',
        initials: 'LD',
    },
];

const ChatItem = ({
    data,
    isLast,
    onPress,
}: {
    data: ChatProps;
    isLast: boolean;
    onPress: () => void;
}) => {
    const renderAvatar = () => {
        if (data.type === 'manager') {
            return (
                <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center">
                    <MaterialCommunityIcons
                        name="shield-account"
                        size={24}
                        color="#EA580C"
                    />
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                </View>
            );
        } else if (data.type === 'group') {
            return (
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <MaterialCommunityIcons
                        name="account-group"
                        size={24}
                        color="#2563EB"
                    />
                </View>
            );
        } else {
            return (
                <View className="w-12 h-12 rounded-full bg-[#EFF6FF] items-center justify-center">
                    <Text className="text-blue-600 font-bold text-[16px]">
                        {data.initials}
                    </Text>
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full" />
                </View>
            );
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            {renderAvatar()}
            <View className="flex-1 ml-3 justify-center">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[16px] font-bold text-[#1E293B]">
                        {data.name}
                    </Text>
                    <Text
                        className={`text-[12px] font-medium ${data.unreadCount > 0 ? 'text-blue-600' : 'text-[#94A3B8]'}`}
                    >
                        {data.time}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text
                        className={`text-[14px] flex-1 mr-4 ${data.unreadCount > 0 ? 'text-[#1E293B] font-semibold' : 'text-[#64748B]'}`}
                        numberOfLines={1}
                    >
                        {data.lastMessage}
                    </Text>
                    {data.unreadCount > 0 && (
                        <View className="w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">
                                {data.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<
        'All' | 'Roommate' | 'Manager' | 'Group'
    >('All');

    const filteredChats = MOCK_CHATS.filter((chat) => {
        const matchesSearch = chat.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        if (activeFilter === 'All') return matchesSearch;
        if (activeFilter === 'Roommate')
            return matchesSearch && chat.type === 'roommate';
        if (activeFilter === 'Manager')
            return matchesSearch && chat.type === 'manager';
        if (activeFilter === 'Group')
            return matchesSearch && chat.type === 'group';

        return matchesSearch;
    });

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View className="flex-1 bg-[#F5F7FA]">
                <View
                    className="bg-blue-600 rounded-b-2xl px-8"
                    style={{ paddingTop: insets.top + 16, paddingBottom: 50 }}
                >
                    <Text className="text-white text-2xl font-bold">
                        Messages
                    </Text>
                    <Text className="text-white">Chat with your roommates</Text>
                </View>

                {/* Search Bar */}
                <View className="mx-4 -mt-8 bg-white rounded-2xl shadow-sm p-1 flex-row items-center relative z-20 mb-3">
                    <View className="flex-row items-center flex-1 bg-[#F8FAFC] rounded-xl px-3 h-12">
                        <Feather name="search" size={20} color="#94A3B8" />
                        <TextInput
                            className="flex-1 ml-2 text-[15px] text-[#1E293B]"
                            placeholder="Search name..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Filter */}
                <View className="px-4 mb-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row"
                    >
                        {(['All', 'Roommate', 'Manager', 'Group'] as const).map(
                            (filter) => {
                                const isActive = activeFilter === filter;
                                return (
                                    <TouchableOpacity
                                        key={filter}
                                        onPress={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 mr-2 rounded-full border ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                                    >
                                        <Text
                                            className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}
                                        >
                                            {filter}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        )}
                    </ScrollView>
                </View>

                <ScrollView
                    className="flex-1 px-4"
                    showsVerticalScrollIndicator={false}
                >
                    <SectionCard className="p-0 px-4 mb-6">
                        {filteredChats.map((chat, index) => (
                            <ChatItem
                                key={chat.id}
                                data={chat}
                                isLast={index === filteredChats.length - 1}
                                onPress={() =>
                                    router.push(
                                        `/chat/${chat.id}?name=${encodeURIComponent(chat.name)}`
                                    )
                                }
                            />
                        ))}
                        {filteredChats.length === 0 && (
                            <View className="py-8 items-center">
                                <Text className="text-gray-400">
                                    No conversations found.
                                </Text>
                            </View>
                        )}
                    </SectionCard>
                </ScrollView>
            </View>
        </>
    );
}
