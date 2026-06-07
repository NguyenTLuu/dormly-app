import { dormStudents } from './manager-management';

export type ManagerChatRole = 'manager' | 'student';
export type ManagerConversationType = 'direct' | 'group';

export interface ManagerChatParticipant {
    id: string;
    name: string;
    initials: string;
    role: ManagerChatRole;
    detail: string;
    color: string;
    online?: boolean;
}

export interface ManagerChatMessage {
    id: string;
    senderId: string;
    text: string;
    time: string;
}

export interface ManagerConversation {
    id: string;
    name: string;
    type: ManagerConversationType;
    participantIds: string[];
    messages: ManagerChatMessage[];
    unreadCount: number;
}

export const currentManager: ManagerChatParticipant = {
    id: 'manager-current',
    name: 'Nguyen Minh Manager',
    initials: 'NM',
    role: 'manager',
    detail: 'Dormitory Manager',
    color: '#2563EB',
    online: true,
};

const managerParticipants: ManagerChatParticipant[] = [
    {
        id: 'manager-lan',
        name: 'Tran Ngoc Lan',
        initials: 'TL',
        role: 'manager',
        detail: 'Block A Manager',
        color: '#EA580C',
        online: true,
    },
    {
        id: 'manager-huy',
        name: 'Le Quang Huy',
        initials: 'LH',
        role: 'manager',
        detail: 'Block B Manager',
        color: '#7C3AED',
        online: false,
    },
    {
        id: 'manager-thao',
        name: 'Pham Thu Thao',
        initials: 'PT',
        role: 'manager',
        detail: 'Student Affairs Manager',
        color: '#0F766E',
        online: true,
    },
];

const studentColors = [
    '#2563EB',
    '#16A34A',
    '#9333EA',
    '#DB2777',
    '#0F766E',
    '#EA580C',
];

const studentParticipants: ManagerChatParticipant[] = dormStudents.map(
    (student, index) => ({
        id: `student-${student.id}`,
        name: student.fullName,
        initials: student.initials,
        role: 'student',
        detail: `${student.id} - Room ${student.room}`,
        color: studentColors[index % studentColors.length],
        online: index % 3 !== 1,
    })
);

export const managerChatParticipants: ManagerChatParticipant[] = [
    currentManager,
    ...managerParticipants,
    ...studentParticipants,
];

const initialConversations: ManagerConversation[] = [
    {
        id: 'direct-manager-lan',
        name: 'Tran Ngoc Lan',
        type: 'direct',
        participantIds: [currentManager.id, 'manager-lan'],
        unreadCount: 2,
        messages: [
            {
                id: 'dml-1',
                senderId: 'manager-lan',
                text: 'Can you review the room transfer requests this afternoon?',
                time: '10:12 AM',
            },
            {
                id: 'dml-2',
                senderId: currentManager.id,
                text: 'Yes, I will finish the pending requests before 3 PM.',
                time: '10:18 AM',
            },
            {
                id: 'dml-3',
                senderId: 'manager-lan',
                text: 'Thank you. I will handle the Block A inspections.',
                time: '10:20 AM',
            },
        ],
    },
    {
        id: 'direct-student-tran-phuoc',
        name: 'Tran Phuoc',
        type: 'direct',
        participantIds: [currentManager.id, 'student-2231200456'],
        unreadCount: 1,
        messages: [
            {
                id: 'dstp-1',
                senderId: 'student-2231200456',
                text: 'Hello, may I ask about the status of my maintenance request?',
                time: '9:35 AM',
            },
            {
                id: 'dstp-2',
                senderId: currentManager.id,
                text: 'The technician is scheduled to visit Room C102 tomorrow morning.',
                time: '9:42 AM',
            },
            {
                id: 'dstp-3',
                senderId: 'student-2231200456',
                text: 'Understood, thank you for the update.',
                time: '9:44 AM',
            },
        ],
    },
    {
        id: 'group-operations',
        name: 'Dormitory Operations',
        type: 'group',
        participantIds: [
            currentManager.id,
            'manager-lan',
            'manager-huy',
            'manager-thao',
        ],
        unreadCount: 3,
        messages: [
            {
                id: 'go-1',
                senderId: 'manager-huy',
                text: 'The monthly fire safety inspection is confirmed for Friday.',
                time: 'Yesterday',
            },
            {
                id: 'go-2',
                senderId: 'manager-thao',
                text: 'I will notify students in Blocks A and B today.',
                time: 'Yesterday',
            },
            {
                id: 'go-3',
                senderId: currentManager.id,
                text: 'I will prepare the inspection checklist.',
                time: 'Yesterday',
            },
            {
                id: 'go-4',
                senderId: 'manager-lan',
                text: 'Please share it here when it is ready.',
                time: '8:15 AM',
            },
        ],
    },
    {
        id: 'group-block-c',
        name: 'Block C Resident Support',
        type: 'group',
        participantIds: [
            currentManager.id,
            'manager-thao',
            'student-2231200456',
            'student-2231200888',
            'student-2231201033',
        ],
        unreadCount: 0,
        messages: [
            {
                id: 'gc-1',
                senderId: currentManager.id,
                text: 'Please report any water pressure issues in this group.',
                time: 'May 20',
            },
            {
                id: 'gc-2',
                senderId: 'student-2231200888',
                text: 'Water pressure in Room C202 is normal now.',
                time: 'May 20',
            },
            {
                id: 'gc-3',
                senderId: 'student-2231201033',
                text: 'Room C203 is also working normally. Thank you.',
                time: 'May 20',
            },
        ],
    },
    {
        id: 'direct-manager-huy',
        name: 'Le Quang Huy',
        type: 'direct',
        participantIds: [currentManager.id, 'manager-huy'],
        unreadCount: 0,
        messages: [
            {
                id: 'dmh-1',
                senderId: currentManager.id,
                text: 'Do you need support with the Block B room audit?',
                time: 'May 18',
            },
            {
                id: 'dmh-2',
                senderId: 'manager-huy',
                text: 'Everything is on schedule. I will send the summary tomorrow.',
                time: 'May 18',
            },
        ],
    },
];

export const managerConversations = [...initialConversations];

export const getManagerChatParticipant = (id: string) =>
    managerChatParticipants.find((participant) => participant.id === id);

export const getManagerConversation = (id: string) =>
    managerConversations.find((conversation) => conversation.id === id);

export const getConversationPreview = (conversation: ManagerConversation) => {
    const lastMessage = conversation.messages.at(-1);
    const sender = lastMessage
        ? getManagerChatParticipant(lastMessage.senderId)
        : undefined;

    return {
        text: lastMessage
            ? `${conversation.type === 'group' ? `${lastMessage.senderId === currentManager.id ? 'You' : sender?.name}: ` : ''}${lastMessage.text}`
            : 'Start the conversation',
        time: lastMessage?.time ?? 'New',
    };
};

export const createMockManagerGroup = (
    name: string,
    selectedParticipantIds: string[]
) => {
    const conversation: ManagerConversation = {
        id: `group-${Date.now()}`,
        name,
        type: 'group',
        participantIds: [currentManager.id, ...selectedParticipantIds],
        unreadCount: 0,
        messages: [],
    };

    managerConversations.unshift(conversation);
    return conversation;
};
