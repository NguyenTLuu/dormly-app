import FeatureInfo from '@/components/FeatureInfo';
import { axiosClient } from '@/api/axiosClient';
import { useAuth } from '@/auth/AuthContext';
import { ManagerHeader } from '@/components/manager-dashboard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

type Kind = 'users' | 'roles' | 'permissions';
interface Row {
    id: string;
    [key: string]: unknown;
}
type Payload = Record<string, string | number | boolean | string[]>;
const kinds: Kind[] = ['users', 'roles', 'permissions'];
const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];
const normalized = (value: unknown) =>
    String(value)
        .replace(/^ROLE_/i, '')
        .toUpperCase();
export default function SystemAdministration() {
    const { hasRole, session } = useAuth();
    const router = useRouter();
    const cache = useQueryClient();
    const [kind, setKind] = useState<Kind>('users');
    const [editor, setEditor] = useState<{
        row: Row | null;
        value: Payload;
    } | null>(null);
    const [deleting, setDeleting] = useState<Row | null>(null);
    const [busy, setBusy] = useState(false);
    const data = useQuery({
        queryKey: ['system-administration'],
        enabled: hasRole('ADMIN'),
        queryFn: async () => {
            const responses = await Promise.all(
                kinds.map(async (resource) => {
                    const response = await axiosClient.get<{ result: Row[] }>(
                        '/api/' + resource
                    );
                    return [resource, response.data.result] as const;
                })
            );
            return Object.fromEntries(responses) as Record<Kind, Row[]>;
        },
    });
    const roles = (data.data?.roles ?? []).filter((row) =>
        ['USER', 'STAFF', 'ADMIN'].includes(normalized(row.name))
    );
    const rows = kind === 'roles' ? roles : (data.data?.[kind] ?? []);
    const label = (row: Row) =>
        String(
            row.fullName ||
                row.name ||
                row.code ||
                row.resource ||
                row.email ||
                row.id
        );
    const openEditor = (row: Row | null) => {
        const value: Payload = {};
        if (kind === 'users') {
            if (!row)
                Object.assign(value, {
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                });
            value.roles = row
                ? strings(row.roles).filter((name) =>
                      ['USER', 'STAFF', 'ADMIN'].includes(normalized(name))
                  )
                : [];
        } else if (kind === 'roles') {
            value.name = String(row?.name || '');
            value.permissionIds = (data.data?.permissions ?? [])
                .filter((item) =>
                    strings(row?.permissions).includes(String(item.code))
                )
                .map((item) => item.id);
        } else if (kind === 'permissions') {
            value.resource = String(row?.resource || '');
            value.action = String(row?.action || 'READ');
            value.roleIds = (data.data?.roles ?? [])
                .filter((item) =>
                    strings(row?.roles).includes(String(item.name))
                )
                .map((item) => item.id);
        }
        setEditor({ row, value });
    };
    const invalidate = async () => {
        await Promise.all(
            [
                ['system-administration'],
                ['admin-users'],
                ['manager-resident-users'],
                ['room-management'],
                ['admin-dashboard'],
                ['inactive-resident-accounts'],
            ].map((queryKey) => cache.invalidateQueries({ queryKey }))
        );
    };
    const save = async () => {
        if (!editor) return;
        const payload: Record<string, unknown> = { ...editor.value };
        for (const key of [
            'name',
            'fullName',
            'resource',
            'email',
            'phoneNumber',
        ])
            if (typeof payload[key] === 'string')
                payload[key] = String(payload[key]).trim();
        if (kind === 'users') {
            if (strings(payload.roles).length === 0)
                return toast.error('Choose at least one role');
            if (
                !editor.row &&
                (!String(payload.fullName) ||
                    String(payload.fullName).length > 255 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email)) ||
                    String(payload.password).length < 6 ||
                    String(payload.password).length > 20)
            )
                return toast.error(
                    'Enter name, valid email and a password of 6–20 characters'
                );
            if (
                payload.phoneNumber &&
                !/^\+?[0-9]{10,15}$/.test(String(payload.phoneNumber))
            )
                return toast.error('Invalid phone number');
            if (!payload.phoneNumber) delete payload.phoneNumber;
        } else {
            if (
                !String(
                    payload[kind === 'permissions' ? 'resource' : 'name'] || ''
                ).trim()
            )
                return toast.error('Complete required fields');
        }
        setBusy(true);
        try {
            if (editor.row)
                await axiosClient.put(
                    '/api/' + kind + '/' + editor.row.id,
                    payload
                );
            else await axiosClient.post('/api/' + kind, payload);
            setEditor(null);
            await invalidate();
            toast.success(
                kind === 'users' && !editor.row
                    ? 'Account created inactive. Activate it from Users when ready.'
                    : 'Configuration saved'
            );
        } catch {
            toast.error('Could not save. Check duplicates and linked records.');
        } finally {
            setBusy(false);
        }
    };
    const remove = async () => {
        if (!deleting) return;
        setBusy(true);
        try {
            await axiosClient.delete('/api/' + kind + '/' + deleting.id);
            setDeleting(null);
            await invalidate();
            toast.success('Deleted');
        } catch {
            toast.error('Could not delete. The record may still be in use.');
        } finally {
            setBusy(false);
        }
    };
    const change = (key: string, value: Payload[string]) =>
        setEditor((previous) =>
            previous
                ? { ...previous, value: { ...previous.value, [key]: value } }
                : previous
        );
    const choices = (
        key: string,
        options: { id: string; name: string }[],
        multiple = true
    ) => (
        <View key={key} className="gap-2">
            <Text className="font-bold text-slate-700">{key}</Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const selected = multiple
                        ? strings(editor?.value[key]).includes(option.id)
                        : editor?.value[key] === option.id;
                    return (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() =>
                                change(
                                    key,
                                    multiple
                                        ? selected
                                            ? strings(
                                                  editor?.value[key]
                                              ).filter((id) => id !== option.id)
                                            : [
                                                  ...strings(
                                                      editor?.value[key]
                                                  ),
                                                  option.id,
                                              ]
                                        : option.id
                                )
                            }
                            className={
                                selected
                                    ? 'bg-blue-600 rounded-xl p-2'
                                    : 'bg-slate-100 rounded-xl p-2'
                            }
                        >
                            <Text
                                className={
                                    selected ? 'text-white' : 'text-slate-700'
                                }
                            >
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
    if (!hasRole('ADMIN'))
        return <Text className="p-6">Admin access required.</Text>;
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title="System administration"
                subtitle="Accounts and configuration"
                onBack={() => router.back()}
            />
            <ScrollView
                className="px-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row flex-wrap gap-2 mb-4">
                    {kinds.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => setKind(item)}
                            className="bg-white rounded-xl p-3"
                        >
                            <Text
                                className={
                                    kind === item
                                        ? 'text-blue-700 font-bold'
                                        : 'text-slate-600'
                                }
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="mb-4">
                    <FeatureInfo
                        title={
                            kind === 'users'
                                ? 'Account management'
                                : kind === 'roles'
                                  ? 'Role permissions'
                                  : 'Permission management'
                        }
                        icon={
                            kind === 'users'
                                ? 'people-outline'
                                : 'shield-checkmark-outline'
                        }
                    >
                        {kind === 'users'
                            ? 'Create accounts and choose USER, STAFF or ADMIN roles. New accounts start inactive. Use account management to activate them; users should sign in again after their role changes.'
                            : kind === 'roles'
                              ? 'Choose an existing role, tap Edit and select its permissions. Save to update access for accounts assigned to that role.'
                              : 'Define a permission with a resource and an action such as READ or CREATE. The server generates its code. Assign permissions to roles from the Roles tab.'}
                    </FeatureInfo>
                </View>
                {kind === 'users' ? (
                    <TouchableOpacity
                        onPress={() => router.push('/(admin-console)/users')}
                    >
                        <Text className="text-blue-700 font-bold mb-3">
                            Manage account activation and deletion
                        </Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity onPress={() => void data.refetch()}>
                    <Text className="text-blue-700 mb-3">
                        {data.isFetching ? 'Loading...' : 'Refresh'}
                    </Text>
                </TouchableOpacity>
                {data.isError ? (
                    <Text className="text-red-700">
                        Could not load configuration. Refresh to retry.
                    </Text>
                ) : null}
                {data.data && kind !== 'roles' ? (
                    <TouchableOpacity
                        onPress={() => openEditor(null)}
                        className="bg-blue-600 rounded-xl p-3 mb-3"
                    >
                        <Text className="text-white font-bold">
                            Create {kind}
                        </Text>
                    </TouchableOpacity>
                ) : null}
                {rows.map((row) => {
                    const self = kind === 'users' && row.id === session?.userId;
                    return (
                        <View
                            key={row.id}
                            className="bg-white rounded-xl p-4 mb-3 gap-2"
                        >
                            <Text className="text-slate-800 font-bold">
                                {label(row)}
                            </Text>
                            <Text className="text-slate-500">
                                {String(row.email || row.code || '')}
                            </Text>
                            {kind === 'users' ? (
                                <Text>{strings(row.roles).join(', ')}</Text>
                            ) : null}
                            {!self ? (
                                <TouchableOpacity
                                    onPress={() => openEditor(row)}
                                >
                                    <Text className="text-blue-700">
                                        {kind === 'users'
                                            ? 'Edit roles'
                                            : 'Edit'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <FeatureInfo>
                                    Your own role is protected in this screen.
                                    Use another administrator to change it.
                                </FeatureInfo>
                            )}
                            {kind === 'permissions' ? (
                                <TouchableOpacity
                                    onPress={() => setDeleting(row)}
                                >
                                    <Text className="text-red-700">Delete</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    );
                })}
            </ScrollView>
            <Modal
                visible={editor !== null}
                onRequestClose={() => !busy && setEditor(null)}
                animationType="slide"
            >
                <ScrollView
                    className="bg-white px-5 pt-12"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 70, gap: 16 }}
                >
                    <Text className="text-xl font-bold">
                        {editor?.row ? 'Edit' : 'Create'} {kind}
                    </Text>
                    <FeatureInfo title="How to edit">
                        {kind === 'users'
                            ? 'Enter the account details and select at least one role. When editing an existing account, only its role membership changes.'
                            : kind === 'roles'
                              ? 'The role name is fixed. Tap permissions to select or remove them, then save.'
                              : 'Enter the resource name and choose an action. Save the permission, then configure role membership in Roles.'}
                    </FeatureInfo>
                    {editor &&
                        Object.entries(editor.value)
                            .filter(
                                ([key]) =>
                                    ![
                                        'roles',
                                        'roleIds',
                                        'permissionIds',
                                        'action',
                                    ].includes(key)
                            )
                            .map(([key, value]) => (
                                <View key={key}>
                                    <Text className="font-bold mb-2">
                                        {key}
                                    </Text>
                                    {typeof value === 'boolean' ? (
                                        <TouchableOpacity
                                            onPress={() => change(key, !value)}
                                        >
                                            <Text>
                                                {value ? 'Enabled' : 'Disabled'}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TextInput
                                            value={String(value)}
                                            editable={
                                                !busy &&
                                                !(
                                                    kind === 'roles' &&
                                                    key === 'name'
                                                )
                                            }
                                            onChangeText={(text) =>
                                                change(
                                                    key,
                                                    typeof value === 'number'
                                                        ? Number(text)
                                                        : text
                                                )
                                            }
                                            secureTextEntry={key === 'password'}
                                            autoCapitalize={
                                                key === 'email'
                                                    ? 'none'
                                                    : 'sentences'
                                            }
                                            className="border border-slate-200 rounded-xl p-3"
                                        />
                                    )}
                                </View>
                            ))}
                    {kind === 'users'
                        ? choices(
                              'roles',
                              roles.map((row) => ({
                                  id: String(row.name),
                                  name: normalized(row.name),
                              }))
                          )
                        : null}
                    {kind === 'permissions' ? (
                        <>
                            {choices(
                                'action',
                                [
                                    'READ',
                                    'CREATE',
                                    'UPDATE',
                                    'DELETE',
                                    'VIEW',
                                ].map((name) => ({ id: name, name })),
                                false
                            )}
                            {choices(
                                'roleIds',
                                roles.map((row) => ({
                                    id: row.id,
                                    name: String(row.name),
                                }))
                            )}
                        </>
                    ) : null}
                    {kind === 'roles'
                        ? choices(
                              'permissionIds',
                              (data.data?.permissions ?? []).map((row) => ({
                                  id: row.id,
                                  name: String(row.code),
                              }))
                          )
                        : null}
                    <TouchableOpacity
                        disabled={busy}
                        onPress={() => void save()}
                        className="bg-blue-600 rounded-xl p-3"
                    >
                        <Text className="text-white font-bold">
                            {busy ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={busy}
                        onPress={() => setEditor(null)}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
            <Modal
                transparent
                visible={deleting !== null}
                onRequestClose={() => !busy && setDeleting(null)}
            >
                <View className="flex-1 bg-black/40 justify-center p-6">
                    <View className="bg-white rounded-xl p-5 gap-4">
                        <Text>
                            Delete {deleting ? label(deleting) : ''}? This can
                            affect linked records.
                        </Text>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={() => void remove()}
                        >
                            <Text className="text-red-700">Confirm delete</Text>
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
