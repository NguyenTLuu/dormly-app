import {
    activateResidentAccount,
    getInactiveResidentAccounts,
    type InactiveResidentAccount,
} from '@/api/accountActivationApi';
import { ManagerHeader } from '@/components/manager-dashboard';
import { AccountRequestCard } from '@/components/manager-dashboard-actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function AccountRequestsScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activationTarget, setActivationTarget] =
        useState<InactiveResidentAccount | null>(null);
    const accounts = useQuery({
        queryKey: ['inactive-resident-accounts'],
        queryFn: getInactiveResidentAccounts,
    });
    const activate = useMutation({
        mutationFn: activateResidentAccount,
        onSuccess: (_, id) => {
            queryClient.setQueryData<InactiveResidentAccount[]>(
                ['inactive-resident-accounts'],
                (current) => current?.filter((account) => account.id !== id) ?? []
            );
            setActivationTarget(null);
            toast.success('Resident account activated');
            void Promise.all(
                [
                    ['inactive-resident-accounts'],
                    ['manager-resident-users'],
                    ['admin-users'],
                    ['room-management'],
                    ['admin-dashboard'],
                ].map((queryKey) => queryClient.invalidateQueries({ queryKey }))
            );
        },
        onError: (error) =>
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Could not activate resident account'
            ),
    });

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView
                className="bg-[#F4FAFD] flex-1"
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={accounts.isRefetching}
                        onRefresh={() => void accounts.refetch()}
                        tintColor="#2563EB"
                    />
                }
            >
                <ManagerHeader
                    title="Account Activation"
                    subtitle="Review inactive resident accounts"
                    onBack={() => router.back()}
                />
                <View className="-mt-8 px-4 gap-4">
                    <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                        <Text className="text-blue-900 text-sm font-semibold">
                            Inactive accounts include new registrations and
                            residents deactivated earlier. Open the profile and
                            documents before activating an account.
                        </Text>
                    </View>
                    <Text className="text-[#1E293B] text-lg font-bold">
                        Inactive residents ({accounts.data?.length ?? 0})
                    </Text>
                    {accounts.isLoading ? (
                        <ActivityIndicator color="#2563EB" />
                    ) : null}
                    {accounts.isError ? (
                        <TouchableOpacity
                            onPress={() => void accounts.refetch()}
                            className="bg-red-50 rounded-2xl p-4"
                        >
                            <Text className="text-red-700 text-center font-semibold">
                                Could not load inactive accounts. Tap to retry.
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    <View className="gap-3">
                        {(accounts.data ?? []).map((account) => (
                            <AccountRequestCard
                                key={account.id}
                                request={account}
                                busy={activate.isPending}
                                onActivate={setActivationTarget}
                                onOpenProfile={() =>
                                    router.push({
                                        pathname:
                                            '/manager-details/student/[id]',
                                        params: { id: account.id },
                                    })
                                }
                            />
                        ))}
                    </View>
                    {!accounts.isLoading &&
                    !accounts.isError &&
                    accounts.data?.length === 0 ? (
                        <View className="bg-white rounded-2xl p-5 border border-gray-100">
                            <Text className="text-[#64748B] text-sm font-semibold text-center">
                                No inactive resident accounts.
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
            <Modal
                transparent
                visible={activationTarget !== null}
                animationType="fade"
                onRequestClose={() => {
                    if (!activate.isPending) setActivationTarget(null);
                }}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-center px-5"
                    onPress={() => {
                        if (!activate.isPending) setActivationTarget(null);
                    }}
                >
                    <Pressable className="bg-white rounded-2xl p-5">
                        <Text className="text-[#1E293B] text-lg font-bold">
                            Activate resident account?
                        </Text>
                        <Text className="text-[#64748B] mt-2">
                            {activationTarget?.name} will be able to sign in.
                            Confirm after checking their profile and documents.
                        </Text>
                        <View className="flex-row gap-3 mt-5">
                            <TouchableOpacity
                                disabled={activate.isPending}
                                onPress={() => setActivationTarget(null)}
                                className="flex-1 bg-slate-100 rounded-xl py-3 items-center"
                            >
                                <Text className="text-slate-700 font-bold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={activate.isPending}
                                onPress={() => {
                                    if (activationTarget)
                                        activate.mutate(activationTarget.id);
                                }}
                                className="flex-1 bg-emerald-600 rounded-xl py-3 items-center"
                            >
                                <Text className="text-white font-bold">
                                    {activate.isPending
                                        ? 'Activating...'
                                        : 'Activate'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
