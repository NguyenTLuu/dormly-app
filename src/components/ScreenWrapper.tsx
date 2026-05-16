import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

// @ts-ignore
export const ScreenWrapper = ({ children, className = '' }) => {
    return (
        <SafeAreaView className={`flex-1 bg-white ${className}`}>
            <View className="flex-1">{children}</View>
        </SafeAreaView>
    );
};
