import {
    getResidentDocuments,
    getResidentUsers,
    toggleResidentAccount,
    updateResidentDocumentStatus,
} from '@/api/managerResidentApi';
import { ManagerHeader } from '@/components/manager-dashboard';
import ResidentDocumentPreview from '@/components/manager-management/ResidentDocumentPreview';
import type {
    ResidentDocumentItem,
    ResidentDocumentStatus,
    ResidentUser,
} from '@/types/managerResident';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

type ResidentTab = 'accounts' | 'documents';
type AccountStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
type DocumentStatusFilter = 'ALL' | ResidentDocumentStatus;

const documentStatuses: DocumentStatusFilter[] = [
    'ALL',
    'PENDING',
    'APPROVED',
    'REJECTED',
];

export default function ResidentScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<ResidentTab>('accounts');
    const [accountQuery, setAccountQuery] = useState('');
    const [accountStatus, setAccountStatus] =
        useState<AccountStatusFilter>('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [documentQuery, setDocumentQuery] = useState('');
    const [documentStatus, setDocumentStatus] =
        useState<DocumentStatusFilter>('PENDING');
    const [documentType, setDocumentType] = useState('ALL');
    const [rejectingDocument, setRejectingDocument] =
        useState<ResidentDocumentItem | null>(null);
    const [previewDocument, setPreviewDocument] =
        useState<ResidentDocumentItem | null>(null);
    const [viewedDocuments, setViewedDocuments] = useState<Set<string>>(
        () => new Set()
    );
    const queryClient = useQueryClient();
    const users = useQuery({
        queryKey: ['manager-resident-users'],
        queryFn: getResidentUsers,
    });
    const documents = useQuery({
        queryKey: ['manager-resident-documents'],
        queryFn: getResidentDocuments,
    });
    const refresh = () =>
        Promise.all([
            queryClient.invalidateQueries({
                queryKey: ['manager-resident-users'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['manager-resident-documents'],
            }),
            queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
            queryClient.invalidateQueries({
                queryKey: ['inactive-resident-accounts'],
            }),
        ]);
    const toggleAccount = useMutation({
        mutationFn: toggleResidentAccount,
        onSuccess: (user) => {
            toast.success(
                user.isActive ? 'Account activated' : 'Account deactivated'
            );
            void refresh();
        },
        onError: () => toast.error('Could not update account status'),
    });
    const updateDocument = useMutation({
        mutationFn: updateResidentDocumentStatus,
        onSuccess: (_, input) => {
            setRejectingDocument(null);
            toast.success(
                input.status === 'APPROVED'
                    ? 'Document approved'
                    : 'Document rejected'
            );
            void refresh();
        },
        onError: () => toast.error('Could not update document status'),
    });

    const roles = useMemo(
        () => [
            'ALL',
            ...Array.from(
                new Set(
                    (users.data ?? []).flatMap((user) =>
                        user.roles.map(normalizeRole)
                    )
                )
            ),
        ],
        [users.data]
    );
    const documentTypes = useMemo(
        () => [
            'ALL',
            ...Array.from(
                new Set((documents.data ?? []).map((item) => item.documentType))
            ),
        ],
        [documents.data]
    );
    const accountItems = useMemo(() => {
        const keyword = accountQuery.trim().toLowerCase();
        return (users.data ?? []).filter((user) => {
            const matchesQuery =
                !keyword ||
                [
                    user.fullName,
                    user.email,
                    user.phoneNumber,
                    user.roles.join(' '),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(keyword);
            const matchesStatus =
                accountStatus === 'ALL' ||
                (accountStatus === 'ACTIVE' ? user.isActive : !user.isActive);
            const matchesRole =
                roleFilter === 'ALL' ||
                user.roles.map(normalizeRole).includes(roleFilter);
            return matchesQuery && matchesStatus && matchesRole;
        });
    }, [accountQuery, accountStatus, roleFilter, users.data]);
    const documentItems = useMemo(() => {
        const keyword = documentQuery.trim().toLowerCase();
        return (documents.data ?? []).filter((document) => {
            const matchesQuery =
                !keyword ||
                [
                    document.residentName,
                    document.residentEmail,
                    document.documentType,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(keyword);
            return (
                (documentStatus === 'ALL' ||
                    document.status === documentStatus) &&
                (documentType === 'ALL' ||
                    document.documentType === documentType) &&
                matchesQuery
            );
        });
    }, [documentQuery, documentStatus, documentType, documents.data]);
    const activeQuery = tab === 'accounts' ? users : documents;

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="Residents"
                subtitle="Manage accounts and verify resident documents"
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={activeQuery.isRefetching}
                        onRefresh={() => void refresh()}
                        tintColor={tab === 'accounts' ? '#2563EB' : '#7C3AED'}
                        colors={[tab === 'accounts' ? '#2563EB' : '#7C3AED']}
                    />
                }
            >
                <ResidentTabs value={tab} onChange={setTab} />
                {tab === 'accounts' ? (
                    <>
                        <SearchField
                            value={accountQuery}
                            onChangeText={setAccountQuery}
                            placeholder="Search name, email, phone or role"
                            accent="#2563EB"
                        />
                        <FilterChips
                            label="Account status"
                            values={['ALL', 'ACTIVE', 'INACTIVE']}
                            selected={accountStatus}
                            onChange={(value) =>
                                setAccountStatus(value as AccountStatusFilter)
                            }
                            palette={accountPalette}
                        />
                        <FilterChips
                            label="Role"
                            values={roles}
                            selected={roleFilter}
                            onChange={setRoleFilter}
                            palette={rolePalette}
                        />
                        <SectionTitle
                            label={`Accounts (${accountItems.length})`}
                        />
                        {users.isLoading ? <Loading /> : null}
                        {users.isError ? (
                            <LoadError label="Could not load resident accounts." />
                        ) : null}
                        <View className="gap-3">
                            {accountItems.map((user) => (
                                <AccountCard
                                    key={user.id}
                                    user={user}
                                    busy={toggleAccount.isPending}
                                    onToggle={() =>
                                        toggleAccount.mutate(user.id)
                                    }
                                    onOpen={() =>
                                        router.push({
                                            pathname:
                                                '/manager-details/student/[id]',
                                            params: { id: user.id },
                                        })
                                    }
                                />
                            ))}
                            {!users.isLoading &&
                            !users.isError &&
                            accountItems.length === 0 ? (
                                <EmptyState
                                    label="No accounts match these filters."
                                    icon="people-outline"
                                />
                            ) : null}
                        </View>
                    </>
                ) : (
                    <>
                        <SearchField
                            value={documentQuery}
                            onChangeText={setDocumentQuery}
                            placeholder="Search resident or document type"
                            accent="#7C3AED"
                        />
                        <FilterChips
                            label="Review status"
                            values={documentStatuses}
                            selected={documentStatus}
                            onChange={(value) =>
                                setDocumentStatus(value as DocumentStatusFilter)
                            }
                            palette={documentStatusPalette}
                        />
                        <FilterChips
                            label="Document type"
                            values={documentTypes}
                            selected={documentType}
                            onChange={setDocumentType}
                            palette={documentTypePalette}
                        />
                        <SectionTitle
                            label={`Documents (${documentItems.length})`}
                        />
                        {documents.isLoading ? (
                            <Loading color="#7C3AED" />
                        ) : null}
                        {documents.isError ? (
                            <LoadError label="Could not load resident documents." />
                        ) : null}
                        <View className="gap-3">
                            {documentItems.map((document) => (
                                <DocumentCard
                                    key={document.id}
                                    document={document}
                                    busy={updateDocument.isPending}
                                    reviewed={viewedDocuments.has(
                                        `${document.id}:${document.fileUrl}`
                                    )}
                                    onView={() => setPreviewDocument(document)}
                                    onApprove={() =>
                                        updateDocument.mutate({
                                            id: document.id,
                                            status: 'APPROVED',
                                        })
                                    }
                                    onReject={() =>
                                        setRejectingDocument(document)
                                    }
                                />
                            ))}
                            {!documents.isLoading &&
                            !documents.isError &&
                            documentItems.length === 0 ? (
                                <EmptyState
                                    label="No documents match these filters."
                                    icon="document-text-outline"
                                />
                            ) : null}
                        </View>
                    </>
                )}
            </ScrollView>
            <RejectDocumentModal
                document={rejectingDocument}
                busy={updateDocument.isPending}
                onClose={() => setRejectingDocument(null)}
                onConfirm={(reason) =>
                    rejectingDocument &&
                    updateDocument.mutate({
                        id: rejectingDocument.id,
                        status: 'REJECTED',
                        rejectReason: reason,
                    })
                }
            />
            <ResidentDocumentPreview
                document={previewDocument}
                onClose={() => setPreviewDocument(null)}
                onViewed={(item) =>
                    setViewedDocuments((current) =>
                        new Set(current).add(`${item.id}:${item.fileUrl}`)
                    )
                }
            />
        </View>
    );
}

function ResidentTabs({
    value,
    onChange,
}: {
    value: ResidentTab;
    onChange: (value: ResidentTab) => void;
}) {
    const tabs: {
        value: ResidentTab;
        label: string;
        icon: keyof typeof Ionicons.glyphMap;
        color: string;
    }[] = [
        {
            value: 'accounts',
            label: 'Accounts',
            icon: 'people-outline',
            color: '#2563EB',
        },
        {
            value: 'documents',
            label: 'Documents',
            icon: 'document-text-outline',
            color: '#7C3AED',
        },
    ];
    return (
        <View className="bg-white rounded-2xl p-1.5 flex-row border border-slate-100">
            {tabs.map((tab) => {
                const active = value === tab.value;
                return (
                    <TouchableOpacity
                        key={tab.value}
                        onPress={() => onChange(tab.value)}
                        className="flex-1 rounded-xl py-3 flex-row items-center justify-center"
                        style={{
                            backgroundColor: active ? tab.color : 'transparent',
                        }}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={18}
                            color={active ? '#FFFFFF' : tab.color}
                        />
                        <Text
                            className="ml-2 font-bold"
                            style={{ color: active ? '#FFFFFF' : tab.color }}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function SearchField({
    value,
    onChangeText,
    placeholder,
    accent,
}: {
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    accent: string;
}) {
    return (
        <View className="bg-white rounded-2xl px-3 py-1.5 mt-4 border border-slate-100 flex-row items-center">
            <Ionicons name="search-outline" size={21} color={accent} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-2 py-2.5 text-[#1E293B]"
            />
        </View>
    );
}

function FilterChips({
    label,
    values,
    selected,
    onChange,
    palette,
}: {
    label: string;
    values: string[];
    selected: string;
    onChange: (value: string) => void;
    palette: (value: string) => {
        background: string;
        border: string;
        text: string;
    };
}) {
    return (
        <View className="mt-4">
            <Text className="text-[#475569] text-xs font-bold mb-2">
                {label}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                    {values.map((value) => {
                        const colors = palette(value);
                        const active = selected === value;
                        return (
                            <TouchableOpacity
                                key={value}
                                onPress={() => onChange(value)}
                                className="rounded-full px-3 py-2 border"
                                style={{
                                    backgroundColor: active
                                        ? colors.background
                                        : '#FFFFFF',
                                    borderColor: active
                                        ? colors.border
                                        : '#E2E8F0',
                                }}
                            >
                                <Text
                                    className="text-xs font-bold"
                                    style={{
                                        color: active ? colors.text : '#64748B',
                                    }}
                                >
                                    {formatLabel(value)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

function SectionTitle({ label }: { label: string }) {
    return (
        <Text className="text-[#1E293B] text-lg font-bold mt-5 mb-3">
            {label}
        </Text>
    );
}

function AccountCard({
    user,
    busy,
    onToggle,
    onOpen,
}: {
    user: ResidentUser;
    busy: boolean;
    onToggle: () => void;
    onOpen: () => void;
}) {
    const role = normalizeRole(user.roles[0]);
    const status = user.isActive
        ? accountPalette('ACTIVE')
        : accountPalette('INACTIVE');
    return (
        <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                    <Ionicons name="person-outline" size={23} color="#2563EB" />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {user.fullName || 'Unnamed resident'}
                    </Text>
                    <Text className="text-[#64748B] text-sm mt-1">
                        {user.email}
                    </Text>
                    {user.phoneNumber ? (
                        <Text className="text-[#64748B] text-xs mt-1">
                            {user.phoneNumber}
                        </Text>
                    ) : null}
                </View>
                <View className="items-end gap-2">
                    <Badge label={role} palette={rolePalette(role)} />
                    <Badge
                        label={user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        palette={status}
                    />
                </View>
            </View>
            <View className="border-t border-slate-100 mt-4 pt-3 flex-row items-center justify-between">
                <Text className="text-[#64748B] text-xs">
                    {user.createdAt
                        ? `Created ${formatDate(user.createdAt)}`
                        : 'Account information'}
                </Text>
                <TouchableOpacity
                    disabled={busy}
                    onPress={onToggle}
                    className="rounded-xl px-3 py-2"
                    style={{
                        backgroundColor: user.isActive ? '#FEF2F2' : '#DCFCE7',
                    }}
                >
                    <Text
                        className="text-xs font-bold"
                        style={{ color: user.isActive ? '#DC2626' : '#15803D' }}
                    >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                    </Text>
                </TouchableOpacity>
            </View>
            {user.roles.map(normalizeRole).includes('USER') ? (
                <TouchableOpacity
                    onPress={onOpen}
                    className="items-center rounded-xl bg-blue-50 py-2.5 mt-3"
                >
                    <Text className="text-blue-700 font-bold">
                        View resident profile
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

function DocumentCard({
    document,
    busy,
    reviewed,
    onView,
    onApprove,
    onReject,
}: {
    document: ResidentDocumentItem;
    busy: boolean;
    reviewed: boolean;
    onView: () => void;
    onApprove: () => void;
    onReject: () => void;
}) {
    const status = documentStatusPalette(document.status);
    return (
        <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <View className="flex-row items-start">
                <View className="w-11 h-11 rounded-xl bg-purple-50 items-center justify-center">
                    <Ionicons
                        name="document-outline"
                        size={22}
                        color="#7C3AED"
                    />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {document.residentName}
                    </Text>
                    <Text className="text-[#64748B] text-xs mt-1">
                        {document.residentEmail}
                    </Text>
                    <Text className="text-[#7C3AED] text-xs font-bold mt-2">
                        {formatLabel(document.documentType)}
                    </Text>
                </View>
                <Badge label={formatLabel(document.status)} palette={status} />
            </View>
            {document.rejectReason ? (
                <Text className="text-red-700 text-xs font-semibold bg-red-50 rounded-xl p-2.5 mt-3">
                    Reason: {document.rejectReason}
                </Text>
            ) : null}
            <TouchableOpacity
                onPress={onView}
                accessibilityRole="button"
                accessibilityLabel={`View ${formatLabel(document.documentType)} for ${document.residentName}`}
                className="mt-4 rounded-xl bg-blue-50 px-4 py-3 flex-row items-center justify-center gap-2"
            >
                <Ionicons name="eye-outline" size={18} color="#1D4ED8" />
                <Text className="text-blue-700 font-bold">View file</Text>
            </TouchableOpacity>
            {document.status === 'PENDING' && !reviewed ? (
                <Text className="text-amber-700 text-xs mt-2">
                    View the file before making a review decision.
                </Text>
            ) : null}
            <View className="border-t border-slate-100 mt-4 pt-3 flex-row items-center justify-between">
                <Text className="text-[#64748B] text-xs">
                    {document.createdAt
                        ? `Submitted ${formatDate(document.createdAt)}`
                        : 'Document submission'}
                </Text>
                {document.status === 'PENDING' ? (
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            disabled={busy || !reviewed}
                            onPress={onReject}
                            className={`rounded-xl bg-red-50 px-3 py-2 ${busy || !reviewed ? 'opacity-40' : ''}`}
                        >
                            <Text className="text-red-600 text-xs font-bold">
                                Reject
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={busy || !reviewed}
                            onPress={onApprove}
                            className={`rounded-xl bg-emerald-50 px-3 py-2 ${busy || !reviewed ? 'opacity-40' : ''}`}
                        >
                            <Text className="text-emerald-700 text-xs font-bold">
                                Approve
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

function Badge({
    label,
    palette,
}: {
    label: string;
    palette: { background: string; border: string; text: string };
}) {
    return (
        <View
            className="rounded-full px-2.5 py-1 border"
            style={{
                backgroundColor: palette.background,
                borderColor: palette.border,
            }}
        >
            <Text
                className="text-[10px] font-bold"
                style={{ color: palette.text }}
            >
                {label}
            </Text>
        </View>
    );
}

function RejectDocumentModal({
    document,
    busy,
    onClose,
    onConfirm,
}: {
    document: ResidentDocumentItem | null;
    busy: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) {
    const [reason, setReason] = useState('');
    return (
        <Modal
            visible={Boolean(document)}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-slate-900/40 items-center justify-center px-6">
                <View className="bg-white rounded-3xl w-full p-5">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        Reject document
                    </Text>
                    <Text className="text-[#64748B] text-sm mt-1">
                        Give {document?.residentName || 'this resident'} a
                        reason for replacing the file.
                    </Text>
                    <TextInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Rejection reason"
                        placeholderTextColor="#94A3B8"
                        multiline
                        className="mt-4 min-h-24 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-3 text-[#1E293B]"
                        textAlignVertical="top"
                    />
                    <View className="flex-row gap-3 mt-4">
                        <TouchableOpacity
                            onPress={() => {
                                setReason('');
                                onClose();
                            }}
                            className="flex-1 rounded-xl border border-slate-200 py-3 items-center"
                        >
                            <Text className="text-slate-600 font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={busy || !reason.trim()}
                            onPress={() => {
                                onConfirm(reason.trim());
                                setReason('');
                            }}
                            className="flex-1 rounded-xl bg-red-600 py-3 items-center"
                        >
                            <Text className="text-white font-bold">Reject</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function Loading({ color = '#2563EB' }: { color?: string }) {
    return <ActivityIndicator color={color} className="mt-6" />;
}
function LoadError({ label }: { label: string }) {
    return (
        <View className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <Text className="text-red-700 text-sm font-semibold">{label}</Text>
        </View>
    );
}
function EmptyState({
    label,
    icon,
}: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <View className="bg-white rounded-2xl border border-dashed border-slate-300 p-7 items-center">
            <Ionicons name={icon} size={32} color="#94A3B8" />
            <Text className="text-[#64748B] text-sm font-semibold mt-2">
                {label}
            </Text>
        </View>
    );
}
function normalizeRole(role?: string) {
    return (role || 'USER').replace(/^ROLE_/, '').toUpperCase();
}
function formatLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
function accountPalette(value: string) {
    return value === 'ACTIVE'
        ? { background: '#DCFCE7', border: '#86EFAC', text: '#15803D' }
        : value === 'INACTIVE'
          ? { background: '#FEE2E2', border: '#FCA5A5', text: '#B91C1C' }
          : { background: '#E0F2FE', border: '#7DD3FC', text: '#0369A1' };
}
function rolePalette(value: string) {
    return value === 'ADMIN'
        ? { background: '#FEE2E2', border: '#FCA5A5', text: '#B91C1C' }
        : value === 'STAFF'
          ? { background: '#F3E8FF', border: '#D8B4FE', text: '#7E22CE' }
          : value === 'USER'
            ? { background: '#E0F2FE', border: '#7DD3FC', text: '#0369A1' }
            : { background: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
}
function documentStatusPalette(value: string) {
    return value === 'APPROVED'
        ? { background: '#DCFCE7', border: '#86EFAC', text: '#15803D' }
        : value === 'REJECTED'
          ? { background: '#FEE2E2', border: '#FCA5A5', text: '#B91C1C' }
          : value === 'PENDING'
            ? { background: '#FEF3C7', border: '#FCD34D', text: '#A16207' }
            : { background: '#F3E8FF', border: '#D8B4FE', text: '#7E22CE' };
}
function documentTypePalette(value: string) {
    return value === 'ALL'
        ? { background: '#F3E8FF', border: '#D8B4FE', text: '#7E22CE' }
        : { background: '#F8FAFC', border: '#CBD5E1', text: '#475569' };
}
