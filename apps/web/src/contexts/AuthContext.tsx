import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  plan: 'free' | 'starter' | 'pro' | 'agency';
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'admin' | 'manager' | 'member' | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'manager' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const savedToken = localStorage.getItem('lr_token')
    if (!savedToken) {
      setLoading(false)
      return
    }

    async function verifySession() {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s hard timeout
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${savedToken}` }, signal: controller.signal }
        )
        clearTimeout(timeoutId)
        if (!res.ok) throw new Error('Invalid token')
        const userData = await res.json()
        setUser(userData)
        setToken(savedToken)
        setRole(userData.role)
      } catch {
        clearTimeout(timeoutId)
        localStorage.removeItem('lr_token')
        setUser(null)
        setToken(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [])

  async function signIn(email: string, password: string) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    )
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Login failed')
    }
    const { token: newToken, user: userData } = await res.json()
    localStorage.setItem('lr_token', newToken)
    setToken(newToken)
    setUser(userData)
    setRole(userData.role)
  }

  async function signOut() {
    localStorage.removeItem('lr_token')
    setToken(null)
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, role, loading, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};