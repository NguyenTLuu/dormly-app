import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import '../global.css';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(student)" />
                    <Stack.Screen name="(manager)" />
                    <Stack.Screen name="manager-details" />
                    <Stack.Screen name="manager-dashboard-details" />
                    <Stack.Screen name="manager-settings-details" />
                    <Stack.Screen name="student-request-details" />
                    <Stack.Screen name="student-profile-details" />
                </Stack>
                <Toaster position="top-center" />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
