import { ManagerHeader } from '@/components/manager-dashboard';
import {
    RequestFilterBar,
    RequestTopTabs,
    StatusTabs,
    IssueTypeFilter,
    TransferFilterBar,
    TransferRequestCard,
    WorkRequestCard,
} from '@/components/manager-requests';
import {
    RequestTab,
    WorkStatus,
    blockOptions,
    complaintRequests,
    floorsByBlock,
    issueRequests,
    issueTypeOptions,
    priorityOptions,
    statusTabs,
    transferRoomRequests,
} from '@/data/manager-requests';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';

const getStatusCounts = <T extends { status: WorkStatus }>(
    items: T[]
): Record<WorkStatus, number> => {
    return statusTabs.reduce(
        (counts, status) => ({
            ...counts,
            [status]: items.filter((item) => item.status === status).length,
        }),
        {
            Pending: 0,
            'In Progress': 0,
            Resolved: 0,
        } as Record<WorkStatus, number>
    );
};

export default function RequestScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<RequestTab>('issues');
    const [activeStatus, setActiveStatus] = useState<WorkStatus>('Pending');
    const [selectedBlock, setSelectedBlock] = useState('All');
    const [selectedFloor, setSelectedFloor] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedIssueType, setSelectedIssueType] = useState('All');
    const activeWorkItems =
        activeTab === 'issues' ? issueRequests : complaintRequests;
    const transfers = transferRoomRequests;
    const availableFloorOptions =
        selectedBlock === 'All' ? ['All'] : floorsByBlock[selectedBlock];

    const filteredWorkItems = useMemo(() => {
        return activeWorkItems.filter((item) => {
            const matchesStatus = item.status === activeStatus;
            const matchesBlock =
                selectedBlock === 'All' || item.block === selectedBlock;
            const matchesFloor =
                selectedFloor === 'All' || item.floor === selectedFloor;
            const matchesPriority =
                selectedPriority === 'All' ||
                item.priority === selectedPriority;
            const matchesIssueType =
                activeTab !== 'issues' ||
                selectedIssueType === 'All' ||
                item.category === selectedIssueType;

            return (
                matchesStatus &&
                matchesBlock &&
                matchesFloor &&
                matchesPriority &&
                matchesIssueType
            );
        });
    }, [
        activeStatus,
        activeTab,
        activeWorkItems,
        selectedBlock,
        selectedFloor,
        selectedPriority,
        selectedIssueType,
    ]);

    const filteredTransferItems = useMemo(() => {
        return transfers.filter((item) => {
            const matchesStatus = item.status === activeStatus;
            const matchesBlock =
                selectedBlock === 'All' ||
                item.requestedBlock === selectedBlock;
            const matchesFloor =
                selectedFloor === 'All' ||
                item.requestedFloor === selectedFloor;

            return matchesStatus && matchesBlock && matchesFloor;
        });
    }, [activeStatus, selectedBlock, selectedFloor, transfers]);

    const statusCounts = useMemo(() => {
        if (activeTab === 'transfers') {
            const filteredByRequestedLocation = transfers.filter((item) => {
                const matchesBlock =
                    selectedBlock === 'All' ||
                    item.requestedBlock === selectedBlock;
                const matchesFloor =
                    selectedFloor === 'All' ||
                    item.requestedFloor === selectedFloor;

                return matchesBlock && matchesFloor;
            });

            return getStatusCounts(filteredByRequestedLocation);
        }

        const filteredByLocation = activeWorkItems.filter((item) => {
            const matchesBlock =
                selectedBlock === 'All' || item.block === selectedBlock;
            const matchesFloor =
                selectedFloor === 'All' || item.floor === selectedFloor;
            const matchesPriority =
                selectedPriority === 'All' ||
                item.priority === selectedPriority;
            const matchesIssueType =
                activeTab !== 'issues' ||
                selectedIssueType === 'All' ||
                item.category === selectedIssueType;

            return (
                matchesBlock &&
                matchesFloor &&
                matchesPriority &&
                matchesIssueType
            );
        });

        return getStatusCounts(filteredByLocation);
    }, [
        activeTab,
        activeWorkItems,
        selectedBlock,
        selectedFloor,
        selectedPriority,
        selectedIssueType,
        transfers,
    ]);

    const handleTabChange = (tab: RequestTab) => {
        setActiveTab(tab);
        setActiveStatus('Pending');
        setSelectedBlock('All');
        setSelectedFloor('All');
        setSelectedPriority('All');
        setSelectedIssueType('All');
    };

    const handleBlockChange = (block: string) => {
        setSelectedBlock(block);
        setSelectedFloor('All');
    };

    const handleClearFilter = () => {
        setSelectedBlock('All');
        setSelectedFloor('All');
        setSelectedPriority('All');
    };

    const listTitle =
        activeTab === 'issues'
            ? 'Issue Requests'
            : activeTab === 'complaints'
              ? 'Complaint Requests'
              : 'Transfer Room Requests';

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView className="bg-[#F4FAFD] flex-1">
                <ManagerHeader
                    title="Requests"
                    subtitle="Handle issues, complaints, and room transfers"
                />

                <View className="-mt-8 px-4 pb-8 gap-4">
                    <RequestTopTabs
                        activeTab={activeTab}
                        onChange={handleTabChange}
                    />

                    {activeTab !== 'transfers' && (
                        <RequestFilterBar
                            blocks={blockOptions}
                            floors={availableFloorOptions}
                            priorities={priorityOptions}
                            selectedBlock={selectedBlock}
                            selectedFloor={selectedFloor}
                            selectedPriority={selectedPriority}
                            onBlockChange={handleBlockChange}
                            onFloorChange={setSelectedFloor}
                            onPriorityChange={setSelectedPriority}
                            onClear={handleClearFilter}
                        />
                    )}

                    {activeTab === 'transfers' && (
                        <TransferFilterBar
                            blocks={blockOptions}
                            floors={availableFloorOptions}
                            selectedBlock={selectedBlock}
                            selectedFloor={selectedFloor}
                            onBlockChange={handleBlockChange}
                            onFloorChange={setSelectedFloor}
                            onClear={handleClearFilter}
                        />
                    )}

                    <StatusTabs
                        activeStatus={activeStatus}
                        counts={statusCounts}
                        onChange={setActiveStatus}
                    />

                    {activeTab === 'issues' && (
                        <IssueTypeFilter
                            options={issueTypeOptions}
                            selectedType={selectedIssueType}
                            onChange={setSelectedIssueType}
                        />
                    )}

                    <View>
                        <Text className="text-[#1E293B] text-lg font-bold mb-3">
                            {listTitle}
                        </Text>
                        <View className="gap-3">
                            {activeTab === 'transfers'
                                ? filteredTransferItems.map((item) => (
                                      <TransferRequestCard
                                          key={item.id}
                                          item={item}
                                          onPress={(request) =>
                                              router.push({
                                                  pathname:
                                                      '/manager-details/ticket/[type]/[id]',
                                                  params: {
                                                      type: 'transfer',
                                                      id: request.id,
                                                  },
                                              })
                                          }
                                      />
                                  ))
                                : filteredWorkItems.map((item) => (
                                      <WorkRequestCard
                                          key={item.id}
                                          item={item}
                                          onPress={(request) =>
                                              router.push({
                                                  pathname:
                                                      '/manager-details/ticket/[type]/[id]',
                                                  params: {
                                                      type:
                                                          activeTab ===
                                                          'complaints'
                                                              ? 'complaint'
                                                              : 'issue',
                                                      id: request.id,
                                                  },
                                              })
                                          }
                                      />
                                  ))}

                            {((activeTab === 'transfers' &&
                                filteredTransferItems.length === 0) ||
                                (activeTab !== 'transfers' &&
                                    filteredWorkItems.length === 0)) && (
                                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <Text className="text-[#64748B] text-sm font-semibold text-center">
                                        No requests match this view.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

        </>
    );
}
