import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export default function FeatureInfo({
    children,
    title,
    icon = 'information-circle-outline',
}: {
    children: ReactNode;
    title?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <View className="bg-blue-50 rounded-xl px-3.5 py-3 flex-row items-start">
            <Ionicons name={icon} size={18} color="#2563EB" />
            <View className="ml-2 flex-1 gap-1">
                {title ? (
                    <Text className="text-blue-900 text-xs font-bold">
                        {title}
                    </Text>
                ) : null}
                <Text className="text-blue-800 text-xs font-semibold leading-5">
                    {children}
                </Text>
            </View>
        </View>
    );
}
