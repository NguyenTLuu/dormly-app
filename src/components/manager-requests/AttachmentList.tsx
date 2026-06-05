import { RequestAttachment } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface AttachmentListProps {
    attachments: RequestAttachment[];
}

export default function AttachmentList({ attachments }: AttachmentListProps) {
    if (attachments.length === 0) {
        return (
            <Text className="text-[#94A3B8] text-xs font-medium">
                No attachments
            </Text>
        );
    }

    return (
        <View className="gap-2">
            {attachments.map((attachment) => (
                <View
                    key={attachment.id}
                    className="flex-row items-center bg-[#F8FAFC] rounded-xl p-3"
                >
                    <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <Ionicons
                            name={
                                attachment.type === 'image'
                                    ? 'image-outline'
                                    : 'videocam-outline'
                            }
                            size={18}
                            color="#2566E2"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            {attachment.title}
                        </Text>
                        <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                            {attachment.type.toUpperCase()} attachment
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}
