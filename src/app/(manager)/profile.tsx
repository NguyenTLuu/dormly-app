import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
export default function Profile() {
    const router = useRouter();

    const handleLogOut = () => {
        router.replace('/login');
    };
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-black font-bold text-center">Profile</Text>
            <TouchableOpacity onPress={handleLogOut}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}
