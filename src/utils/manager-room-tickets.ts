import { DormRoom, RoomTicketSummary } from '@/data/manager-management';
import {
    complaintRequests,
    issueRequests,
    transferRoomRequests,
} from '@/data/manager-requests';

export const getMockRoomTickets = (room: DormRoom): RoomTicketSummary[] => {
    if (room.occupied === 0) {
        return [];
    }

    const workTickets: RoomTicketSummary[] = [
        ...issueRequests,
        ...complaintRequests,
    ]
        .filter(
            (ticket) =>
                ticket.status !== 'Resolved' && ticket.room === room.code
        )
        .map((ticket) => ({
            id: ticket.id,
            title: ticket.title,
            type: ticket.id.startsWith('CMP') ? 'complaint' : 'issue',
            status: ticket.status as RoomTicketSummary['status'],
        }));

    const transferTickets: RoomTicketSummary[] = transferRoomRequests
        .filter(
            (ticket) =>
                ticket.status !== 'Resolved' &&
                (ticket.currentRoom === room.code ||
                    ticket.requestedRoom === room.code)
        )
        .map((ticket) => ({
            id: ticket.id,
            title: `${ticket.student} transfer request`,
            type: 'transfer',
            status: ticket.status as RoomTicketSummary['status'],
        }));

    return [...workTickets, ...transferTickets];
};
