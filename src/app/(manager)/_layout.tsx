import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ManagerTabLayout() {
    const insets = useSafeAreaInsets();
    const size = 22;
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
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="pie-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    title: 'Requests',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="clipboard" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="management"
                options={{
                    title: 'Manage',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="business" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="chatbubbles" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
