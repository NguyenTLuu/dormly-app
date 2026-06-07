import { ManagerHeader, SectionTitle } from '@/components/manager-dashboard';
import {
    ActionStatusTabs,
    NotificationCard,
    NotificationComposer,
} from '@/components/manager-dashboard-actions';
import SectionCard from '@/components/SectionCard';
import {
    ManagerNotification,
    NotificationDraftInput,
    NotificationStatus,
    managerNotifications,
} from '@/data/manager-dashboard-actions';
import { addActivityLog } from '@/data/activity-log';
import { publishStudentNotification } from '@/data/student-notifications';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { toast } from 'sonner-native';

const notificationStatuses: NotificationStatus[] = [
    'Draft',
    'Scheduled',
    'Sent',
];

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] =
        useState<ManagerNotification[]>(managerNotifications);
    const [activeStatus, setActiveStatus] =
        useState<NotificationStatus>('Draft');

    const counts = useMemo(
        () =>
            notificationStatuses.reduce(
                (result, status) => ({
                    ...result,
                    [status]: notifications.filter(
                        (notification) => notification.status === status
                    ).length,
                }),
                { Draft: 0, Scheduled: 0, Sent: 0 } as Record<
                    NotificationStatus,
                    number
                >
            ),
        [notifications]
    );

    const filteredNotifications = notifications.filter(
        (notification) => notification.status === activeStatus
    );

    const handleCreate = (input: NotificationDraftInput) => {
        if (!input.title || !input.message) {
            toast.error('Missing notification information', {
                description: 'Title and message are required.',
            });
            return false;
        }

        if (
            input.audienceScope !== 'All residents' &&
            input.audienceTargets.length === 0
        ) {
            toast.error('Audience selection is required', {
                description: `Choose at least one target for ${input.audienceScope.toLowerCase()}.`,
            });
            return false;
        }

        const audience =
            input.audienceScope === 'All residents'
                ? 'All residents'
                : input.audienceTargets.join(', ');
        const notification: ManagerNotification = {
            id: `NTF-${Date.now()}`,
            title: input.title,
            message: input.message,
            audience,
            audienceScope: input.audienceScope,
            audienceTargets: input.audienceTargets,
            priority: input.priority,
            status: 'Draft',
            createdAt: '06 Jun 2026, just now',
        };
        setNotifications((current) => [notification, ...current]);
        addActivityLog({
            action: 'Created notification draft',
            detail: `${notification.title} for ${notification.audience}.`,
            actorName: 'Nguyen Minh Manager',
            actorRole: 'Manager',
            time: 'Just now',
            icon: 'notifications-outline',
            color: '#0EA5E9',
        });
        setActiveStatus('Draft');
        toast.success('Notification draft created');
        return true;
    };

    const handleDelete = (id: string) => {
        setNotifications((current) =>
            current.filter((notification) => notification.id !== id)
        );
        toast.success('Sent notification deleted');
    };

    const handleSend = (id: string) => {
        const notification = notifications.find((item) => item.id === id);
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, status: 'Sent' }
                    : notification
            )
        );
        if (notification) {
            publishStudentNotification(notification);
            addActivityLog({
                action: 'Sent resident notification',
                detail: `${notification.title} sent to ${notification.audience}.`,
                actorName: 'Nguyen Minh Manager',
                actorRole: 'Manager',
                time: 'Just now',
                icon: 'notifications-outline',
                color: '#0EA5E9',
            });
        }
        toast.success('Notification sent', {
            description: 'The selected audience has been notified.',
        });
    };

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView
                className="bg-[#F4FAFD] flex-1"
                keyboardShouldPersistTaps="handled"
            >
                <ManagerHeader
                    title="Notifications"
                    subtitle="Create and manage resident announcements"
                    onBack={() => router.back()}
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    <SectionCard>
                        <SectionTitle
                            title="Create Notification"
                            icon="create-outline"
                        />
                        <NotificationComposer onCreate={handleCreate} />
                    </SectionCard>

                    <ActionStatusTabs
                        options={notificationStatuses}
                        value={activeStatus}
                        counts={counts}
                        onChange={setActiveStatus}
                    />

                    <View>
                        <Text className="text-[#1E293B] text-lg font-bold mb-3">
                            {activeStatus} notifications
                        </Text>
                        <View className="gap-3">
                            {filteredNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onSend={handleSend}
                                    onDelete={handleDelete}
                                />
                            ))}
                            {filteredNotifications.length === 0 && (
                                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <Text className="text-[#64748B] text-sm font-semibold text-center">
                                        No notifications in this status.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
