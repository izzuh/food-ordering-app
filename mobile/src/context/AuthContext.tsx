import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { refreshSession } from '../services/auth.service';
import type { User } from '../types/auth';

const ACCESS_TOKEN_KEY = 'food_ordering_access_token';
const REFRESH_TOKEN_KEY = 'food_ordering_refresh_token';
const USER_KEY = 'food_ordering_user';

interface AuthContextValue {
  accessToken: string | null;
  user: User | null;
  hydrated: boolean;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      AsyncStorage.getItem(ACCESS_TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN_KEY),
      AsyncStorage.getItem(USER_KEY),
    ]).then(([storedAccessToken, storedRefreshToken, rawUser]) => {
      if (!mounted) return;
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      if (rawUser) {
        try {
          setUser(JSON.parse(rawUser) as User);
        } catch {
          setUser(null);
        }
      }
    }).finally(() => {
      if (mounted) setHydrated(true);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!hydrated || !refreshToken) return;

    let active = true;
    const refresh = async () => {
      try {
        const result = await refreshSession(refreshToken);
        if (!active) return;
        setAccessToken(result.tokens.accessToken);
        setRefreshToken(result.tokens.refreshToken);
        setUser(result.user);
        await AsyncStorage.multiSet([
          [ACCESS_TOKEN_KEY, result.tokens.accessToken],
          [REFRESH_TOKEN_KEY, result.tokens.refreshToken],
          [USER_KEY, JSON.stringify(result.user)],
        ]);
      } catch {
        if (active) {
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
          await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
        }
      }
    };

    const timer = setInterval(refresh, 10 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [hydrated, refreshToken]);

  const value = useMemo<AuthContextValue>(() => ({
    accessToken,
    user,
    hydrated,
    signIn: async (nextAccessToken, nextRefreshToken, nextUser) => {
      setAccessToken(nextAccessToken);
      setRefreshToken(nextRefreshToken);
      setUser(nextUser);
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, nextAccessToken],
        [REFRESH_TOKEN_KEY, nextRefreshToken],
        [USER_KEY, JSON.stringify(nextUser)],
      ]);
    },
    signOut: async () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    },
  }), [accessToken, user, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
