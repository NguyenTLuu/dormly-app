import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Platform,
    Animated,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { dormFaq, findDormFaqAnswer } from '@/data/dorm-faq';

interface MessageProps {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
}

const BOT_INITIAL_MESSAGES: MessageProps[] = [
    {
        id: 'bot-init',
        text: 'Hello! I am your Dormitory Assistant Bot. How can I help you today?',
        time: 'Now',
        isMe: false,
    },
];

const BOT_QUICK_REPLIES = [
    {
        question: 'Electricity fee?',
        answer: 'The current electricity fee is 3,500 VND / kWh. The payment deadline is the 10th of every month.',
    },
    {
        question: 'Water fee?',
        answer: 'The residential water fee is 15,000 VND / cubic meter (m³).',
    },
    {
        question: 'Internet fee?',
        answer: 'The Internet (Wi-Fi) fee is 100,000 VND / month / room (unlimited data package).',
    },
];

void BOT_QUICK_REPLIES;

export default function BotRoomScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [message, setMessage] = useState('');
    const [chatData, setChatData] =
        useState<MessageProps[]>(BOT_INITIAL_MESSAGES);
    const scrollViewRef = useRef<ScrollView>(null);
    const keyboardHeight = useRef(new Animated.Value(insets.bottom)).current;

    const scrollToBottom = (animated = true) => {
        scrollViewRef.current?.scrollToEnd({ animated });
    };

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                const offset = Platform.OS === 'android' ? 10 : 0;
                Animated.timing(keyboardHeight, {
                    toValue: e.endCoordinates.height + offset,
                    duration: Platform.OS === 'ios' ? e.duration : 150,
                    useNativeDriver: false,
                }).start(() => scrollToBottom(true));
            }
        );

        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => {
                Animated.timing(keyboardHeight, {
                    toValue: insets.bottom,
                    duration: Platform.OS === 'ios' ? e.duration : 150,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [insets.bottom]);

    const handleSend = () => {
        if (message.trim().length === 0) return;

        const newMessage: MessageProps = {
            id: Date.now().toString(),
            text: message.trim(),
            time: 'Just now',
            isMe: true,
        };

        setChatData((prev) => [...prev, newMessage]);
        setMessage('');
        setTimeout(() => scrollToBottom(true), 100);

        setTimeout(() => {
            const answer = findDormFaqAnswer(newMessage.text);
            setChatData((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text:
                        answer ??
                        "I'm sorry, I couldn't find that information. Please select one of the suggested questions below.",
                    time: 'Just now',
                    isMe: false,
                },
            ]);
            scrollToBottom(true);
        }, 1000);
    };

    const handleAskBot = (question: string, answer: string) => {
        // 1. Add user question
        const userMsg: MessageProps = {
            id: Date.now().toString(),
            text: question,
            time: 'Just now',
            isMe: true,
        };
        setChatData((prev) => [...prev, userMsg]);
        setTimeout(() => scrollToBottom(true), 100);

        setTimeout(() => {
            const botMsg: MessageProps = {
                id: (Date.now() + 1).toString(),
                text: answer,
                time: 'Just now',
                isMe: false,
            };
            setChatData((prev) => [...prev, botMsg]);
            scrollToBottom(true);
        }, 800);
    };

    return (
        <View style={{ flex: 1 }} className="bg-[#F5F7FA]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            {/* Header */}
            <View
                className="bg-white flex-row items-center px-4 border-b border-gray-200 shadow-sm z-10"
                style={{ paddingTop: insets.top + 10, paddingBottom: 12 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-1"
                >
                    <Ionicons name="chevron-back" size={28} color="#1E293B" />
                </TouchableOpacity>

                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                    <MaterialCommunityIcons
                        name="robot-outline"
                        size={22}
                        color="#9333EA"
                    />
                </View>

                <View className="flex-1">
                    <Text
                        className="text-[17px] font-bold text-[#1E293B]"
                        numberOfLines={1}
                    >
                        Assistant Bot
                    </Text>
                    <Text className="text-[12px] text-green-600 font-medium">
                        Always Active
                    </Text>
                </View>

                <TouchableOpacity className="p-2">
                    <Feather name="more-vertical" size={20} color="#64748B" />
                </TouchableOpacity>
            </View>

            <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
                {/* Chat List */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-4"
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollToBottom(false)}
                >
                    {chatData.map((msg) => (
                        <View
                            key={msg.id}
                            className={`mb-4 max-w-[80%] ${msg.isMe ? 'self-end' : 'self-start'}`}
                        >
                            <View
                                className={`px-4 py-3 rounded-2xl ${
                                    msg.isMe
                                        ? 'bg-blue-600 rounded-tr-sm'
                                        : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'
                                }`}
                            >
                                <Text
                                    className={`text-[15px] ${msg.isMe ? 'text-white' : 'text-[#1E293B]'}`}
                                >
                                    {msg.text}
                                </Text>
                            </View>
                            <Text
                                className={`text-[11px] text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}
                            >
                                {msg.time}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Bot Quick Replies */}
                <View className="bg-[#F5F7FA] pb-2">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4"
                        contentContainerStyle={{ paddingRight: 30 }}
                    >
                        {dormFaq.map((reply) => (
                            <TouchableOpacity
                                key={reply.id}
                                onPress={() =>
                                    handleAskBot(reply.question, reply.answer)
                                }
                                className="bg-purple-100 border border-purple-200 px-4 py-2.5 rounded-full mr-2"
                            >
                                <Text className="text-purple-700 font-medium text-[13px]">
                                    {reply.question}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Chat Input */}
                <View
                    className="bg-white px-4 py-3 border-t border-gray-200 flex-row items-end"
                    style={{ paddingBottom: Math.max(insets.bottom, 12) }}
                >
                    <View className="flex-1 bg-[#F1F5F9] rounded-2xl px-4 pt-3 pb-3 mr-3 min-h-[44px] max-h-[100px]">
                        <TextInput
                            className="text-[15px] text-[#1E293B]"
                            placeholder="Type a message..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            value={message}
                            onChangeText={setMessage}
                            style={{ padding: 0, margin: 0 }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={message.trim().length === 0}
                        className={`w-11 h-11 rounded-full items-center justify-center mb-0.5 ${
                            message.trim().length > 0
                                ? 'bg-blue-600'
                                : 'bg-blue-200'
                        }`}
                    >
                        <Ionicons
                            name="send"
                            size={18}
                            color="white"
                            style={{ marginLeft: 3 }}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}
