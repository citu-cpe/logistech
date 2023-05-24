import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LocalStorageKeys } from '../../../shared/enums/localStorageKeys';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useAuthStore } from '../../../shared/stores';

export const useLogout = () => {
  const api = useContext(ApiContext);
  const removeUser = useAuthStore((state) => state.removeUser);
  const router = useRouter();
  const { user } = useAuthStore();

  return useMutation(() => api.logOut({ id: user!.id }), {
    onSuccess: () => {
      removeUser();

      localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
      localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);

      router.push('/login');
    },
  });
};
