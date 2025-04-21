import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  userId: number;
  username: string;
  userRole: string;
  exp?: number;
  iat?: number;
}

interface AuthState {
  accessToken: string | null;
  user: JwtPayload | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          set({ accessToken: token, user: decoded });
        } catch (err) {
          console.error("Invalid JWT", err);
          set({ accessToken: null, user: null });
        }
      },
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'auth',
    }
  )
);
