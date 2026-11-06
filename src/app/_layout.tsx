import '@/global.css';

import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { AppNotificationsProvider } from '@/contexts/AppNotificationsContext';

function RootNavigator() {
    const { isBootstrapping, isAuthenticated, hasRole } = useAuth();

    if (isBootstrapping) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    const isUser = hasRole('USER');
    const isStaff = hasRole('STAFF');
    const isAdmin = hasRole('ADMIN');

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Chỉ mở khi chưa đăng nhập */}
            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>

            {/* Resident screens require the backend USER role. */}
            <Stack.Protected guard={isAuthenticated && isUser}>
                <Stack.Screen name="(user)" />

                <Stack.Screen name="student-request-details" />
                <Stack.Screen name="student-profile-details" />
            </Stack.Protected>

            {/* Operational Admin screens are shared by STAFF and ADMIN. */}
            <Stack.Protected guard={isAuthenticated && (isStaff || isAdmin)}>
                <Stack.Screen name="(admin)" />

                <Stack.Screen name="manager-details" />
                <Stack.Screen name="manager-dashboard-details" />
                <Stack.Screen name="manager-settings-details" />
                <Stack.Screen name="admin-details" />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && isAdmin}>
                <Stack.Screen name="(admin-console)" />
            </Stack.Protected>

            {/* Các màn hình dùng chung sau khi đăng nhập */}
            <Stack.Screen name="index" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AppNotificationsProvider>
                        <ThemeProvider value={DefaultTheme}>
                            <RootNavigator />

                            <Toaster position="top-center" />
                        </ThemeProvider>
                    </AppNotificationsProvider>
                </AuthProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
