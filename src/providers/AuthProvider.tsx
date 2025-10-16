import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { refreshTokenRequest, loginRequest } from '../api/auth';
import { useLocalStorage } from '../utils/hooks';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useLocalStorage<AuthTokens | null>(STORAGE_KEY, null);

  const logout = useCallback(() => {
    setTokens(null);
  }, [setTokens]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000
    });
  }, [setTokens]);

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
  }, [logout, setTokens, tokens]);

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
