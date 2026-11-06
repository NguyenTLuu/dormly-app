import { axiosClient } from '@/api/axiosClient';
import type { AdminTicketAttachment } from '@/types/admin';
import { useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { toast } from 'sonner-native';

export default function TicketFiles({
    files,
    onChanged,
}: {
    files: AdminTicketAttachment[];
    onChanged: () => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<AdminTicketAttachment | null>(null);
    const [deleting, setDeleting] = useState<AdminTicketAttachment | null>(
        null
    );
    const [busy, setBusy] = useState(false);
    const open = async (file: AdminTicketAttachment, download = false) => {
        if (
            !file.url ||
            !/^\/api\/ticket-attachments\/[A-Za-z0-9._-]+$/.test(file.url)
        )
            return toast.error('File URL is unavailable');
        setBusy(true);
        try {
            const response = await axiosClient.get<Blob>(file.url, {
                responseType: 'blob',
            });
            const uri = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () =>
                    typeof reader.result === 'string'
                        ? resolve(reader.result)
                        : reject(new Error());
                reader.onerror = reject;
                reader.readAsDataURL(response.data);
            });
            if (file.contentType?.startsWith('image/') && !download) {
                setPreviewFile(file);
                setPreview(uri);
            }
            else if (Platform.OS === 'web') {
                const link = document.createElement('a');
                link.href = uri;
                link.download = file.originalFilename;
                link.click();
            } else {
                if (
                    !FileSystem.cacheDirectory ||
                    !(await Sharing.isAvailableAsync())
                )
                    throw new Error();
                const path =
                    FileSystem.cacheDirectory +
                    'ticket-' +
                    file.id +
                    '-' +
                    file.originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
                await FileSystem.writeAsStringAsync(
                    path,
                    uri.slice(uri.indexOf(',') + 1),
                    { encoding: FileSystem.EncodingType.Base64 }
                );
                await Sharing.shareAsync(path, {
                    mimeType: file.contentType || 'application/octet-stream',
                    UTI:
                        file.contentType === 'application/pdf'
                            ? 'com.adobe.pdf'
                            : undefined,
                });
            }
        } catch {
            toast.error('Could not open attachment');
        } finally {
            setBusy(false);
        }
    };
    const remove = async () => {
        if (!deleting) return;
        setBusy(true);
        try {
            await axiosClient.delete('/api/ticket-attachments/' + deleting.id);
            setDeleting(null);
            onChanged();
            toast.success('Attachment deleted');
        } catch {
            toast.error('Could not delete attachment');
        } finally {
            setBusy(false);
        }
    };
    return (
        <View className="gap-2">
            {busy ? (
                <Text className="text-slate-500">Processing attachment...</Text>
            ) : null}
            {files.map((file) => (
                <View
                    key={file.id}
                    className="border border-slate-200 rounded-xl p-3 gap-2"
                >
                    <Text className="text-slate-800 font-semibold">
                        {file.originalFilename}
                    </Text>
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            disabled={busy}
                            onPress={() => void open(file)}
                        >
                            <Text className="text-blue-700 font-bold">
                                View / download
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={() => setDeleting(file)}
                        >
                            <Text className="text-red-700 font-bold">
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <Modal
                visible={preview !== null}
                onRequestClose={() => setPreview(null)}
            >
                <View className="flex-1 bg-slate-950 p-5 pt-12">
                    <TouchableOpacity onPress={() => setPreview(null)}>
                        <Text className="text-white font-bold mb-4">
                            Close preview
                        </Text>
                    </TouchableOpacity>
                    {previewFile ? <TouchableOpacity disabled={busy} onPress={() => void open(previewFile, true)}><Text className="text-white font-bold mb-4">{busy ? 'Opening...' : 'Download / open image'}</Text></TouchableOpacity> : null}
                    {preview ? (
                        <Image
                            source={{ uri: preview }}
                            resizeMode="contain"
                            className="flex-1 w-full"
                            onError={() => {
                                setPreview(null);
                                toast.error('Could not display image');
                            }}
                        />
                    ) : null}
                </View>
            </Modal>
            <Modal
                transparent
                visible={deleting !== null}
                onRequestClose={() => !busy && setDeleting(null)}
            >
                <View className="flex-1 bg-black/40 justify-center p-6">
                    <View className="bg-white rounded-2xl p-5 gap-4">
                        <Text className="text-slate-800 font-bold">
                            Delete {deleting?.originalFilename}?
                        </Text>
                        <Text>
                            This removes the attachment from the ticket.
                        </Text>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={() => void remove()}
                        >
                            <Text className="text-red-700 font-bold">
                                Confirm delete
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={() => setDeleting(null)}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
