import { getInvoiceDetail, recordInvoicePayment } from '@/api/adminApi';
import { AdminHeader } from '@/components/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function InvoiceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmPayment, setConfirmPayment] = useState(false);
    const invoice = useQuery({
        queryKey: ['admin-invoice', id],
        queryFn: () => getInvoiceDetail(id),
        enabled: Boolean(id),
    });
    const payment = useMutation({
        mutationFn: () => recordInvoicePayment(id),
        onSuccess: (updated) => {
            setConfirmPayment(false);
            queryClient.setQueryData(['admin-invoice', id], updated);
            void queryClient.invalidateQueries({
                queryKey: ['admin-invoices'],
            });
            void queryClient.invalidateQueries({
                queryKey: ['admin-dashboard'],
            });
            toast.success('Invoice marked as paid');
        },
        onError: () => toast.error('Could not record payment'),
    });
    const item = invoice.data;
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <AdminHeader
                title="Invoice Detail"
                subtitle="Resident billing and payment status"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={invoice.isRefetching}
                        onRefresh={() => void invoice.refetch()}
                        tintColor="#2563EB"
                    />
                }
            >
                {invoice.isLoading ? (
                    <ActivityIndicator color="#2563EB" />
                ) : null}
                {invoice.isError || (!invoice.isLoading && !item) ? (
                    <TouchableOpacity
                        onPress={() => void invoice.refetch()}
                        className="rounded-2xl bg-red-50 p-4"
                    >
                        <Text className="text-red-700">
                            Could not load invoice. Tap to retry.
                        </Text>
                    </TouchableOpacity>
                ) : null}
                {item ? (
                    <View className="rounded-2xl bg-white border border-slate-100 p-5 gap-4">
                        <Text className="text-slate-800 text-xl font-bold">
                            {item.studentName || 'Resident'}
                        </Text>
                        <Text
                            className={`font-bold ${item.status === 'PAID' ? 'text-emerald-600' : 'text-orange-600'}`}
                        >
                            {item.status}
                        </Text>
                        <Field
                            label="Room"
                            value={`${item.roomName || 'Room'} · ${item.blockName || 'Building'}`}
                        />
                        <Field
                            label="Fee category"
                            value={item.feeCategory.replace(/_/g, ' ')}
                        />
                        <Field
                            label="Amount"
                            value={Number(item.amount).toLocaleString()}
                        />
                        <Field label="Billing month" value={item.month} />
                        <Field
                            label="Due date"
                            value={formatDate(item.dueDate)}
                        />
                        <Field
                            label="Paid at"
                            value={formatDate(item.paidAt)}
                        />
                        <Field label="Notes" value={item.notes || '—'} />
                        <Field label="Invoice ID" value={item.id} />
                        {item.status !== 'PAID' ? (
                            <TouchableOpacity
                                disabled={payment.isPending}
                                onPress={() => setConfirmPayment(true)}
                                className="rounded-xl bg-blue-600 p-4 items-center"
                            >
                                <Text className="text-white font-bold">
                                    Record payment received
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}
            </ScrollView>
            <Modal
                visible={confirmPayment}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    if (!payment.isPending) setConfirmPayment(false);
                }}
            >
                <View className="flex-1 bg-slate-900/40 justify-center px-6">
                    <View className="rounded-2xl bg-white p-5 gap-4">
                        <Text className="text-slate-800 text-lg font-bold">
                            Confirm payment received
                        </Text>
                        <Text className="text-slate-600">
                            Confirm that payment of{' '}
                            {Number(item?.amount || 0).toLocaleString()} has
                            been received. This marks the invoice as PAID in the
                            system.
                        </Text>
                        <TouchableOpacity
                            disabled={payment.isPending}
                            onPress={() => payment.mutate()}
                            className="rounded-xl bg-blue-600 p-3 items-center"
                        >
                            <Text className="text-white font-bold">
                                {payment.isPending
                                    ? 'Saving...'
                                    : 'Confirm payment'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={payment.isPending}
                            onPress={() => setConfirmPayment(false)}
                            className="p-3 items-center"
                        >
                            <Text className="text-slate-600 font-semibold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <View>
            <Text className="text-slate-500 text-xs">{label}</Text>
            <Text className="text-slate-800 font-semibold mt-1" selectable>
                {value}
            </Text>
        </View>
    );
}

function formatDate(value?: string | null) {
    return value ? new Date(value).toLocaleString() : '—';
}
