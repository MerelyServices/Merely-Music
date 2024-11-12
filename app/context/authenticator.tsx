import { DbCache, User } from '@/models/database';
import { PassportProfile } from '@/models/passport';
import axios, { AxiosResponse } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type AuthContextParams = {
  token: string | null;
  profile: PassportProfile | null;
  user: User | null;
  dbCache: DbCache | null;
  signIn: (token: string) => void;
  signOut: () => void;
  apiCall: <T>(path:string) => Promise<T|number>;
  sync: (changes?: Partial<DbCache>, now?: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextParams | undefined>(undefined);

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string|null>(null);
  const [profile, setProfile] = useState<PassportProfile|null>(null);
  const [user, setUser] = useState<User|null>(null);
  const [dbCache, setDbCache] = useState<DbCache|null>(null);
  const [baseDbCache, setBaseDbCache] = useState<Omit<DbCache, 'lastSync'>|null>(null);

  const apiUrl = __DEV__? 'http://localhost:3000': 'https://merely.yiays.com/music/api';
  const syncThreshold = 1000 * 60 * 60 * 3; // 3 hours

  // Auto sign in
  if(!token && Platform.OS == 'web') {
    // Derive token from cookies
    if(document.cookie.includes('_passportToken=')) {
      const token = document.cookie.split('; ').filter((s) => s.startsWith('_passportToken='))[0].slice(15);
      signIn(token);
    }
    if(document.cookie.includes('_passportProfile=')) {
      const profile = document.cookie.split('; ').filter((s) => s.startsWith('_passportProfile='))[0].slice(17);
      setProfile(JSON.parse(profile));
    }
  }

  async function apiCall<T>(path='/', data={}, method:'get'|'post'='get'): Promise<T|number> {
    let result;
    if(method == 'get')
      result = await axios.get(apiUrl+path, {});
    else // post
      result = await axios.post(apiUrl+path, data);

    if(result.status == 200) {
      return result.data;
    }
    if(result.status == 401) signOut();
    return result.status;
  }

  async function sync(changes?:Partial<DbCache>, now=false): Promise<void> {
    // Sync with the database, writing is not implemented yet
    // Give 30 seconds to allow for near misses
    if(!now && dbCache && dbCache.lastSync > (Date.now() - syncThreshold + 30000))
      return // No need to sync yet
    apiCall<Omit<DbCache, 'lastSync'>>('/sync/', {}, 'post').then((result) => {
      if(typeof result == 'number')
        console.error('Sync failed', result);
      else {
        setBaseDbCache(result);
        setDbCache({...result, lastSync: Date.now()});
      }
    });
  }

  function signIn(token: string) {
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  function signOut() {
    setToken(null);
    setProfile(null);
    axios.defaults.headers.common['Authorization'] = undefined;
    // Remove token from cookies to complete sign out
    if(Platform.OS == 'web' && document.cookie.includes('_passportToken=')) {
      document.cookie = `_passportToken=;domain=yiays.com;path=/;max-age=0`;
      document.cookie = `_passportProfile=;domain=yiays.com;path=/;max-age=0`;
    }
  }
  
  useEffect(() => {
    if(token && !user) {
      apiCall<User>('/user/').then((result) => {
        if(typeof result == 'number')
          console.error("Authentication failed", result);
        else
          setUser(result);
      });
    }

    // Sync repeating task
    sync();
    setInterval(sync, syncThreshold);
  }, []);

  return (
    <AuthContext.Provider value={{ token, profile, user, dbCache, signIn, signOut, apiCall, sync }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;