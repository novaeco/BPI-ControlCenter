import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { refreshTokenRequest, loginRequest } from '../api/auth';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthContextValue {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  ensureFreshToken: () => Promise<string | null>;
}

const STORAGE_KEY = 'bpi-controlcenter-tokens';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredTokens = (): AuthTokens | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AuthTokens;
    return parsed;
  } catch (error) {
    console.error('Unable to parse stored tokens', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(() => readStoredTokens());

  useEffect(() => {
    if (tokens) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [tokens]);

  const logout = useCallback(() => {
    setTokens(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000
    });
  }, []);

  const ensureFreshToken = useCallback(async (): Promise<string | null> => {
    if (!tokens) {
      return null;
    }
    if (Date.now() < tokens.expiresAt - 5000) {
      return tokens.accessToken;
    }
    try {
      const refreshed = await refreshTokenRequest(tokens.refreshToken);
      const nextTokens: AuthTokens = {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: Date.now() + refreshed.expiresIn * 1000
      };
      setTokens(nextTokens);
      return nextTokens.accessToken;
    } catch (error) {
      console.error('Unable to refresh access token', error);
      logout();
      return null;
    }
  }, [logout, tokens]);

  const value = useMemo<AuthContextValue>(
    () => ({
      tokens,
      isAuthenticated: Boolean(tokens),
      login,
      logout,
      ensureFreshToken
    }),
    [tokens, login, logout, ensureFreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
