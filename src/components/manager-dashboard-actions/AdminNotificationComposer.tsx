import {
    publishNotification,
    type PublishNotificationInput,
} from '@/api/notificationApi';
import FeatureInfo from '@/components/FeatureInfo';
import type { NotificationPriority } from '@/data/manager-dashboard-actions';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import NotificationPrioritySelector from './NotificationPrioritySelector';
import NotificationRecipientPicker, {
    useNotificationAudience,
} from './NotificationRecipientPicker';

const channelOptions = [
    { id: 'WEBSOCKET', label: 'In-app' },
    { id: 'EMAIL', label: 'Email' },
] as const;

export default function AdminNotificationComposer() {
    const audience = useNotificationAudience();
    const queryClient = useQueryClient();
    const send = useMutation({ mutationFn: publishNotification, retry: false });
    const sending = useRef(false);
    const [title, setTitle] = useState('');
    const [channels, setChannels] = useState<
        PublishNotificationInput['channels']
    >(['WEBSOCKET']);
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<NotificationPriority>('Normal');
    const [resultMessage, setResultMessage] = useState('');
    const pending = send.isPending;
    const canSend =
        audience.ready &&
        audience.recipients.length > 0 &&
        channels.length > 0 &&
        !!title.trim() &&
        !!message.trim() &&
        !pending;

    const handlePublish = async () => {
        if (!canSend || sending.current) return;
        sending.current = true;
        setResultMessage('');
        try {
            const { accepted, failed } = await send.mutateAsync({
                title: title.trim(),
                message: message.trim(),
                priority,
                recipients: audience.recipients,
                audience: audience.label ?? 'Specific people',
                channels,
            });
            if (failed.length) {
                audience.setSelection({
                    kind: 'people',
                    emails: failed.map((email) => email.toLowerCase()),
                });
                setResultMessage(
                    accepted +
                        ' accepted. ' +
                        failed.length +
                        ' unconfirmed. Review the selected emails and sending history before retrying.'
                );
                toast.warning('Some requests could not be confirmed');
            } else {
                toast.success(
                    'Request accepted for ' + accepted + ' recipients'
                );
                setTitle('');
                setMessage('');
                setPriority('Normal');
                audience.setSelection({ kind: 'people', emails: [] });
            }
        } catch {
            toast.error('Could not submit notification');
        } finally {
            sending.current = false;
            void queryClient.invalidateQueries({
                queryKey: ['notification-logs'],
            });
            void queryClient.invalidateQueries({
                queryKey: ['notification-log'],
            });
        }
    };

    return (
        <View className="gap-3">
            <FeatureInfo icon="people-outline">
                Search by account email or name and select each recipient. For a
                room, floor, or block, the app uses current room assignments.
                Preview the email list before sending. In-app appears in
                Notifications. Email goes to the email mailbox.
            </FeatureInfo>
            <NotificationRecipientPicker
                key={audience.selection.kind}
                audience={audience}
                disabled={pending}
            />
            <View className="flex-row flex-wrap gap-2">
                {channelOptions.map(({ id, label }) => (
                    <TouchableOpacity
                        key={id}
                        disabled={pending}
                        accessibilityRole="button"
                        accessibilityState={{ selected: channels.includes(id) }}
                        onPress={() =>
                            setChannels((current) =>
                                current.includes(id)
                                    ? current.filter(
                                          (channel) => channel !== id
                                      )
                                    : [...current, id]
                            )
                        }
                        className={
                            channels.includes(id)
                                ? 'bg-blue-600 rounded-xl p-2'
                                : 'bg-slate-100 rounded-xl p-2'
                        }
                    >
                        <Text
                            className={
                                channels.includes(id)
                                    ? 'text-white'
                                    : 'text-slate-700'
                            }
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {!!resultMessage && (
                <Text className="text-amber-800">{resultMessage}</Text>
            )}
            <View>
                <Text className="text-slate-600 text-xs font-bold mb-1.5">
                    Title
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    editable={!pending}
                    placeholder="Notification title"
                    className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                />
            </View>
            <View pointerEvents={pending ? 'none' : 'auto'}>
                <NotificationPrioritySelector
                    value={priority}
                    onChange={setPriority}
                />
            </View>
            <View>
                <Text className="text-slate-600 text-xs font-bold mb-1.5">
                    Message
                </Text>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    editable={!pending}
                    placeholder="Write the notification message"
                    multiline
                    textAlignVertical="top"
                    className="min-h-[90px] bg-slate-50 rounded-xl p-3 border border-slate-200"
                />
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={!canSend}
                onPress={handlePublish}
                className={`rounded-xl py-3.5 flex-row items-center justify-center ${canSend ? 'bg-blue-600' : 'bg-blue-300'}`}
            >
                <Ionicons name="send-outline" size={19} color="white" />
                <Text className="text-white text-sm font-bold ml-2">
                    {pending ? 'Submitting…' : 'Send notification'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
