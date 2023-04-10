import { UserDTO } from "generated-api";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export enum SecureStoreKeys {
  USER = "USER",
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

interface AuthState {
  isLoading: boolean;
  isLogout: boolean;
  user: UserDTO | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  getUser: () => void;
  setUser: (user: UserDTO) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isLogout: false,
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  getUser: async () => {
    const user = await SecureStore.getItemAsync(SecureStoreKeys.USER);

    set((state) => ({
      ...state,
      isLoading: false,
      user: user ? JSON.parse(user) : undefined,
    }));
  },
  setUser: async (user: UserDTO) => {
    await SecureStore.setItemAsync(SecureStoreKeys.USER, JSON.stringify(user));

    set((state) => ({ ...state, isLogout: false, user }));
  },
  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(SecureStoreKeys.USER),
      SecureStore.deleteItemAsync(SecureStoreKeys.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(SecureStoreKeys.REFRESH_TOKEN),
    ]);

    set((state) => ({
      ...state,
      isLogout: true,
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    }));
  },
  setAccessToken: async (accessToken: string) => {
    await SecureStore.setItemAsync(SecureStoreKeys.ACCESS_TOKEN, accessToken);
    set((state) => ({ ...state, accessToken }));
  },
  setRefreshToken: async (refreshToken: string) => {
    await SecureStore.setItemAsync(SecureStoreKeys.REFRESH_TOKEN, refreshToken);
    set((state) => ({ ...state, refreshToken }));
  },
}));
