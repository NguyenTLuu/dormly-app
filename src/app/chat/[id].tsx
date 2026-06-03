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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

// --- MOCK DATA ---
interface MessageProps {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
}

const MOCK_MESSAGES: MessageProps[] = [
    {
        id: '1',
        text: 'Hi, are you in the room?',
        time: '10:00 AM',
        isMe: false,
    },
    {
        id: '2',
        text: "Yes, I just got back from class. What's up?",
        time: '10:05 AM',
        isMe: true,
    },
    {
        id: '3',
        text: 'Can you help me check if I left my keys on the table?',
        time: '10:06 AM',
        isMe: false,
    },
    { id: '4', text: 'Let me check...', time: '10:08 AM', isMe: true },
    {
        id: '5',
        text: 'Found them! They are right next to your laptop.',
        time: '10:09 AM',
        isMe: true,
    },
    {
        id: '6',
        text: 'Thank you so much! I will come back to get them in 10 mins.',
        time: '10:15 AM',
        isMe: false,
    },
];

export default function ChatRoomScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

    const [message, setMessage] = useState('');
    const [chatData, setChatData] = useState<MessageProps[]>(MOCK_MESSAGES);
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = (animated = true) => {
        scrollViewRef.current?.scrollToEnd({ animated });
    };

    const keyboardHeight = useRef(new Animated.Value(insets.bottom)).current;

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
                    toValue: insets.bottom, // Khi ẩn bàn phím, trả về chiều cao insets.bottom
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

                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Text className="text-blue-600 font-bold text-lg">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>

                <View className="flex-1">
                    <Text
                        className="text-[17px] font-bold text-[#1E293B]"
                        numberOfLines={1}
                    >
                        {name || 'Chat Room'}
                    </Text>
                    <Text className="text-[12px] text-green-600 font-medium">
                        Online
                    </Text>
                </View>

                <TouchableOpacity className="p-2">
                    <Feather name="more-vertical" size={20} color="#64748B" />
                </TouchableOpacity>
            </View>

            {/* Chat + Chat Input */}
            <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
                {/* Chat */}
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

                {/* Chat Input */}
                <View
                    className="bg-white px-4 py-3 border-t border-gray-200 flex-row items-end"
                    style={{ paddingBottom: Math.max(insets.bottom, 12) }}
                >
                    <TouchableOpacity className="mb-2.5 mr-3">
                        <Feather name="paperclip" size={22} color="#64748B" />
                    </TouchableOpacity>

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
