import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router"; // BẮT BUỘC PHẢI IMPORT STACK
import React from "react";
import { useColorScheme } from "react-native";
import '../global.css';


export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </ThemeProvider>
    );
}