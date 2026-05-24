import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EdgeToEdgeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View className="flex-1 bg-[#208AEF]">
                <Text>Notification Screen</Text>
            </View>
        </>
    );
}
