import { useMutation } from '@tanstack/react-query';

import { loginApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';

export function useLogin() {
    const { setAuthTokens } = useAuth();

    return useMutation({
        mutationFn: loginApi,

        onSuccess: async (tokens) => {
            await setAuthTokens(tokens);
        },
    });
}
