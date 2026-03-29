import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string; name: string; email: string; phone: string; role: string; lang: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('kull_token', token);
    await SecureStore.setItemAsync('kull_user', JSON.stringify(user));
    set({ user, token });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('kull_token');
    await SecureStore.deleteItemAsync('kull_user');
    set({ user: null, token: null });
  },
  init: async () => {
    const token = await SecureStore.getItemAsync('kull_token');
    const userStr = await SecureStore.getItemAsync('kull_user');
    if (token && userStr) set({ token, user: JSON.parse(userStr) });
  },
}));
