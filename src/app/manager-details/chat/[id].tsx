import { ManagerChatAvatar } from '@/components/manager-chat';
import {
    ManagerChatMessage,
    currentManager,
    getManagerChatParticipant,
    getManagerConversation,
} from '@/data/manager-chat';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function ManagerConversationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const conversation = getManagerConversation(id);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ManagerChatMessage[]>(
        conversation?.messages ?? []
    );
    const scrollRef = useRef<ScrollView>(null);
    const keyboardHeight = useRef(new Animated.Value(insets.bottom)).current;

    const scrollToBottom = (animated = true) => {
        scrollRef.current?.scrollToEnd({ animated });
    };

    useEffect(() => {
        setMessages(conversation?.messages ?? []);
    }, [conversation]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                const offset = Platform.OS === 'android' ? 10 : 0;

                Animated.timing(keyboardHeight, {
                    toValue: event.endCoordinates.height + offset,
                    duration: Platform.OS === 'ios' ? event.duration : 150,
                    useNativeDriver: false,
                }).start(() => scrollToBottom(true));
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            (event) => {
                Animated.timing(keyboardHeight, {
                    toValue: insets.bottom,
                    duration: Platform.OS === 'ios' ? event.duration : 150,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [insets.bottom, keyboardHeight]);

    if (!conversation) {
        return (
            <View className="flex-1 bg-[#F4FAFD] items-center justify-center">
                <Text className="text-[#64748B] font-bold">
                    Conversation not found.
                </Text>
            </View>
        );
    }

    const otherParticipant = getManagerChatParticipant(
        conversation.participantIds.find((participantId) => {
            return participantId !== currentManager.id;
        }) ?? ''
    );
    const isGroup = conversation.type === 'group';

    const sendMessage = () => {
        const text = message.trim();
        if (!text) return;

        const newMessage: ManagerChatMessage = {
            id: `message-${Date.now()}`,
            senderId: currentManager.id,
            text,
            time: 'Just now',
        };
        conversation.messages.push(newMessage);
        setMessages([...conversation.messages]);
        setMessage('');
        setTimeout(() => scrollToBottom(true), 50);
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View
                className="bg-white border-b border-gray-100 px-4 pb-3 flex-row items-center"
                style={{ paddingTop: insets.top + 10 }}
            >
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center mr-3"
                >
                    <Ionicons name="chevron-back" size={22} color="#1E293B" />
                </TouchableOpacity>
                <ManagerChatAvatar
                    participant={otherParticipant}
                    type={conversation.type}
                    showStatus={!isGroup}
                />
                <View className="ml-3 flex-1">
                    <Text
                        className="text-[#1E293B] text-base font-bold"
                        numberOfLines={1}
                    >
                        {conversation.name}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                        {isGroup
                            ? `${conversation.participantIds.length} members`
                            : `${otherParticipant?.detail ?? 'Direct message'}${otherParticipant?.online ? ' - Online' : ''}`}
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                        toast.info(
                            isGroup
                                ? `${conversation.participantIds.length} group members`
                                : (otherParticipant?.detail ?? 'Direct message')
                        )
                    }
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center"
                >
                    <Ionicons
                        name={
                            isGroup
                                ? 'people-outline'
                                : 'information-circle-outline'
                        }
                        size={20}
                        color="#64748B"
                    />
                </TouchableOpacity>
            </View>

            <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
                <ScrollView
                    ref={scrollRef}
                    className="flex-1"
                    contentContainerStyle={{
                        padding: 16,
                        gap: 14,
                    }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollToBottom(false)}
                >
                    {messages.length === 0 && (
                        <View className="items-center py-16 px-8">
                            <ManagerChatAvatar
                                participant={otherParticipant}
                                type={conversation.type}
                                size="lg"
                            />
                            <Text className="text-[#1E293B] text-lg font-bold mt-4">
                                {conversation.name}
                            </Text>
                            <Text className="text-[#64748B] text-sm text-center mt-2">
                                This is the beginning of the conversation. Send
                                the first message.
                            </Text>
                        </View>
                    )}

                    {messages.map((chatMessage) => {
                        const isMe = chatMessage.senderId === currentManager.id;
                        const sender = getManagerChatParticipant(
                            chatMessage.senderId
                        );
                        const showSender = isGroup && !isMe;

                        return (
                            <View
                                key={chatMessage.id}
                                className={`flex-row items-start ${
                                    isMe ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {showSender && (
                                    <View className="mr-2">
                                        <ManagerChatAvatar
                                            participant={sender}
                                            size="sm"
                                        />
                                    </View>
                                )}
                                <View className="max-w-[78%]">
                                    {showSender && (
                                        <Text
                                            className="text-[11px] font-bold mb-1"
                                            style={{
                                                color:
                                                    sender?.color ?? '#64748B',
                                            }}
                                        >
                                            {sender?.name ?? 'Member'}
                                        </Text>
                                    )}
                                    <View
                                        className={`rounded-2xl px-4 py-3 border ${
                                            isMe
                                                ? 'bg-blue-600 border-blue-600 rounded-tr-sm'
                                                : 'bg-white border-gray-100 rounded-tl-sm'
                                        }`}
                                    >
                                        <Text
                                            className={`text-[15px] leading-5 ${
                                                isMe
                                                    ? 'text-white'
                                                    : 'text-[#1E293B]'
                                            }`}
                                        >
                                            {chatMessage.text}
                                        </Text>
                                    </View>
                                    <Text
                                        className={`text-[#94A3B8] text-[10px] font-semibold mt-1 ${
                                            isMe ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {chatMessage.time}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <View
                    className="bg-white border-t border-gray-100 px-4 pt-3 flex-row items-end"
                    style={{ paddingBottom: Math.max(insets.bottom, 12) }}
                >
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() =>
                            toast.info('Mock attachment', {
                                description:
                                    'Attachment upload is not connected yet.',
                            })
                        }
                        className="w-11 h-11 rounded-full bg-[#F1F5F9] items-center justify-center mr-2"
                    >
                        <Ionicons
                            name="attach-outline"
                            size={21}
                            color="#64748B"
                        />
                    </TouchableOpacity>
                    <View className="flex-1 min-h-11 max-h-24 bg-[#F1F5F9] rounded-2xl px-4 py-3">
                        <TextInput
                            className="text-[#1E293B] text-sm"
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            style={{ padding: 0 }}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        disabled={!message.trim()}
                        onPress={sendMessage}
                        className={`w-11 h-11 rounded-full items-center justify-center ml-2 ${
                            message.trim() ? 'bg-blue-600' : 'bg-blue-200'
                        }`}
                    >
                        <Ionicons
                            name="send"
                            size={18}
                            color="white"
                            style={{ marginLeft: 2 }}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}
