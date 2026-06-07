export interface ManagerProfile {
    name: string;
    employeeId: string;
    role: string;
    email: string;
    phone: string;
    assignedArea: string;
}

export const managerProfile: ManagerProfile = {
    name: 'Nguyen Minh Manager',
    employeeId: 'MGR-001',
    role: 'Dormitory Manager',
    email: 'manager@dormly.com',
    phone: '0909 123 456',
    assignedArea: 'All dormitory blocks',
};
