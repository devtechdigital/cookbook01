import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  acceptInvite: (token: string, password: string) => Promise<void>;
}

// Default Family Head credentials
const DEFAULT_HEAD = {
  email: 'head@family.com',
  password: 'family123',
  user: {
    id: 'default-head',
    email: 'head@family.com',
    name: 'Family Head',
  },
};

// Simulated user storage with default head
const users: Record<string, { password: string; user: User }> = {
  [DEFAULT_HEAD.email]: {
    password: DEFAULT_HEAD.password,
    user: DEFAULT_HEAD.user,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const userRecord = users[email];
        
        if (!userRecord || userRecord.password !== password) {
          throw new Error('Invalid email or password');
        }

        set({ user: userRecord.user, isAuthenticated: true });
      },

      register: async (email: string, password: string, name: string) => {
        if (users[email]) {
          throw new Error('Email already registered');
        }

        const newUser = {
          id: crypto.randomUUID(),
          email,
          name,
        };

        users[email] = {
          password,
          user: newUser,
        };

        set({ user: newUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      acceptInvite: async (token: string, password: string) => {
        // In a real app, this would validate the invite token and create the account
        const mockUser = {
          id: crypto.randomUUID(),
          email: 'invited@example.com',
          name: 'Invited User',
        };

        set({ user: mockUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);