import { useAuth } from '@/auth/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
    const { isBootstrapping, isAuthenticated, hasRole, signOut } = useAuth();

    if (isBootstrapping) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Staff and Admin share the operational Admin dashboard.
    if (hasRole('ADMIN', 'STAFF')) {
        return <Redirect href="/(admin)/dashboard" />;
    }

    if (hasRole('USER')) {
        return <Redirect href="/(user)/home" />;
    }

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="text-center text-base text-slate-700">
                This account does not have a supported role. Contact an
                administrator to assign USER, STAFF, or ADMIN.
            </Text>
            <TouchableOpacity
                onPress={() => void signOut()}
                className="mt-5 rounded-xl bg-blue-600 px-6 py-3"
            >
                <Text className="font-semibold text-white">Log out</Text>
            </TouchableOpacity>
        </View>
    );
}
