import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import {
    getStudentAcademicProfile,
    getStudentDocuments,
    getStudentUserProfile,
    updateStudentUserProfile,
} from '@/api/studentProfileApi';
import { useAuth } from '@/auth/AuthContext';
import ActionRow from '@/components/ActionRow';
import InfoRow from '@/components/InfoRow';
import SectionCard from '@/components/SectionCard';
import StatusBadge from '@/components/StatusBadge';
import {
    StudentProfileEditModal,
    StudentProfileForm,
} from '@/components/student-profile';
import { useStudentRoomOverview } from '@/hooks/useStudentRoomOverview';
import type {
    StudentDocument,
    StudentDocumentType,
} from '@/types/studentProfile';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { session, signOut } = useAuth();
    const queryClient = useQueryClient();
    const userProfile = useQuery({
        queryKey: ['student-user-profile', session?.userId],
        queryFn: () => getStudentUserProfile(session!.userId),
        enabled: Boolean(session?.userId),
    });
    const academicProfile = useQuery({
        queryKey: ['student-academic-profile'],
        queryFn: getStudentAcademicProfile,
        enabled: Boolean(session?.userId),
    });
    const documents = useQuery({
        queryKey: ['student-documents'],
        queryFn: getStudentDocuments,
        enabled: Boolean(session?.userId),
    });
    const roomOverview = useStudentRoomOverview();
    const [profileData, setProfileData] = useState<StudentProfileForm>({
        fullName: session?.fullName || '',
        studentId: '',
        email: session?.email || '',
        phone: '',
        dob: '',
        major: '',
    });
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState(profileData);

    useEffect(() => {
        const nextProfile: StudentProfileForm = {
            fullName: userProfile.data?.fullName || session?.fullName || '',
            studentId: academicProfile.data?.studentCode || '',
            email: userProfile.data?.email || session?.email || '',
            phone: userProfile.data?.phoneNumber || '',
            dob: formatDateOfBirth(userProfile.data?.dateOfBirth),
            major: academicProfile.data?.major || '',
        };
        setProfileData(nextProfile);
        if (!isEditModalVisible) setEditForm(nextProfile);
    }, [
        academicProfile.data,
        isEditModalVisible,
        session?.email,
        session?.fullName,
        userProfile.data,
    ]);

    const updateProfile = useMutation({
        mutationFn: () =>
            updateStudentUserProfile(session!.userId, {
                email: editForm.email.trim(),
                fullName: profileData.fullName,
                phoneNumber: editForm.phone.trim() || null,
                dateOfBirth: toApiDateTime(editForm.dob),
            }),
        onSuccess: (updatedUser) => {
            const nextProfile = {
                ...profileData,
                fullName: updatedUser.fullName || profileData.fullName,
                email: updatedUser.email,
                phone: updatedUser.phoneNumber || '',
                dob: formatDateOfBirth(updatedUser.dateOfBirth),
            };
            setProfileData(nextProfile);
            setEditForm(nextProfile);
            setEditModalVisible(false);
            queryClient.setQueryData(
                ['student-user-profile', session?.userId],
                updatedUser
            );
            toast.success('Profile information updated');
        },
        onError: () => toast.error('Could not update profile information'),
    });

    const handleOpenEdit = () => {
        setEditForm(profileData);
        setEditModalVisible(true);
    };

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-white flex-1 relative">
                <View
                    className="bg-blue-600 rounded-b-2xl px-8"
                    style={{ paddingTop: insets.top + 16, paddingBottom: 50 }}
                >
                    <Text className="text-white text-2xl font-bold">
                        Profile
                    </Text>
                    <Text className="text-white">Manage your information</Text>
                </View>
                <View className="mx-4 p-4 bg-white -mt-10 shadow-xl border-gray-900 flex-row items-center rounded-2xl">
                    <View className="w-28 h-28 rounded-full items-center justify-center relative">
                        <Image
                            source={require('@/assets/icons/user-icon.png')}
                            style={{ width: '80%', height: '80%' }}
                            contentFit="cover"
                        />
                        <View className="justify-center items-center border-white border-2 bg-slate-400 absolute bottom-3 right-2 w-8 h-8 rounded-full">
                            <FontAwesome
                                name="camera"
                                size={14}
                                color="white"
                            />
                        </View>
                    </View>
                    <View className="flex-1 flex-col gap-2 ml-2">
                        <Text className="font-bold text-xl">
                            {profileData.fullName || 'Loading profile...'}
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            Student ID: {profileData.studentId || '-'}
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            {profileData.major || '-'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-2 p-2 border border-blue-500 rounded-xl"
                        onPress={handleOpenEdit}
                        disabled={userProfile.isLoading}
                    >
                        <FontAwesome6 name="pencil" size={16} color="#3b82f6" />
                        <Text className="font-medium text-sm text-blue-500">
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Personal Information</Text>
                    <View className="px-2">
                        <InfoRow
                            label="Full name"
                            value={profileData.fullName || '-'}
                        >
                            <FontAwesome5 name="user" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label="Student ID"
                            value={profileData.studentId || '-'}
                        >
                            <AntDesign name="idcard" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label="Faculty"
                            value={profileData.major || '-'}
                        >
                            <Entypo
                                name="graduation-cap"
                                size={22}
                                color="black"
                            />
                        </InfoRow>
                        <InfoRow
                            label="Phone number"
                            value={profileData.phone || '-'}
                        >
                            <Feather name="phone" size={20} color="black" />
                        </InfoRow>
                        <InfoRow
                            label="Email"
                            value={profileData.email || '-'}
                            isLast
                        >
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={20}
                                color="black"
                            />
                        </InfoRow>
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Current Room</Text>
                    <View className="flex-row mt-2 items-center">
                        <View className="w-16 h-16 rounded-full bg-blue-200 items-center justify-center">
                            <Image
                                source={require('@/assets/icons/door-icon.png')}
                                style={{ width: '70%', height: '70%' }}
                                contentFit="cover"
                            />
                        </View>
                        <View className="flex-col ml-4 flex-1">
                            <Text className="font-bold text-xl">
                                {roomOverview.data?.roomName ||
                                    (roomOverview.isLoading
                                        ? 'Loading room...'
                                        : 'No room assigned')}
                            </Text>
                            <Text className="font-medium text-gray-400">
                                Floor {roomOverview.data?.floor || '-'} · Block{' '}
                                {roomOverview.data?.block || '-'}
                            </Text>
                        </View>
                        <Link href="/room" asChild>
                            <TouchableOpacity className="p-2 rounded-xl border-blue-500 border">
                                <Text className="text-blue-500 font-medium text-sm">
                                    View Detail
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Personal Documents</Text>
                    <View className="px-2">
                        <DocumentRow
                            label="Citizen ID — Front"
                            type="CCCD_FRONT"
                            icon={
                                <FontAwesome
                                    name="id-card-o"
                                    size={18}
                                    color="black"
                                />
                            }
                            documents={documents.data}
                            router={router}
                        />
                        <DocumentRow
                            label="Citizen ID — Back"
                            type="CCCD_BACK"
                            icon={
                                <FontAwesome
                                    name="id-card-o"
                                    size={18}
                                    color="black"
                                />
                            }
                            documents={documents.data}
                            router={router}
                        />
                        <DocumentRow
                            label="Temporary Residence"
                            type="TEMPORARY_RESIDENCE"
                            icon={
                                <MaterialCommunityIcons
                                    name="home-city-outline"
                                    size={18}
                                    color="black"
                                />
                            }
                            documents={documents.data}
                            router={router}
                            isLast
                        />
                    </View>
                </SectionCard>

                <SectionCard className="mt-4 mx-4 flex-col">
                    <Text className="font-bold">Account Settings</Text>
                    <View className="px-2">
                        <ActionRow
                            label="Change Password"
                            onPress={() =>
                                router.push(
                                    '/student-profile-details/change-password'
                                )
                            }
                        >
                            <SimpleLineIcons
                                name="lock"
                                size={20}
                                color="black"
                                style={{ marginRight: 10 }}
                            />
                        </ActionRow>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row items-center py-3.5"
                            onPress={() => void signOut()}
                        >
                            <View className="w-8 items-start justify-center">
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={20}
                                    color="red"
                                />
                            </View>
                            <Text className="flex-1 text-sm font-medium text-red-500">
                                Log out
                            </Text>
                            <Entypo
                                name="chevron-right"
                                size={20}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>
                </SectionCard>
                <StudentProfileEditModal
                    visible={isEditModalVisible}
                    form={editForm}
                    onChange={setEditForm}
                    onClose={() => setEditModalVisible(false)}
                    onSave={() => updateProfile.mutate()}
                    pending={updateProfile.isPending}
                />
            </ScrollView>
        </>
    );
}

