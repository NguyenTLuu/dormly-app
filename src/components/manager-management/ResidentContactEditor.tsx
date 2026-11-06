import { updateResidentContact } from '@/api/residentProfileApi';
import { useRefreshRoomManagement } from '@/hooks/useRoomManagement';
import type { AdminUser } from '@/types/admin';
import {
    profileBirthDate,
    residentContactError,
} from '@/utils/resident-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import {
    ManagementButton,
    ManagementInput,
    ManagementSheet,
} from './ManagementFormControls';
import { managementError } from './managementError';

export default function ResidentContactEditor({
    user,
    onClose,
}: {
    user: AdminUser;
    onClose: () => void;
}) {
    const [name, setName] = useState(user.fullName || '');
    const [phone, setPhone] = useState(user.phoneNumber || '');
    const [birthDate, setBirthDate] = useState(
        user.dateOfBirth?.slice(0, 10) || ''
    );
    const queryClient = useQueryClient();
    const refreshRooms = useRefreshRoomManagement();
    const mutation = useMutation({
        mutationFn: () =>
            updateResidentContact(user.id, {
                fullName: name.trim(),
                ...(phone.trim() ? { phoneNumber: phone.trim() } : {}),
                ...(birthDate.trim()
                    ? { dateOfBirth: profileBirthDate(birthDate.trim())! }
                    : {}),
            }),
        onSuccess: async () => {
            await Promise.all([
                refreshRooms(),
                queryClient.invalidateQueries({
                    queryKey: ['manager-resident-users'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['manager-resident-documents'],
                }),
                queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
            ]);
            toast.success('Resident contact updated');
            onClose();
        },
        onError: (error) =>
            toast.error(
                managementError(error, 'Could not update resident contact')
            ),
    });
    const submit = () => {
        const error = residentContactError(
            name,
            phone,
            birthDate,
            Boolean(user.phoneNumber),
            Boolean(user.dateOfBirth)
        );
        if (error) return toast.error(error);
        mutation.mutate();
    };
    return (
        <ManagementSheet
            title="Edit resident contact"
            onClose={onClose}
            busy={mutation.isPending}
        >
            <Text className="text-slate-600">
                Academic details are maintained by the resident. This form
                updates supported account fields only.
            </Text>
            <ManagementInput
                label="Full name"
                value={name}
                onChangeText={setName}
                editable={!mutation.isPending}
            />
            <ManagementInput
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
                editable={!mutation.isPending}
                keyboardType="phone-pad"
            />
            <ManagementInput
                label="Birth date (YYYY-MM-DD)"
                value={birthDate}
                onChangeText={setBirthDate}
                editable={!mutation.isPending}
                autoCapitalize="none"
            />
            <ManagementButton
                label={mutation.isPending ? 'Saving...' : 'Save contact'}
                onPress={submit}
                disabled={mutation.isPending}
            />
        </ManagementSheet>
    );
}
