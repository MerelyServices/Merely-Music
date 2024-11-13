'use client';

import axios, { AxiosRequestConfig } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserDatabase, User } from '@/models/database';
import { PassportProfile } from '@/models/passport';

export type DbContextParams = {
  token: string | null;
  profile: PassportProfile | null;
  user: User | null;
  localDb: UserDatabase | null;
  offline: boolean;
  signIn: (token: string, profile?: string) => void;
  signOut: () => void;
  apiCall: <T>(path:string) => Promise<T|number>;
  updateDb: (changes: UserDatabase) => void;
}

export const DbContext = createContext<DbContextParams | undefined>(undefined);
const AxiosInstance = axios.create({
  baseURL: __DEV__? 'http://192.168.1.101:3000': 'https://merely.yiays.com/music/api',
  timeout: 5000,
});

const DbProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string|null>(null);
  const [profile, setProfile] = useState<PassportProfile|null>(null);
  const [user, setUser] = useState<User|null>(null);
  const [localDb, setLocalDb] = useState<UserDatabase|null>(null);
  const [remoteDb, setRemoteDb] = useState<Omit<UserDatabase, 'lastSync'>|null>(null);
  const [offline, setOffline] = useState<boolean>(false);

  const syncThreshold = 1000 * 60 * 60 * 3; // 3 hours

  async function apiCall<T>(path='/', data={}, method:'get'|'post'='get'): Promise<T|number> {
    const options = {} as AxiosRequestConfig;
    let result;
    try {
      if(method == 'get')
        result = await AxiosInstance.get(path, options);
      else // post
        result = await AxiosInstance.post(path, data, options);
    } catch(error) {
      if(axios.isAxiosError(error)) {
        if(error.code == 'ECONNABORTED') {
          setOffline(true);
          return 404;
        }else if(error.status) {
          if(error.status == 401)
            signOut();
          return error.status;
        }
      }
      console.error(error);
      return -1; // Unknown error
    }

    if(result.status == 200) {
      setOffline(false);
      return result.data;
    }else{
      console.error("Unhandled api status code", result.status);
      return -1;
    }
  }

  function signIn(token: string, profile?: string) {
    setToken(token);
    if(Platform.OS != 'web')
      AsyncStorage.setItem('token', token);
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if(profile) {
      setProfile(JSON.parse(profile));
      if(Platform.OS != 'web')
        AsyncStorage.setItem('profile', profile);
    }
  }

  function signOut() {
    setToken(null);
    setProfile(null);
    setUser(null);
    AxiosInstance.defaults.headers.common['Authorization'] = undefined;
    // Remove token from cookies to complete sign out
    if(Platform.OS == 'web' && document.cookie.includes('_passportToken=')) {
      document.cookie = `_passportToken=;domain=yiays.com;path=/;max-age=0`;
      document.cookie = `_passportProfile=;domain=yiays.com;path=/;max-age=0`;
    }else{
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('profile');
    }
  }

  function sync(now=false): void {
    // Sync with the database, writing is not implemented yet
    // Give 30 seconds to allow for near misses
    //TODO: find and push changes
    if(!token)
      return; // Nothing to retreive
    if(!now && localDb && localDb.lastSync > (Date.now() - syncThreshold + 30000))
      return; // No need to sync yet
    apiCall<Omit<UserDatabase, 'lastSync'>>('/sync/', {}, 'post').then((result) => {
      if(typeof result == 'number')
        console.error('Sync failed', result);
      else {
        setRemoteDb(result);
        setLocalDb({...result, lastSync: Date.now()});
      }
    });
  }

  function updateDb(changes:UserDatabase): void {
    setLocalDb(changes);
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

    let syncer: NodeJS.Timeout|null = null;
    if(token && profile) {
      // Sync repeating task
      sync();
      syncer = setInterval(sync, syncThreshold);
    }else if(syncer){
      clearInterval(syncer);
      syncer = null;
    }
    
    return () => {if(syncer) clearInterval(syncer)}
  }, [token, profile, user]);

  useEffect(() => {
    // Sign in method support
    if(Platform.OS == 'web') {
      // Derive token from cookies
      if(document.cookie.includes('_passportToken=')) {
        const token = document.cookie.split('; ').filter((s) => s.startsWith('_passportToken='))[0].slice(15);
        signIn(token);
      }
      if(document.cookie.includes('_passportProfile=')) {
        const profile = document.cookie.split('; ').filter((s) => s.startsWith('_passportProfile='))[0].slice(17);
        setProfile(JSON.parse(profile));
      }

      // Detect sign in from another tab
      const passportBroadcast = new BroadcastChannel('passport_auth_event');
      passportBroadcast.onmessage = (ev) => {
        // User just logged in on another tab
        if(ev.data.startsWith('token='))
          signIn(ev.data.slice(6));
        if(ev.data.startsWith('profile='))
          setProfile(JSON.parse(ev.data.slice(8)));
      }
    } else {
      AsyncStorage.getItem('token').then((data) => {if(data) signIn(data)});
      AsyncStorage.getItem('profile').then((data) => {if(data) setProfile(data? JSON.parse(data): data)});
    }
  }, []);

  return (
    <DbContext.Provider
      value={{ token, profile, user, localDb, offline, signIn, signOut, apiCall, updateDb }}
    >
      {children}
    </DbContext.Provider>
  )
}

export default DbProvider;