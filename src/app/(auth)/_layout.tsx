import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                // Ẩn header cho tất cả các màn hình trong nhóm này (thường dùng cho Login)
                headerShown: false,
                // Hiệu ứng chuyển trang mượt mà
                animation: 'fade',
            }}
        >
            {/* Bạn có thể định nghĩa cụ thể từng màn hình hoặc để mặc định */}
            <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />
            <Stack.Screen
                name="ResetPasswordScreen"
                options={{ title: 'Reset Password' }}
            />
            <Stack.Screen
                name="FirstTimeReset"
                options={{ title: 'Change Password' }}
            />
        </Stack>
    );
}
