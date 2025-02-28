import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement actual authentication logic
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      // Mock authentication
      setUser({
        id: '1',
        email,
        displayName: email.split('@')[0],
        photoURL: null,
      });
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      // TODO: Implement Google sign in
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
    }
  };

  const signInWithGithub = async () => {
    try {
      setError(null);
      // TODO: Implement GitHub sign in
    } catch (err) {
      setError('Failed to sign in with GitHub');
      console.error(err);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      // TODO: Implement sign up
    } catch (err) {
      setError('Failed to sign up');
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      console.error(err);
    }
  };

  useEffect(() => {
    // TODO: Check for existing session
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signInWithEmail,
        signInWithGoogle,
        signInWithGithub,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}