function DocumentRow({
    label,
    type,
    icon,
    documents,
    router,
    isLast = false,
}: {
    label: string;
    type: StudentDocumentType;
    icon: React.ReactNode;
    documents?: StudentDocument[];
    router: ReturnType<typeof useRouter>;
    isLast?: boolean;
}) {
    const document = documents?.find((item) => item.documentType === type);
    return (
        <ActionRow
            label={label}
            onPress={() => router.push('/student-profile-details/documents')}
            rightElement={<DocumentStatusBadge document={document} />}
            isLast={isLast}
        >
            {icon}
        </ActionRow>
    );
}

function DocumentStatusBadge({ document }: { document?: StudentDocument }) {
    if (!document) return <StatusBadge text="Missing" type="warning" />;
    if (document.status === 'APPROVED')
        return <StatusBadge text="Approved" type="success" />;
    if (document.status === 'REJECTED')
        return <StatusBadge text="Rejected" type="danger" />;
    return <StatusBadge text="Pending" type="warning" />;
}

function formatDateOfBirth(value?: string | null) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return [
        String(date.getDate()).padStart(2, '0'),
        String(date.getMonth() + 1).padStart(2, '0'),
        date.getFullYear(),
    ].join('/');
}

function toApiDateTime(value: string) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) return null;
    const [, day, month, year] = match;
    return `${year}-${month}-${day}T00:00:00`;
}
