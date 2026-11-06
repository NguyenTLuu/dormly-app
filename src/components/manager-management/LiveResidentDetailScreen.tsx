import { ManagerHeader } from '@/components/manager-dashboard';
import type { ResidentDocument } from '@/types/managerResident';
import { getResidentProfileData } from '@/api/residentProfileApi';
import { useRoomManagement } from '@/hooks/useRoomManagement';
import { isResidentRole } from '@/utils/room-management';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import ResidentAssignments from './ResidentAssignments';
import ResidentContactEditor from './ResidentContactEditor';
import ResidentProfileSections from './ResidentProfileSections';
import ResidentDocumentPreview from './ResidentDocumentPreview';
import RoomAssignmentEditor from './RoomAssignmentEditor';
import {
    ManagementButton,
    ManagementQueryState,
} from './ManagementFormControls';

export default function LiveResidentDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const query = useRoomManagement();
    const profile = useQuery({
        queryKey: ['resident-profile', id],
        queryFn: () => getResidentProfileData(id),
        enabled: Boolean(id),
    });
    const data = query.data;
    const user = data?.users.find(
        (item) => item.id === id && isResidentRole(item.roles)
    );
    const [assigning, setAssigning] = useState(false);
    const [editing, setEditing] = useState(false);
    const [previewDocument, setPreviewDocument] =
        useState<ResidentDocument | null>(null);
    const refresh = () => {
        void query.refetch();
        void profile.refetch();
    };
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Resident Detail"
                subtitle="Resident information, documents and room history"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 36, gap: 14 }}
                refreshControl={
                    <RefreshControl
                        refreshing={query.isRefetching || profile.isRefetching}
                        onRefresh={refresh}
                        tintColor="#2563EB"
                    />
                }
            >
                <ManagementQueryState
                    loading={query.isLoading}
                    error={query.isError}
                    retry={() => void query.refetch()}
                />
                {!query.isLoading && !query.isError && !user ? (
                    <Text className="bg-white rounded-2xl p-5 text-slate-500">
                        Resident not found.
                    </Text>
                ) : null}
                {data && user ? (
                    <>
                        <View className="bg-white border border-slate-100 rounded-2xl p-5 gap-3">
                            <Text className="text-slate-800 text-xl font-bold">
                                {user.fullName}
                            </Text>
                            <Text className="text-slate-600">{user.email}</Text>
                            <Text className="text-slate-600">
                                Phone: {user.phoneNumber || 'Not provided'}
                            </Text>
                            <Text className="text-slate-600">
                                Gender: {user.gender || 'Not provided'}
                            </Text>
                            <Text className="text-slate-600">
                                Birth date:{' '}
                                {user.dateOfBirth?.slice(0, 10) ||
                                    'Not provided'}
                            </Text>
                            <Text className="text-slate-600">
                                Account: {user.isActive ? 'Active' : 'Inactive'}
                            </Text>
                            <ManagementButton
                                label="Edit contact"
                                onPress={() => setEditing(true)}
                            />
                            <ManagementButton
                                label="Assign / change room"
                                onPress={() => setAssigning(true)}
                                disabled={!user.isActive}
                            />
                        </View>
                        {profile.isLoading ? (
                            <Text className="text-slate-500 bg-white rounded-2xl p-4">
                                Loading academic profile and documents...
                            </Text>
                        ) : null}
                        {profile.isError ? (
                            <Text
                                className="text-red-700 bg-red-50 rounded-2xl p-4"
                                onPress={() => void profile.refetch()}
                            >
                                Could not load academic profile or documents.
                                Tap to retry.
                            </Text>
                        ) : null}
                        {profile.data ? (
                            <ResidentProfileSections
                                profile={profile.data}
                                onViewDocument={setPreviewDocument}
                            />
                        ) : null}
                        <Text className="text-slate-800 text-lg font-bold">
                            Room assignment history
                        </Text>
                        <ResidentAssignments
                            data={data}
                            assignments={data.assignments.filter(
                                (item) => item.userId === id
                            )}
                        />
                    </>
                ) : null}
            </ScrollView>
            {data && user && assigning ? (
                <RoomAssignmentEditor
                    data={data}
                    initialUserId={id}
                    onClose={() => setAssigning(false)}
                />
            ) : null}
            {user && editing ? (
                <ResidentContactEditor
                    user={user}
                    onClose={() => setEditing(false)}
                />
            ) : null}
            <ResidentDocumentPreview
                document={previewDocument}
                onClose={() => setPreviewDocument(null)}
            />
        </View>
    );
}
