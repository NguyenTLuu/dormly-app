import { useAuth } from '@/auth/AuthContext';
import { ManagerHeader, SectionTitle } from '@/components/manager-dashboard';
import { AdminNotificationComposer } from '@/components/manager-dashboard-actions';
import NotificationHistory from '@/components/manager-dashboard-actions/NotificationHistory';
import SectionCard from '@/components/SectionCard';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, Text, View } from 'react-native';

export default function NotificationsScreen() {
    const router = useRouter();
    const { hasRole } = useAuth();
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
                    subtitle="Send notifications and review server history"
                    onBack={() => router.back()}
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    {hasRole('ADMIN') ? (
                        <SectionCard>
                            <SectionTitle
                                title="Send notification"
                                icon="send-outline"
                            />
                            <AdminNotificationComposer />
                        </SectionCard>
                    ) : (
                        <Text className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800">
                            Only an Admin can send notifications.
                        </Text>
                    )}
                    <NotificationHistory />
                </View>
            </ScrollView>
        </>
    );
}
