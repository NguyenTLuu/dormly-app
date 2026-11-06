import {
    createAdminInvoice,
    getAdminInvoices,
    getInvoiceAssignmentOptions,
} from '@/api/adminApi';
import { AdminHeader } from '@/components/admin';
import { useKeyboardBottomPadding } from '@/hooks/useKeyboardBottomPadding';
import type {
    AdminInvoice,
    AdminRoomAssignment,
    FeeCategory,
} from '@/types/admin';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

const feeCategories: FeeCategory[] = [
    'ROOM_RENT',
    'ELECTRICITY',
    'WATER',
    'SERVICE',
    'OTHER',
];
type InvoiceFilter = 'ALL' | 'PAID' | 'UNPAID' | 'OVERDUE';

export default function InvoiceManagementScreen({
    onBack,
}: {
    onBack?: () => void;
}) {
    const router = useRouter();
    const paddingBottom = useKeyboardBottomPadding(32, 240);
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [statusFilter, setStatusFilter] = useState<InvoiceFilter>('ALL');
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [category, setCategory] = useState<FeeCategory>('ROOM_RENT');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [notes, setNotes] = useState('');
    const invoices = useQuery({
        queryKey: ['admin-invoices'],
        queryFn: getAdminInvoices,
    });
    const assignments = useQuery({
        queryKey: ['invoice-assignment-options'],
        queryFn: getInvoiceAssignmentOptions,
        enabled: showCreate,
    });
    const create = useMutation({
        mutationFn: createAdminInvoice,
        onSuccess: () => {
            toast.success('Invoice generated');
            setAmount('');
            setNotes('');
            setShowCreate(false);
            queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        },
        onError: () => toast.error('Could not generate invoice'),
    });
    const visibleInvoices = useMemo(
        () =>
            (invoices.data ?? []).filter((invoice) => {
                if (statusFilter === 'ALL') return true;
                return invoice.status.toUpperCase() === statusFilter;
            }),
        [invoices.data, statusFilter]
    );
    const submit = () => {
        const parsedAmount = Number(amount);
        if (
            !selectedAssignment ||
            !Number.isFinite(parsedAmount) ||
            parsedAmount <= 0 ||
            !/^\d{4}-(0[1-9]|1[0-2])$/.test(month.trim())
        ) {
            toast.error(
                'Choose an assignment, a positive amount, and a month in YYYY-MM format'
            );
            return;
        }
        create.mutate({
            roomAssignmentId: selectedAssignment,
            feeCategory: category,
            amount: parsedAmount,
            month: month.trim(),
            notes: notes.trim() || undefined,
        });
    };

    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                onBack={onBack}
                title="Invoice Management"
                subtitle="Track resident billing and payments"
                rightAction={
                    <TouchableOpacity
                        onPress={() => setShowCreate((value) => !value)}
                        className="bg-white rounded-xl px-3 py-2.5 flex-row items-center"
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={19}
                            color="#2563EB"
                        />
                        <Text className="text-blue-600 font-bold text-xs ml-1">
                            {showCreate ? 'Close' : 'New Invoice'}
                        </Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={invoices.isRefetching}
                        onRefresh={() =>
                            void Promise.all([
                                invoices.refetch(),
                                showCreate
                                    ? assignments.refetch()
                                    : Promise.resolve(),
                            ])
                        }
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                {showCreate ? (
                    <>
                        {assignments.isLoading ? (
                            <ActivityIndicator color="#2563EB" />
                        ) : null}
                        {assignments.isError ? (
                            <TouchableOpacity
                                onPress={() => void assignments.refetch()}
                                className="bg-red-50 rounded-xl p-3 mb-3"
                            >
                                <Text className="text-red-700">
                                    Could not load room assignments. Tap to
                                    retry.
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        <CreateInvoiceForm
                            assignments={assignments.data ?? []}
                            selectedAssignment={selectedAssignment}
                            category={category}
                            amount={amount}
                            month={month}
                            notes={notes}
                            pending={
                                create.isPending ||
                                assignments.isLoading ||
                                assignments.isError
                            }
                            onAssignment={setSelectedAssignment}
                            onCategory={setCategory}
                            onAmount={setAmount}
                            onMonth={setMonth}
                            onNotes={setNotes}
                            onSubmit={submit}
                        />
                    </>
                ) : null}
                <View className="flex-row gap-2 mb-4">
                    {(
                        ['ALL', 'UNPAID', 'PAID', 'OVERDUE'] as InvoiceFilter[]
                    ).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setStatusFilter(filter)}
                            className={`px-4 py-2 rounded-xl border ${statusFilter === filter ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
                        >
                            <Text
                                className={`text-xs font-bold ${statusFilter === filter ? 'text-white' : 'text-slate-600'}`}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        All invoices
                    </Text>
                </View>
                {invoices.isLoading ? (
                    <ActivityIndicator color="#2563EB" />
                ) : null}
                {invoices.isError ? (
                    <Text className="text-red-600 font-semibold">
                        Could not load invoices.
                    </Text>
                ) : null}
                <View className="gap-3">
                    {visibleInvoices.map((invoice) => (
                        <TouchableOpacity
                            key={invoice.id}
                            accessibilityRole="button"
                            accessibilityLabel={`Open invoice for ${invoice.studentName || 'resident'}`}
                            onPress={() =>
                                router.push({
                                    pathname: '/admin-details/invoices/[id]',
                                    params: { id: invoice.id },
                                })
                            }
                        >
                            <InvoiceCard invoice={invoice} />
                        </TouchableOpacity>
                    ))}
                    {!invoices.isLoading &&
                    !invoices.isError &&
                    visibleInvoices.length === 0 ? (
                        <View className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 items-center">
                            <Ionicons
                                name="receipt-outline"
                                size={34}
                                color="#94A3B8"
                            />
                            <Text className="text-[#1E293B] font-bold mt-3">
                                No invoices found for this filter
                            </Text>
                            <Text className="text-[#64748B] text-sm mt-1">
                                Try changing the status or create an invoice.
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

function CreateInvoiceForm({
    assignments,
    selectedAssignment,
    category,
    amount,
    month,
    notes,
    pending,
    onAssignment,
    onCategory,
    onAmount,
    onMonth,
    onNotes,
    onSubmit,
}: {
    assignments: AdminRoomAssignment[];
    selectedAssignment: string;
    category: FeeCategory;
    amount: string;
    month: string;
    notes: string;
    pending: boolean;
    onAssignment: (value: string) => void;
    onCategory: (value: FeeCategory) => void;
    onAmount: (value: string) => void;
    onMonth: (value: string) => void;
    onNotes: (value: string) => void;
    onSubmit: () => void;
}) {
    return (
        <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-5">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                    <Ionicons
                        name="document-text-outline"
                        size={21}
                        color="#2563EB"
                    />
                </View>
                <View className="ml-3">
                    <Text className="text-[#1E293B] font-bold text-base">
                        Create Invoice
                    </Text>
                    <Text className="text-[#64748B] text-xs mt-1">
                        Generate a billing record
                    </Text>
                </View>
            </View>
            <Text className="text-[#1E293B] text-xs font-bold">
                Room assignment
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
            >
                <View className="flex-row gap-2">
                    {assignments.map((assignment) => (
                        <TouchableOpacity
                            key={assignment.id}
                            onPress={() => onAssignment(assignment.id)}
                            className={`w-48 rounded-xl p-3 ${selectedAssignment === assignment.id ? 'bg-blue-600' : 'bg-slate-100'}`}
                        >
                            <Text
                                className={`text-xs font-bold ${selectedAssignment === assignment.id ? 'text-white' : 'text-slate-700'}`}
                            >
                                {assignment.residentName || 'Resident'}
                            </Text>
                            <Text
                                className={`text-[10px] mt-1 ${selectedAssignment === assignment.id ? 'text-blue-100' : 'text-slate-500'}`}
                            >
                                {assignment.roomName || 'Room'} ·{' '}
                                {assignment.id.slice(0, 8)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {assignments.length === 0 ? (
                <Text className="text-slate-500 text-sm mt-2">
                    No room assignments available for billing.
                </Text>
            ) : null}
            <Text className="text-[#1E293B] text-xs font-bold mt-4">
                Amount
            </Text>
            <TextInput
                value={amount}
                onChangeText={onAmount}
                keyboardType="decimal-pad"
                placeholder="Enter amount"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-200 rounded-xl px-3 py-3 mt-2 text-[#1E293B]"
            />
            <Text className="text-[#1E293B] text-xs font-bold mt-4">
                Fee category
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
                {feeCategories.map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => onCategory(item)}
                        className={`px-2.5 py-2 rounded-lg ${category === item ? 'bg-blue-600' : 'bg-blue-50'}`}
                    >
                        <Text
                            className={`text-[10px] font-bold ${category === item ? 'text-white' : 'text-blue-700'}`}
                        >
                            {item.replace('_', ' ')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View className="flex-row gap-2 mt-4">
                <View className="flex-1">
                    <Text className="text-[#1E293B] text-xs font-bold">
                        Month
                    </Text>
                    <TextInput
                        value={month}
                        onChangeText={onMonth}
                        placeholder="YYYY-MM"
                        placeholderTextColor="#94A3B8"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-3 mt-2 text-[#1E293B]"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-[#1E293B] text-xs font-bold">
                        Notes
                    </Text>
                    <TextInput
                        value={notes}
                        onChangeText={onNotes}
                        placeholder="Optional"
                        placeholderTextColor="#94A3B8"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-3 mt-2 text-[#1E293B]"
                    />
                </View>
            </View>
            <TouchableOpacity
                disabled={pending || !selectedAssignment}
                onPress={onSubmit}
                className="bg-blue-600 rounded-xl py-3 mt-4 items-center"
            >
                <Text className="text-white font-bold">
                    {pending ? 'Generating...' : 'Create Invoice'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function InvoiceCard({ invoice }: { invoice: AdminInvoice }) {
    const normalizedStatus = invoice.status.toUpperCase();
    const statusStyle =
        normalizedStatus === 'PAID'
            ? 'bg-emerald-50 text-emerald-600'
            : normalizedStatus === 'OVERDUE'
              ? 'bg-red-50 text-red-600'
              : 'bg-orange-50 text-orange-600';
    const colors = statusStyle.split(' ');
    return (
        <View className="bg-white border border-slate-100 rounded-2xl p-4">
            <View className="flex-row items-start">
                <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${normalizedStatus === 'PAID' ? 'bg-emerald-50' : normalizedStatus === 'OVERDUE' ? 'bg-red-50' : 'bg-orange-50'}`}
                >
                    <Ionicons
                        name="document-text-outline"
                        size={24}
                        color={
                            normalizedStatus === 'PAID'
                                ? '#16A34A'
                                : normalizedStatus === 'OVERDUE'
                                  ? '#DC2626'
                                  : '#EA580C'
                        }
                    />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-[#1E293B] text-base font-bold">
                        {invoice.studentName || 'Resident'}
                    </Text>
                    <Text className="text-[#64748B] text-sm mt-1">
                        {invoice.roomName || 'Room'} ·{' '}
                        {invoice.blockName || 'Building'}
                    </Text>
                </View>
                <View className={`px-3 py-1.5 rounded-xl ${colors[0]}`}>
                    <Text className={`text-[10px] font-bold ${colors[1]}`}>
                        {normalizedStatus}
                    </Text>
                </View>
            </View>
            <View className="border-t border-slate-100 mt-4 pt-3 flex-row flex-wrap gap-y-2">
                <InvoiceField
                    label="Fee type"
                    value={invoice.feeCategory.replace('_', ' ')}
                />
                <InvoiceField
                    label="Amount"
                    value={Number(invoice.amount).toLocaleString()}
                />
                <InvoiceField label="Month" value={invoice.month} />
                <InvoiceField
                    label="Due date"
                    value={invoice.dueDate ? formatDate(invoice.dueDate) : '—'}
                />
                <InvoiceField label="Note" value={invoice.notes || '—'} />
            </View>
        </View>
    );
}

function InvoiceField({ label, value }: { label: string; value: string }) {
    return (
        <View className="w-1/2">
            <Text className="text-[#64748B] text-xs">{label}</Text>
            <Text className="text-[#1E293B] text-sm font-semibold mt-1">
                {value}
            </Text>
        </View>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
