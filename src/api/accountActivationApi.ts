import type { ApiResponse } from '@/types/api';
import type { ResidentAcademicProfile } from '@/types/residentProfile';
import { getResidentUsers, toggleResidentAccount } from './managerResidentApi';
import { axiosClient } from './axiosClient';

export interface InactiveResidentAccount {
    id: string;
    name: string;
    email: string;
    studentId: string | null;
    major: string | null;
    createdAt: string | null;
}

function isResident(roles: string[]): boolean {
    return roles.some(
        (role) => role.replace(/^ROLE_/i, '').toUpperCase() === 'USER'
    );
}

export async function getInactiveResidentAccounts(): Promise<InactiveResidentAccount[]> {
    const [users, profilesResponse] = await Promise.all([
        getResidentUsers(),
        axiosClient.get<ApiResponse<ResidentAcademicProfile[]>>(
            '/api/users/profile/student-profiles'
        ),
    ]);
    const profiles = new Map(
        profilesResponse.data.result.map((profile) => [profile.id, profile])
    );

    return users
        .filter((user) => !user.isActive && isResident(user.roles))
        .filter((user) => profiles.has(user.id))
        .map((user) => {
            const profile = profiles.get(user.id);
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                studentId: profile?.studentCode ?? null,
                major: profile?.major ?? null,
                createdAt: user.createdAt ?? null,
            };
        })
        .sort((a, b) =>
            (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        );
}

export async function activateResidentAccount(id: string): Promise<void> {
    // The backend only has a toggle endpoint, so check the latest state first.
    const user = (await getResidentUsers()).find((item) => item.id === id);
    if (!user || user.isActive || !isResident(user.roles)) {
        throw new Error('This account is no longer eligible for activation. Refresh the list.');
    }
    const updated = await toggleResidentAccount(id);
    if (!updated.isActive) {
        throw new Error('The account was not activated. Refresh the list.');
    }
}
