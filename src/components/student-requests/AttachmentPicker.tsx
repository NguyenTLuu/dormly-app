import { StudentAttachment } from '@/data/student-requests';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

interface AttachmentPickerProps {
    attachments: StudentAttachment[];
    accentColor: string;
    accentBg: string;
    onChange: (attachments: StudentAttachment[]) => void;
}

const formatFileSize = (size?: number) => {
    if (!size) return 'File attached';
    if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AttachmentPicker({
    attachments,
    accentColor,
    accentBg,
    onChange,
}: AttachmentPickerProps) {
    const handlePickFiles = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: true,
            type: ['image/*', 'video/*', 'application/pdf'],
        });

        if (result.canceled) return;

        const pickedFiles = result.assets.map((asset, index) => ({
            id: `${asset.uri}-${index}`,
            name: asset.name,
            size: asset.size,
            mimeType: asset.mimeType,
            uri: asset.uri,
        }));

        onChange([...attachments, ...pickedFiles]);
        toast.success(`${pickedFiles.length} file(s) attached`);
    };

    return (
        <View>
            <Text className="text-[#1E293B] text-sm font-bold">
                Attachments
            </Text>
            <Text className="text-[#94A3B8] text-xs font-medium mt-1">
                Add photos, videos, or PDF files to help the manager review.
            </Text>

            {attachments.map((attachment) => (
                <View
                    key={attachment.id}
                    className="flex-row items-center rounded-2xl border border-slate-100 p-3 mt-3"
                >
                    <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: accentBg }}
                    >
                        <Ionicons
                            name="document-attach-outline"
                            size={19}
                            color={accentColor}
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text
                            className="text-[#334155] text-sm font-bold"
                            numberOfLines={1}
                        >
                            {attachment.name}
                        </Text>
                        <Text className="text-[#94A3B8] text-xs font-medium mt-0.5">
                            {formatFileSize(attachment.size)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                            onChange(
                                attachments.filter(
                                    (item) => item.id !== attachment.id
                                )
                            )
                        }
                        className="w-9 h-9 rounded-full bg-red-50 items-center justify-center"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={17}
                            color="#DC2626"
                        />
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity
                activeOpacity={0.75}
                onPress={handlePickFiles}
                className="border border-dashed rounded-2xl py-4 items-center justify-center mt-3"
                style={{ borderColor: accentColor, backgroundColor: accentBg }}
            >
                <Ionicons
                    name="cloud-upload-outline"
                    size={23}
                    color={accentColor}
                />
                <Text
                    className="text-sm font-bold mt-1.5"
                    style={{ color: accentColor }}
                >
                    Add attachments
                </Text>
            </TouchableOpacity>
        </View>
    );
}
