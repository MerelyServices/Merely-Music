import React, { createContext, useState } from 'react';
import { Platform } from 'react-native';

export type AuthContextParams = {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextParams | undefined>(undefined);

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string | null>(null);

  // Auto sign in
  if(!token && Platform.OS == 'web') {
    // Derive token from cookies
    if(document.cookie.includes('_passportToken=')) {
      const token = document.cookie.split('; ').filter((s) => s.startsWith('_passportToken='))[0].slice(15);
      setToken(token);
    }
  }

  function signIn(token: string) {
    setToken(token);
  }

  function signOut() {
    setToken(null);
    // Remove token from cookies to complete sign out
    if(Platform.OS == 'web' && document.cookie.includes('_passportToken=')) {
      document.cookie = `_passportToken=;domain=yiays.com;path=/;max-age=0`;
      document.cookie = `_passportProfile=;domain=yiays.com;path=/;max-age=0`;
    }
  }

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider