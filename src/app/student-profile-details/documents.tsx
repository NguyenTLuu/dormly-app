import {
    getStudentDocuments,
    uploadStudentDocument,
} from '@/api/studentProfileApi';
import { StudentRequestHeader } from '@/components/student-requests';
import type {
    StudentDocument,
    StudentDocumentType,
} from '@/types/studentProfile';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const documentDefinitions: {
    type: StudentDocumentType;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}[] = [
    {
        type: 'CCCD_FRONT',
        title: 'Citizen ID — Front',
        description: 'Upload a clear image or PDF of the front side.',
        icon: 'id-card-outline',
    },
    {
        type: 'CCCD_BACK',
        title: 'Citizen ID — Back',
        description: 'Upload a clear image or PDF of the back side.',
        icon: 'id-card-outline',
    },
    {
        type: 'TEMPORARY_RESIDENCE',
        title: 'Temporary Residence',
        description: 'Upload your temporary residence confirmation.',
        icon: 'home-outline',
    },
];

export default function StudentDocumentsScreen() {
    const queryClient = useQueryClient();
    const documents = useQuery({
        queryKey: ['student-documents'],
        queryFn: getStudentDocuments,
    });
    const upload = useMutation({
        mutationFn: ({
            type,
            file,
        }: {
            type: StudentDocumentType;
            file: DocumentPicker.DocumentPickerAsset;
        }) => uploadStudentDocument(type, file),
        onSuccess: (document) => {
            queryClient.setQueryData<StudentDocument[]>(
                ['student-documents'],
                (current = []) => [
                    ...current.filter(
                        (item) => item.documentType !== document.documentType
                    ),
                    document,
                ]
            );
            toast.success('Document submitted for review');
        },
        onError: () => toast.error('Could not upload document'),
    });

    const handleUpload = async (type: StudentDocumentType) => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: false,
            type: ['image/*', 'application/pdf'],
        });
        if (result.canceled) return;
        upload.mutate({ type, file: result.assets[0] });
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={documents.isRefetching}
                        onRefresh={() => void documents.refetch()}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                <StudentRequestHeader
                    title="Personal documents"
                    subtitle="Upload and manage required identity documents"
                    color="#2563EB"
                />
                <View className="px-4 pt-5">
                    <View className="bg-blue-50 rounded-3xl p-4 flex-row items-start">
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={22}
                            color="#2563EB"
                        />
                        <View className="ml-3 flex-1">
                            <Text className="text-blue-900 text-sm font-bold">
                                Secure document upload
                            </Text>
                            <Text className="text-blue-700 text-xs font-medium leading-5 mt-1">
                                Upload a clear image or PDF. New files are
                                submitted as pending until dormitory staff
                                review them.
                            </Text>
                        </View>
                    </View>

                    {documents.isLoading ? (
                        <ActivityIndicator color="#2563EB" className="mt-8" />
                    ) : null}
                    {documents.isError ? (
                        <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-4">
                            <Text className="text-red-700 text-sm font-semibold">
                                Could not load your documents. Pull down to try
                                again.
                            </Text>
                        </View>
                    ) : null}
                    {documentDefinitions.map((definition) => (
                        <DocumentUploadCard
                            key={definition.type}
                            definition={definition}
                            document={documents.data?.find(
                                (item) => item.documentType === definition.type
                            )}
                            busy={upload.isPending}
                            onUpload={() => handleUpload(definition.type)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function DocumentUploadCard({
    definition,
    document,
    busy,
    onUpload,
}: {
    definition: (typeof documentDefinitions)[number];
    document?: StudentDocument;
    busy: boolean;
    onUpload: () => void;
}) {
    const status = document?.status || 'MISSING';
    const rejected = status === 'REJECTED';

    return (
        <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mt-4">
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center">
                    <Ionicons
                        name={definition.icon}
                        size={23}
                        color="#2563EB"
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {definition.title}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-medium leading-5 mt-1">
                        {definition.description}
                    </Text>
                </View>
                <StatusPill status={status} />
            </View>

            {document ? (
                <View className="bg-slate-50 rounded-2xl p-3 flex-row items-center mt-4">
                    <Ionicons
                        name="document-attach-outline"
                        size={19}
                        color="#64748B"
                    />
                    <Text
                        className="text-[#475569] text-xs font-bold ml-2 flex-1"
                        numberOfLines={1}
                    >
                        {document.fileUrl.split('/').pop() || 'Uploaded file'}
                    </Text>
                    <Ionicons
                        name={
                            document.status === 'APPROVED'
                                ? 'checkmark-circle'
                                : 'time-outline'
                        }
                        size={18}
                        color={
                            document.status === 'APPROVED'
                                ? '#16A34A'
                                : '#D97706'
                        }
                    />
                </View>
            ) : null}

            {rejected && document?.rejectReason ? (
                <View className="bg-red-50 rounded-2xl p-3 flex-row items-start mt-3">
                    <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color="#DC2626"
                    />
                    <Text className="text-red-700 text-xs font-medium leading-5 ml-2 flex-1">
                        {document.rejectReason}
                    </Text>
                </View>
            ) : null}

            <TouchableOpacity
                activeOpacity={0.75}
                disabled={busy}
                onPress={onUpload}
                className={`rounded-2xl py-3.5 items-center mt-4 flex-row justify-center ${busy ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
                {busy ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <Ionicons
                        name="cloud-upload-outline"
                        size={18}
                        color="white"
                    />
                )}
                <Text className="text-white text-sm font-bold ml-2">
                    {busy
                        ? 'Uploading...'
                        : document
                          ? 'Replace document'
                          : 'Upload document'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function StatusPill({
    status,
}: {
    status: StudentDocument['status'] | 'MISSING';
}) {
    const styles = {
        APPROVED: 'bg-green-100 text-green-700',
        PENDING: 'bg-amber-100 text-amber-700',
        REJECTED: 'bg-red-100 text-red-700',
        MISSING: 'bg-slate-100 text-slate-600',
    }[status];
    const label =
        status === 'MISSING'
            ? 'Missing'
            : `${status[0]}${status.slice(1).toLowerCase()}`;
    return (
        <View className={`rounded-full px-3 py-1.5 ${styles.split(' ')[0]}`}>
            <Text className={`text-[10px] font-bold ${styles.split(' ')[1]}`}>
                {label}
            </Text>
        </View>
    );
}
