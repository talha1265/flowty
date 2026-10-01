'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';

interface AuthContextType {
  user: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
  setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'unauthenticated',
  isLoggedIn: false,
  signOut: async () => {},
  setUser: () => {}
});

function InnerAuthConsumer({ children }: { children: React.ReactNode }) {
  const { data: session, status: nextAuthStatus } = useSession();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      setLocalUser(session.user);
    } else {
      // Check if user was set in local storage for instant fallback
      try {
        const cached = localStorage.getItem('flowty_user');
        if (cached) {
          setLocalUser(JSON.parse(cached));
        }
      } catch {
        // Ignore
      }
    }
  }, [session]);

  const activeUser = session?.user || localUser;
  const isLoggedIn = !!activeUser;
  const status = nextAuthStatus === 'loading' && !localUser ? 'loading' : (isLoggedIn ? 'authenticated' : 'unauthenticated');

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('flowty_user');
      setLocalUser(null);
      await nextAuthSignOut({ redirect: false });
    } catch {
      // Fallback
    }
    window.location.href = '/';
  };

  const setUser = (u: any) => {
    setLocalUser(u);
    try {
      if (u) {
        localStorage.setItem('flowty_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('flowty_user');
      }
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        status,
        isLoggedIn,
        signOut: handleSignOut,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerAuthConsumer>{children}</InnerAuthConsumer>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
