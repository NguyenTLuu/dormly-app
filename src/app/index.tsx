import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

function getDevMenuHint() {
    if (Platform.OS === 'web') {
        return <ThemedText type="small">use browser devtools</ThemedText>;
    }
    if (Device.isDevice) {
        return (
            <ThemedText type="small">
                shake device or press <ThemedText type="code">m</ThemedText> in
                terminal
            </ThemedText>
        );
    }
    const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
    return (
        <ThemedText type="small">
            press <ThemedText type="code">{shortcut}</ThemedText>
        </ThemedText>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const handleGoToLogin = () => {
        console.log('Đang chuyển sang trang Đăng nhập...');
        router.push('/LoginScreen');
    };

    const handleGoToActivate = () => {
        router.push('/ResetPassScreen');
    };

    return (
        <SafeAreaView>
            <View className="justify-center items-center">
                <TouchableOpacity
                    onPress={handleGoToLogin}
                    className="bg-blue-500 px-6 py-3 rounded-full mt-4"
                >
                    <Text className="text-white font-bold text-center">
                        Login Screen
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleGoToLogin}
                    className="bg-gray-500 px-6 py-3 rounded-full mt-4"
                >
                    <Text className="text-white font-bold text-center">
                        Activate Screen
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
