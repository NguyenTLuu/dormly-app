import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

const useAuth = () => {
    // Todo: replace with actual logic to get user data (Redux/Zustand/AsyncStorage)
    return {
        isLoading: false,
        isAuthenticated: false,
        userRole: 'STUDENT',
    };
};

export default function IndexScreen() {
    const { isLoading, isAuthenticated, userRole } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    if (userRole === 'MANAGER') {
        return <Redirect href="/(manager)/dashboard" />;
    }

    return <Redirect href="/(student)/home" />;
}
