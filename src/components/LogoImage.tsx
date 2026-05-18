import { Text, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

export default function LogoImage() {
    return (
        <View>
            <View className="items-center mb-4 ">
                <View className="flex-row items-center">
                    <Image
                        source={require('@/assets/dormly-logo.png')}
                        style={{ width: 100, height: 100 }}
                        contentFit="contain"
                    />
                    <Text className="text-3xl font-bold text-[#0A4DB8] mt-2">
                        DORMLY
                    </Text>
                </View>
                <Text className="text-gray-500 font-medium text-base">
                    Smart Dormitory Management
                </Text>
            </View>
            <View className="h-48 w-screen mb-6">
                <Image
                    source={require('@/assets/dorm-image.png')}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
            </View>
        </View>
    );
}
