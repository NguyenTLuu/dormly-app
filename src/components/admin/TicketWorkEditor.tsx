import {
    getAdminUsers,
    updateTicketAssignees,
    updateTicketDueDate,
} from '@/api/adminApi';
import type { AdminTicketDetail } from '@/types/admin';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function TicketWorkEditor({
    ticket,
    onSaved,
}: {
    ticket: AdminTicketDetail;
    onSaved: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
    const users = useQuery({
        queryKey: ['ticket-staff-options'],
        queryFn: getAdminUsers,
        enabled: editing,
    });
    const staff = (users.data ?? []).filter((user) =>
        user.roles.some((role) =>
            ['ADMIN', 'STAFF'].includes(
                role.toUpperCase().replace(/^ROLE_/, '')
            )
        )
    );
    const saveDate = useMutation({
        mutationFn: () =>
            updateTicketDueDate(ticket.id, dueDate.trim() || null),
        onSuccess: () => {
            toast.success('Due date updated');
            onSaved();
        },
        onError: () => toast.error('Could not update due date'),
    });
    const saveAssignees = useMutation({
        mutationFn: () => updateTicketAssignees(ticket.id, assigneeIds),
        onSuccess: () => {
            toast.success('Assigned staff updated');
            onSaved();
        },
        onError: () => toast.error('Could not update assigned staff'),
    });
    const busy = saveDate.isPending || saveAssignees.isPending;
    const submitDate = () => {
        const value = dueDate.trim();
        const parsed = new Date(`${value}T00:00:00Z`);
        if (
            value &&
            (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
                !Number.isFinite(parsed.getTime()) ||
                parsed.toISOString().slice(0, 10) !== value)
        ) {
            toast.error('Enter a valid date in YYYY-MM-DD format');
            return;
        }
        saveDate.mutate();
    };
    return (
        <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
            <Text className="text-slate-800 text-base font-bold">
                Assignment and due date
            </Text>
            <Text className="text-slate-500 text-sm mt-2">
                {ticket.assignees?.map((user) => user.fullName).join(', ') ||
                    'No staff assigned'}
            </Text>
            {!editing ? (
                <TouchableOpacity
                    onPress={() => {
                        setDueDate(ticket.dueDate || '');
                        setAssigneeIds(
                            ticket.assignees?.map((user) => user.id) || []
                        );
                        setEditing(true);
                    }}
                    className="mt-3 rounded-xl bg-blue-50 p-3 items-center"
                >
                    <Text className="text-blue-600 font-bold">
                        Edit assignment and due date
                    </Text>
                </TouchableOpacity>
            ) : (
                <View className="mt-3 gap-3">
                    <Text className="text-slate-700 text-sm">
                        Due date (YYYY-MM-DD). Leave blank to clear.
                    </Text>
                    <TextInput
                        value={dueDate}
                        onChangeText={setDueDate}
                        placeholder="YYYY-MM-DD"
                        autoCapitalize="none"
                        className="rounded-xl border border-slate-200 p-3 text-slate-800"
                    />
                    <TouchableOpacity
                        disabled={busy}
                        onPress={submitDate}
                        className="rounded-xl bg-blue-600 p-3 items-center"
                    >
                        <Text className="text-white font-bold">
                            {saveDate.isPending ? 'Saving...' : 'Save due date'}
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-slate-700 text-sm">
                        Select staff. Clear all selections to unassign everyone.
                    </Text>
                    {users.isLoading ? (
                        <ActivityIndicator color="#2563EB" />
                    ) : null}
                    {users.isError ? (
                        <TouchableOpacity onPress={() => void users.refetch()}>
                            <Text className="text-red-600">
                                Could not load staff. Tap to retry.
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    {staff.map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            disabled={busy}
                            accessibilityRole="checkbox"
                            accessibilityState={{
                                checked: assigneeIds.includes(user.id),
                            }}
                            onPress={() =>
                                setAssigneeIds((current) =>
                                    current.includes(user.id)
                                        ? current.filter((id) => id !== user.id)
                                        : [...current, user.id]
                                )
                            }
                            className={`rounded-xl border p-3 ${assigneeIds.includes(user.id) ? 'bg-blue-50 border-blue-600' : 'border-slate-200'}`}
                        >
                            <Text className="text-slate-800 font-semibold">
                                {assigneeIds.includes(user.id) ? '✓ ' : ''}
                                {user.fullName}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">
                                {user.email}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        disabled={busy || users.isLoading || users.isError}
                        onPress={() => saveAssignees.mutate()}
                        className="rounded-xl bg-blue-600 p-3 items-center"
                    >
                        <Text className="text-white font-bold">
                            {saveAssignees.isPending
                                ? 'Saving...'
                                : 'Save assigned staff'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={busy}
                        onPress={() => setEditing(false)}
                        className="p-3 items-center"
                    >
                        <Text className="text-blue-600 font-bold">Done</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
