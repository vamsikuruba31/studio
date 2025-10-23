
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import type { UserData } from '@/types/user';

interface AuthContextType {
  user: { uid: string; email: string } | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string; department: string; year: number; isAdmin?: boolean }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // On mount, try to load current user from API using stored token
  useEffect(() => {
    const load = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setLoading(false);
        setAuthChecked(true);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('unauthorized');
        const json = await res.json();
        setUser({ uid: json.user.uid, email: json.user.email });
        setUserData(json.user);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isLandingPage = pathname === "/";
    
    if (!user && !isAuthPage && !isLandingPage) {
      router.push("/login");
    } else if (user && (isAuthPage || isLandingPage)) {
      router.push("/dashboard");
    }
  }, [user, authChecked, pathname, router]);


  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || 'Login failed');
    }
    const { token, user } = await res.json();
    localStorage.setItem('token', token);
    setUser({ uid: user.uid, email: user.email });
    setUserData(user);
  };

  const signUp = async (payload: { name: string; email: string; password: string; department: string; year: number; isAdmin?: boolean }) => {
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body?.error || 'Signup failed');
    }
    // Return parsed body to caller for debugging/confirmation
    return body;
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserData(null);
  };
  
  // Do not render children until authentication status is confirmed
  if (!authChecked) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }


  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
