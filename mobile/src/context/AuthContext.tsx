import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types/auth';

const TOKEN_KEY = 'food_ordering_access_token';
const USER_KEY = 'food_ordering_user';
interface AuthContextValue { accessToken: string | null; user: User | null; hydrated: boolean; signIn: (token: string, user: User) => Promise<void>; signOut: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null); const [user, setUser] = useState<User | null>(null); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { Promise.all([AsyncStorage.getItem(TOKEN_KEY), AsyncStorage.getItem(USER_KEY)]).then(([token, rawUser]) => { setAccessToken(token); if (rawUser) setUser(JSON.parse(rawUser)); }).finally(() => setHydrated(true)); }, []);
  const value = useMemo(() => ({ accessToken, user, hydrated, signIn: async (token: string, nextUser: User) => { setAccessToken(token); setUser(nextUser); await AsyncStorage.multiSet([[TOKEN_KEY, token], [USER_KEY, JSON.stringify(nextUser)]]); }, signOut: async () => { setAccessToken(null); setUser(null); await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]); } }), [accessToken, user, hydrated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
