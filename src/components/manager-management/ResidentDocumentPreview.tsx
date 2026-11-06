import { getResidentDocumentImage } from '@/api/residentDocumentFileApi';
import type { ResidentDocument } from '@/types/managerResident';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ResidentDocumentPreview({
    document,
    onClose,
    onViewed,
}: {
    document: ResidentDocument | null;
    onClose: () => void;
    onViewed?: (document: ResidentDocument) => void;
}) {
    return (
        <Modal
            visible={Boolean(document)}
            animationType="fade"
            onRequestClose={onClose}
        >
            {document ? (
                <PreviewContent
                    key={`${document.id}:${document.fileUrl}`}
                    document={document}
                    onClose={onClose}
                    onViewed={onViewed}
                />
            ) : null}
        </Modal>
    );
}

function PreviewContent({
    document,
    onClose,
    onViewed,
}: {
    document: ResidentDocument;
    onClose: () => void;
    onViewed?: (document: ResidentDocument) => void;
}) {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        let active = true;
        void getResidentDocumentImage(document.fileUrl)
            .then((uri) => {
                if (active) setImageUri(uri);
            })
            .catch(() => {
                if (active) setError(true);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [document.fileUrl, retry]);

    const tryAgain = () => {
        setImageUri(null);
        setError(false);
        setLoading(true);
        setRetry((current) => current + 1);
    };

    return (
        <View className="flex-1 bg-slate-950 px-4 pt-12 pb-8">
            <View className="flex-row items-center justify-between gap-3 pb-4">
                <View className="flex-1">
                    <Text className="text-white text-lg font-bold">
                        {document?.documentType.replace(/_/g, ' ') ||
                            'Document'}
                    </Text>
                    <Text className="text-slate-300 text-xs mt-1">
                        Resident document preview
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close document preview"
                    className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center"
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View className="flex-1 rounded-2xl bg-slate-900 overflow-hidden items-center justify-center">
                {loading ? (
                    <ActivityIndicator size="large" color="#93C5FD" />
                ) : null}
                {error ? (
                    <View className="items-center gap-3 px-6">
                        <Ionicons
                            name="image-outline"
                            size={38}
                            color="#CBD5E1"
                        />
                        <Text className="text-slate-200 text-center">
                            Could not open this document image.
                        </Text>
                        <TouchableOpacity
                            onPress={tryAgain}
                            accessibilityRole="button"
                            className="rounded-xl bg-blue-600 px-5 py-2.5"
                        >
                            <Text className="text-white font-bold">
                                Try again
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                {imageUri && !error ? (
                    <Image
                        source={{ uri: imageUri }}
                        resizeMode="contain"
                        className="w-full h-full"
                        onLoad={() => onViewed?.(document)}
                        onError={() => setError(true)}
                    />
                ) : null}
            </View>
            <Text className="text-slate-300 text-xs text-center mt-4">
                Check the image carefully before approving or rejecting it.
            </Text>
        </View>
    );
}
