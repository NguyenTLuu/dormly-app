import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StudentDocumentRowProps {
    title: string;
    code: string;
    meta: string;
    color: string;
    bgColor: string;
    verified?: boolean;
}

export default function StudentDocumentRow({
    title,
    code,
    meta,
    color,
    bgColor,
    verified = false,
}: StudentDocumentRowProps) {
    return (
        <View
            className="rounded-2xl p-3 flex-row items-center border border-gray-100"
            style={{ backgroundColor: bgColor }}
        >
            <View className="w-12 h-12 rounded-xl bg-white/80 items-center justify-center mr-3">
                <Ionicons name="document-text-outline" size={22} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-[#1E293B] text-sm font-bold">
                    {title}
                </Text>
                <Text className="text-[#334155] text-xs font-semibold mt-1">
                    {code}
                </Text>
                <Text className="text-[#64748B] text-[10px] font-semibold mt-1">
                    {meta}
                </Text>
            </View>
            {verified && (
                <View className="bg-white rounded-full px-2 py-1 flex-row items-center mr-2">
                    <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#16A34A"
                    />
                    <Text className="text-[#16A34A] text-[10px] font-bold ml-1">
                        Verified
                    </Text>
                </View>
            )}
            <View className="w-12 h-14 bg-white rounded-lg border border-gray-100 items-center justify-center">
                <Ionicons name="image-outline" size={22} color="#94A3B8" />
            </View>
        </View>
    );
}
