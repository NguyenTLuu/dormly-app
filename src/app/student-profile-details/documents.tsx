import { StudentRequestHeader } from '@/components/student-requests';
import {
    studentProfileDocuments,
    UploadedStudentDocument,
} from '@/data/student-profile';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function StudentDocumentsScreen() {
    const [documents, setDocuments] = useState<UploadedStudentDocument[]>([
        ...studentProfileDocuments,
    ]);

    const handleUpload = async (documentId: UploadedStudentDocument['id']) => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: false,
            type: ['image/*', 'application/pdf'],
        });

        if (result.canceled) return;

        const file = result.assets[0];
        setDocuments((current) =>
            current.map((document) =>
                document.id === documentId
                    ? {
                          ...document,
                          status: 'Uploaded',
                          fileName: file.name,
                          uri: file.uri,
                      }
                    : document
            )
        );
        toast.success('Document uploaded', {
            description: file.name,
        });
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
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
                                Upload clear images or PDF files. Documents stay
                                mock-local in this prototype.
                            </Text>
                        </View>
                    </View>

                    {documents.map((document) => (
                        <DocumentUploadCard
                            key={document.id}
                            document={document}
                            onUpload={() => handleUpload(document.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function DocumentUploadCard({
    document,
    onUpload,
}: {
    document: UploadedStudentDocument;
    onUpload: () => void;
}) {
    const uploaded = document.status === 'Uploaded';

    return (
        <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mt-4">
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center">
                    <Ionicons
                        name={
                            document.id === 'citizen-id'
                                ? 'id-card-outline'
                                : 'home-outline'
                        }
                        size={23}
                        color="#2563EB"
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {document.title}
                    </Text>
                    <Text className="text-[#64748B] text-xs font-medium leading-5 mt-1">
                        {document.description}
                    </Text>
                </View>
                <View
                    className={`rounded-full px-3 py-1.5 ${
                        uploaded ? 'bg-green-100' : 'bg-amber-100'
                    }`}
                >
                    <Text
                        className={`text-[10px] font-bold ${
                            uploaded ? 'text-green-700' : 'text-amber-700'
                        }`}
                    >
                        {document.status}
                    </Text>
                </View>
            </View>

            {document.fileName && (
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
                        {document.fileName}
                    </Text>
                    <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16A34A"
                    />
                </View>
            )}

            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onUpload}
                className="bg-blue-600 rounded-2xl py-3.5 items-center mt-4 flex-row justify-center"
            >
                <Ionicons name="cloud-upload-outline" size={18} color="white" />
                <Text className="text-white text-sm font-bold ml-2">
                    {uploaded ? 'Replace document' : 'Upload document'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
