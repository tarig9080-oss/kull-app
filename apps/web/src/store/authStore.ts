import { create } from 'zustand';
import { User } from '@kull/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('kull_token', token);
    localStorage.setItem('kull_user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('kull_token');
    localStorage.removeItem('kull_user');
    set({ user: null, token: null });
  },
  init: () => {
    const token = localStorage.getItem('kull_token');
    const userStr = localStorage.getItem('kull_user');
    if (token && userStr) set({ token, user: JSON.parse(userStr) });
  },
}));
