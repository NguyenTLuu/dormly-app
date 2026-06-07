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
import { Feather } from '@expo/vector-icons';
import SectionCard from '@/components/SectionCard';
import { useFocusEffect, useRouter } from 'expo-router';
import ChatItem, { ChatProps } from '@/components/ChatItem';

export interface ChatMessage {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
    senderName?: string;
    senderInitials?: string;
    senderColor?: string;
}

const CHAT_LIST_BASE: ChatProps[] = [
    {
        id: 'bot',
        name: 'Dorm Assistant Bot',
        lastMessage: 'How can I help you today?',
        time: 'Now',
        unreadCount: 1,
        type: 'bot',
    },
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

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
    '1': [
        {
            id: '1-1',
            text: 'Good morning, please remember to pay the electricity bill by Friday.',
            time: '10:30 AM',
            isMe: false,
            senderName: 'Dormitory Manager',
            senderInitials: 'DM',
            senderColor: '#EA580C',
        },
        {
            id: '1-2',
            text: 'Thanks for reminding me. Can I pay it through the student portal?',
            time: '10:33 AM',
            isMe: true,
        },
        {
            id: '1-3',
            text: 'Yes, please use the payment section in the Dormly app.',
            time: '10:35 AM',
            isMe: false,
            senderName: 'Dormitory Manager',
            senderInitials: 'DM',
            senderColor: '#EA580C',
        },
    ],
    '2': [
        {
            id: '2-1',
            text: 'Who is buying water today?',
            time: '9:15 AM',
            isMe: false,
            senderName: 'Tran Phuoc',
            senderInitials: 'TP',
            senderColor: '#2563EB',
        },
        {
            id: '2-2',
            text: 'I can buy it after my afternoon class.',
            time: '9:17 AM',
            isMe: true,
        },
        {
            id: '2-3',
            text: 'Great. I will transfer my share tonight.',
            time: '9:18 AM',
            isMe: false,
            senderName: 'Le Duc',
            senderInitials: 'LD',
            senderColor: '#16A34A',
        },
        {
            id: '2-4',
            text: 'Please also get trash bags if the store has them.',
            time: '9:20 AM',
            isMe: false,
            senderName: 'Minh Anh',
            senderInitials: 'MA',
            senderColor: '#9333EA',
        },
        {
            id: '2-5',
            text: 'Okay, I will update the receipt here later.',
            time: '9:22 AM',
            isMe: true,
        },
    ],
    '3': [
        {
            id: '3-1',
            text: 'Are you in the room right now?',
            time: 'Yesterday',
            isMe: false,
            senderName: 'Tran Phuoc',
            senderInitials: 'TP',
            senderColor: '#2563EB',
        },
        {
            id: '3-2',
            text: "Yes, I just got back from class. What's up?",
            time: 'Yesterday',
            isMe: true,
        },
        {
            id: '3-3',
            text: 'Can you check if I left my keys on the table?',
            time: 'Yesterday',
            isMe: false,
            senderName: 'Tran Phuoc',
            senderInitials: 'TP',
            senderColor: '#2563EB',
        },
        {
            id: '3-4',
            text: 'Found them. They are next to your laptop.',
            time: 'Yesterday',
            isMe: true,
        },
    ],
    '4': [
        {
            id: '4-1',
            text: 'Can you bring the charger from the study room?',
            time: 'May 15',
            isMe: true,
        },
        {
            id: '4-2',
            text: 'Okay, I will bring it later.',
            time: 'May 15',
            isMe: false,
            senderName: 'Le Duc',
            senderInitials: 'LD',
            senderColor: '#16A34A',
        },
        {
            id: '4-3',
            text: 'Thanks, leave it on my desk if I am not back yet.',
            time: 'May 15',
            isMe: true,
        },
    ],
};

const getChatPreview = (chat: ChatProps): ChatProps => {
    const lastMessage = MOCK_CHAT_MESSAGES[chat.id]?.at(-1);

    if (!lastMessage) return chat;

    const senderPrefix =
        chat.type === 'group'
            ? `${lastMessage.isMe ? 'You' : lastMessage.senderName}: `
            : '';

    return {
        ...chat,
        lastMessage: `${senderPrefix}${lastMessage.text}`,
        time: lastMessage.time,
    };
};

export const MOCK_CHATS: ChatProps[] = CHAT_LIST_BASE.map(getChatPreview);

export const createStudentGroupChat = (name: string, memberNames: string[]) => {
    const id = `student-group-${Date.now()}`;
    MOCK_CHAT_MESSAGES[id] = [];
    MOCK_CHATS.unshift({
        id,
        name,
        lastMessage: `${memberNames.length + 1} members - Start the conversation`,
        time: 'New',
        unreadCount: 0,
        type: 'group',
    });
    return id;
};

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<
        'All' | 'Roommate' | 'Manager' | 'Group' | 'Bot'
    >('All');
    const [, refreshChats] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            refreshChats((value) => value + 1);
        }, [])
    );

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
        if (activeFilter === 'Bot') return matchesSearch && chat.type === 'bot';

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
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => router.push('/chat/create-group')}
                        className="w-12 h-12 rounded-xl bg-blue-600 items-center justify-center ml-1"
                    >
                        <Feather name="users" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Filter */}
                <View className="px-4 mb-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row"
                    >
                        {(
                            [
                                'All',
                                'Roommate',
                                'Manager',
                                'Group',
                                'Bot',
                            ] as const
                        ).map((filter) => {
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
                        })}
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
                                onPress={() => {
                                    if (chat.id === 'bot') {
                                        router.push('/chat/bot');
                                    } else {
                                        router.push(
                                            `/chat/${chat.id}?name=${encodeURIComponent(chat.name)}&type=${chat.type}`
                                        );
                                    }
                                }}
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
