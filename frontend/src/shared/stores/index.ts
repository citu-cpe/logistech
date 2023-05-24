import { CompanyDTOTypeEnum, UserDTO, UserDTORoleEnum } from 'generated-api';
import create from 'zustand';
import { LocalStorageKeys } from '../enums/localStorageKeys';

interface AuthState {
  getUser: () => UserDTO | undefined;
  setUser: (user: UserDTO) => void;
  removeUser: () => void;
  companyId: string | undefined;
  companyType: CompanyDTOTypeEnum | undefined;
  user: UserDTO | undefined;
  userId: string | undefined;
  userRole: UserDTORoleEnum | undefined;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  userId: undefined,
  userRole: undefined,
  companyId: undefined,
  companyType: undefined,
  getUser: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER);

    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  },
  setUser: (user: UserDTO) => {
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));

    set((state) => ({
      ...state,
      user,
      userId: user.id,
      userRole: user.role,
      companyId: user.company?.id,
      companyType: user.company?.type,
    }));
  },
  removeUser: () => {
    localStorage.removeItem(LocalStorageKeys.USER);

    set((state) => ({
      ...state,
      user: undefined,
      userId: undefined,
      userRole: undefined,
      companyId: undefined,
    }));
  },
}));
