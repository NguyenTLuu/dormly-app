import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView>
            <View className="justify-center items-center bg-white h-screen">
                <Link href="/login" asChild>
                    <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-full mt-4">
                        <Text className="text-white font-bold text-center">
                            Login Screen
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/reset-pass" asChild>
                    <TouchableOpacity className="bg-gray-500 px-6 py-3 rounded-full mt-4">
                        <Text className="text-white font-bold text-center">
                            Reset Pass
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/first-time-login" asChild>
                    <TouchableOpacity className="bg-gray-500 px-6 py-3 rounded-full mt-4">
                        <Text className="text-white font-bold text-center">
                            First Time Login
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
