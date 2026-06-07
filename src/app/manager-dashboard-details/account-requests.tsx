import { ManagerHeader } from '@/components/manager-dashboard';
import {
    AccountRequestCard,
    ActionStatusTabs,
    RejectionReasonModal,
} from '@/components/manager-dashboard-actions';
import {
    AccountRequest,
    AccountRequestStatus,
    newAccountRequests,
} from '@/data/manager-dashboard-actions';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { toast } from 'sonner-native';

const accountStatuses: AccountRequestStatus[] = [
    'Pending',
    'Approved',
    'Rejected',
];

export default function AccountRequestsScreen() {
    const router = useRouter();
    const [requests, setRequests] =
        useState<AccountRequest[]>(newAccountRequests);
    const [activeStatus, setActiveStatus] =
        useState<AccountRequestStatus>('Pending');
    const [rejectingRequest, setRejectingRequest] =
        useState<AccountRequest | null>(null);

    const counts = useMemo(
        () =>
            accountStatuses.reduce(
                (result, status) => ({
                    ...result,
                    [status]: requests.filter(
                        (request) => request.status === status
                    ).length,
                }),
                { Pending: 0, Approved: 0, Rejected: 0 } as Record<
                    AccountRequestStatus,
                    number
                >
            ),
        [requests]
    );

    const filteredRequests = requests.filter(
        (request) => request.status === activeStatus
    );

    const handleApprove = (id: string) => {
        setRequests((current) =>
            current.map((request) =>
                request.id === id
                    ? { ...request, status: 'Approved' }
                    : request
            )
        );
        toast.success('Account request approved', {
            description: 'The student account can now be activated.',
        });
    };

    const handleReject = (id: string, reason: string) => {
        if (!reason) {
            toast.error('Rejection reason is required');
            return;
        }

        setRequests((current) =>
            current.map((request) =>
                request.id === id
                    ? {
                          ...request,
                          status: 'Rejected',
                          rejectionReason: reason,
                      }
                    : request
            )
        );
        setRejectingRequest(null);
        toast.success('Account request rejected', {
            description: 'The rejection reason has been recorded.',
        });
    };

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-[#F4FAFD] flex-1">
                <ManagerHeader
                    title="Account Requests"
                    subtitle="Review new dormitory account registrations"
                    onBack={() => router.back()}
                />
                <View className="-mt-8 px-4 pb-8 gap-4">
                    <ActionStatusTabs
                        options={accountStatuses}
                        value={activeStatus}
                        counts={counts}
                        onChange={setActiveStatus}
                    />

                    <View>
                        <Text className="text-[#1E293B] text-lg font-bold mb-3">
                            {activeStatus} requests
                        </Text>
                        <View className="gap-3">
                            {filteredRequests.map((request) => (
                                <AccountRequestCard
                                    key={request.id}
                                    request={request}
                                    onApprove={handleApprove}
                                    onReject={setRejectingRequest}
                                />
                            ))}
                            {filteredRequests.length === 0 && (
                                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <Text className="text-[#64748B] text-sm font-semibold text-center">
                                        No account requests in this status.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <RejectionReasonModal
                request={rejectingRequest}
                onClose={() => setRejectingRequest(null)}
                onConfirm={handleReject}
            />
        </>
    );
}
