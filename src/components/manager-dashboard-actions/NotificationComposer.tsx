import { Ionicons } from '@expo/vector-icons';
import {
    NotificationAudienceScope,
    NotificationDraftInput,
    NotificationPriority,
} from '@/data/manager-dashboard-actions';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import NotificationAudienceSelector from './NotificationAudienceSelector';
import NotificationPrioritySelector from './NotificationPrioritySelector';

interface NotificationComposerProps {
    onCreate: (input: NotificationDraftInput) => boolean;
}

export default function NotificationComposer({
    onCreate,
}: NotificationComposerProps) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<NotificationPriority>('Normal');
    const [audienceScope, setAudienceScope] =
        useState<NotificationAudienceScope>('All residents');
    const [audienceTargets, setAudienceTargets] = useState<string[]>([]);

    const handleCreate = () => {
        const created = onCreate({
            title: title.trim(),
            message: message.trim(),
            priority,
            audienceScope,
            audienceTargets,
        });

        if (created) {
            setTitle('');
            setMessage('');
            setPriority('Normal');
            setAudienceScope('All residents');
            setAudienceTargets([]);
        }
    };

    return (
        <View className="gap-3">
            <View>
                <Text className="text-[#475569] text-xs font-bold mb-1.5">
                    Title
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Notification title"
                    placeholderTextColor="#94A3B8"
                    className="bg-[#F8FAFC] rounded-xl px-3.5 py-3 text-[#1E293B] text-sm font-semibold border border-gray-100"
                />
            </View>
            <NotificationPrioritySelector
                value={priority}
                onChange={setPriority}
            />
            <NotificationAudienceSelector
                scope={audienceScope}
                targets={audienceTargets}
                onScopeChange={setAudienceScope}
                onTargetsChange={setAudienceTargets}
            />
            <View>
                <Text className="text-[#475569] text-xs font-bold mb-1.5">
                    Message
                </Text>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write the notification message"
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    className="min-h-[90px] bg-[#F8FAFC] rounded-xl px-3.5 py-3 text-[#1E293B] text-sm font-semibold border border-gray-100"
                />
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCreate}
                className="bg-[#2563EB] rounded-xl py-3.5 flex-row items-center justify-center"
            >
                <Ionicons name="add-circle-outline" size={19} color="white" />
                <Text className="text-white text-sm font-bold ml-2">
                    Create draft
                </Text>
            </TouchableOpacity>
        </View>
    );
}
