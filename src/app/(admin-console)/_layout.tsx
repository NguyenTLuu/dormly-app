import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminTabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#208AEF',
                tabBarInactiveTintColor: '#64748B',
                tabBarStyle: {
                    height: 65 + insets.bottom,
                    paddingTop: 10,
                    paddingBottom: 10 + insets.bottom,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Overview',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="grid-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: 'Users',
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="people-outline"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tickets"
                options={{
                    title: 'Tickets',
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="ticket-outline"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="invoices"
                options={{
                    title: 'Invoices',
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="receipt-outline"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="announcements"
                options={{
                    title: 'Notices',
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="megaphone-outline"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
