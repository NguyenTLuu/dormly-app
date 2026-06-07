import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
        >
            <Stack.Screen name="login" options={{ title: 'Login' }} />
            <Stack.Screen
                name="register"
                options={{ title: 'Student Registration' }}
            />
            <Stack.Screen
                name="forgot-pass"
                options={{ title: 'Reset Password' }}
            />
            <Stack.Screen
                name="first-time-login"
                options={{ title: 'Change Password' }}
            />
        </Stack>
    );
}
