import { RoomTicketType } from '@/data/manager-management';

export interface RoomCardTheme {
    backgroundColor: string;
    borderColor: string;
    accentColor: string;
    label: string;
}

export const getRoomCardTheme = (
    occupied: number,
    ticketTypes: RoomTicketType[]
): RoomCardTheme => {
    const uniqueTypes = Array.from(new Set(ticketTypes));

    if (uniqueTypes.length > 1) {
        return {
            backgroundColor: '#FEF2F2',
            borderColor: '#FCA5A5',
            accentColor: '#DC2626',
            label: 'Multiple tickets',
        };
    }

    if (uniqueTypes[0] === 'issue') {
        return {
            backgroundColor: '#FFF7ED',
            borderColor: '#FDBA74',
            accentColor: '#EA580C',
            label: 'Issue',
        };
    }

    if (uniqueTypes[0] === 'complaint') {
        return {
            backgroundColor: '#FAF5FF',
            borderColor: '#D8B4FE',
            accentColor: '#7E22CE',
            label: 'Complaint',
        };
    }

    if (uniqueTypes[0] === 'transfer') {
        return {
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            accentColor: '#16A34A',
            label: 'Transfer',
        };
    }

    if (occupied === 0) {
        return {
            backgroundColor: '#F8FAFC',
            borderColor: '#CBD5E1',
            accentColor: '#64748B',
            label: 'Empty',
        };
    }

    return {
        backgroundColor: '#EFF6FF',
        borderColor: '#93C5FD',
        accentColor: '#2563EB',
        label: 'Normal',
    };
};
