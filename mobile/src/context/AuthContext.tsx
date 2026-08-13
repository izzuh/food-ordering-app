import React, { createContext, useContext, useMemo, useState } from 'react';

interface AuthContextValue {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const value = useMemo(() => ({ accessToken, setAccessToken, signOut: () => setAccessToken(null) }), [accessToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
