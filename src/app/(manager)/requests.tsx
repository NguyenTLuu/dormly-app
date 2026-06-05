import { ManagerHeader } from '@/components/manager-dashboard';
import {
    RequestFilterBar,
    RequestTopTabs,
    StatusTabs,
    TransferRequestCard,
    TransferRequestDetailModal,
    WorkRequestCard,
    WorkRequestDetailModal,
} from '@/components/manager-requests';
import {
    RequestTab,
    TransferRoomRequest,
    WorkRequest,
    WorkStatus,
    blockOptions,
    complaintRequests,
    floorsByBlock,
    issueRequests,
    priorityOptions,
    statusTabs,
    transferRoomRequests,
} from '@/data/manager-requests';
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
    const [activeTab, setActiveTab] = useState<RequestTab>('issues');
    const [activeStatus, setActiveStatus] = useState<WorkStatus>('Pending');
    const [selectedBlock, setSelectedBlock] = useState('All');
    const [selectedFloor, setSelectedFloor] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [issues, setIssues] = useState<WorkRequest[]>(issueRequests);
    const [complaints, setComplaints] =
        useState<WorkRequest[]>(complaintRequests);
    const [transfers, setTransfers] =
        useState<TransferRoomRequest[]>(transferRoomRequests);
    const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
    const [selectedTransferId, setSelectedTransferId] = useState<string | null>(
        null
    );

    const activeWorkItems = activeTab === 'issues' ? issues : complaints;
    const availableFloorOptions =
        selectedBlock === 'All' ? ['All'] : floorsByBlock[selectedBlock];
    const selectedWorkItem =
        activeTab === 'transfers'
            ? null
            : activeWorkItems.find((item) => item.id === selectedWorkId) ||
              null;
    const selectedTransferItem =
        transfers.find((item) => item.id === selectedTransferId) || null;

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

            return (
                matchesStatus && matchesBlock && matchesFloor && matchesPriority
            );
        });
    }, [activeStatus, selectedBlock, selectedFloor, selectedPriority]);

    const filteredTransferItems = useMemo(() => {
        return transfers.filter((item) => item.status === activeStatus);
    }, [activeStatus, transfers]);

    const statusCounts = useMemo(() => {
        if (activeTab === 'transfers') {
            return getStatusCounts(transfers);
        }

        const filteredByLocation = activeWorkItems.filter((item) => {
            const matchesBlock =
                selectedBlock === 'All' || item.block === selectedBlock;
            const matchesFloor =
                selectedFloor === 'All' || item.floor === selectedFloor;
            const matchesPriority =
                selectedPriority === 'All' ||
                item.priority === selectedPriority;

            return matchesBlock && matchesFloor && matchesPriority;
        });

        return getStatusCounts(filteredByLocation);
    }, [activeTab, selectedBlock, selectedFloor, selectedPriority, transfers]);

    const updateWorkItems = (
        updater: (items: WorkRequest[]) => WorkRequest[]
    ) => {
        if (activeTab === 'issues') {
            setIssues(updater);
        } else if (activeTab === 'complaints') {
            setComplaints(updater);
        }
    };

    const handleAssign = (id: string, assignee: string) => {
        updateWorkItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, assignee: assignee || undefined }
                    : item
            )
        );
    };

    const handleProgressChange = (id: string, progress: string) => {
        updateWorkItems((items) =>
            items.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                return {
                    ...item,
                    progress,
                    status: progress as WorkStatus,
                };
            })
        );
    };

    const handleNoteChange = (id: string, note: string) => {
        updateWorkItems((items) =>
            items.map((item) => (item.id === id ? { ...item, note } : item))
        );
    };

    const handleApproveTransfer = (id: string) => {
        setTransfers((items) =>
            items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status: 'Resolved',
                          decision: 'Approved',
                          denialReason: undefined,
                          note: 'Approved by manager.',
                      }
                    : item
            )
        );
    };

    const handleDenyTransfer = (id: string, reason: string) => {
        setTransfers((items) =>
            items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status: 'Resolved',
                          decision: 'Denied',
                          denialReason: reason,
                          note: reason,
                      }
                    : item
            )
        );
    };

    const handleTabChange = (tab: RequestTab) => {
        setActiveTab(tab);
        setActiveStatus('Pending');
        setSelectedBlock('All');
        setSelectedFloor('All');
        setSelectedPriority('All');
        setSelectedWorkId(null);
        setSelectedTransferId(null);
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

                    <StatusTabs
                        activeStatus={activeStatus}
                        counts={statusCounts}
                        onChange={setActiveStatus}
                    />

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
                                              setSelectedTransferId(request.id)
                                          }
                                      />
                                  ))
                                : filteredWorkItems.map((item) => (
                                      <WorkRequestCard
                                          key={item.id}
                                          item={item}
                                          onPress={(request) =>
                                              setSelectedWorkId(request.id)
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

            <WorkRequestDetailModal
                visible={Boolean(selectedWorkItem)}
                item={selectedWorkItem}
                onClose={() => setSelectedWorkId(null)}
                onAssign={handleAssign}
                onProgressChange={handleProgressChange}
                onNoteChange={handleNoteChange}
            />
            <TransferRequestDetailModal
                visible={Boolean(selectedTransferItem)}
                item={selectedTransferItem}
                onClose={() => setSelectedTransferId(null)}
                onApprove={handleApproveTransfer}
                onDeny={handleDenyTransfer}
            />
        </>
    );
}
