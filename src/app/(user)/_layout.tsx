import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNotifications } from '@/contexts/AppNotificationsContext';

export default function UserTabsLayout() {
    const inbox = useAppNotifications();
    const size = 22;
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#208AEF',
                tabBarInactiveTintColor: '#64748B',
                tabBarStyle: {
                    height: 65 + insets.bottom,
                    paddingBottom: 10 + insets.bottom,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="room"
                options={{
                    title: 'Room',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="business" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Notification',
                    tabBarBadge: inbox.unread > 0 ? inbox.unread : undefined,
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="notifications"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
