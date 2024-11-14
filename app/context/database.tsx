'use client';

import axios, { AxiosRequestConfig } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserDatabase, User } from '@/models/database';
import { PassportProfile } from '@/models/passport';

export interface DbContextParams {
  token: string|null|undefined,
  passportProfile: PassportProfile|null|undefined,
  user: User|null|undefined,
  localDb: UserDatabase|null|undefined,
  offline: boolean,
  signIn: (token: string, profile: string) => void,
  signOut: () => void,
  apiCall: <T>(path:string) => Promise<T|number>,
  updateDb: (changes: UserDatabase) => void,
}

export const DbContext = createContext<DbContextParams | undefined>(undefined);
const AxiosInstance = axios.create({
  baseURL: __DEV__? 'http://192.168.1.101:3000': 'https://music.yiays.com/api',
  timeout: 5000,
});

function markReady<T>(prev:T): T|null {
  return (typeof prev == 'undefined'? null: prev)
}

const DbProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string|null|undefined>();
  const [passportProfile, setPassportProfile] = useState<PassportProfile|null|undefined>();
  const [user, setUser] = useState<User|null|undefined>();
  const [localDb, setLocalDb] = useState<UserDatabase|null|undefined>();
  const [remoteDb, setRemoteDb] = useState<Omit<UserDatabase, 'lastSync'>|null>(null);
  const [offline, setOffline] = useState<boolean>(false);

  const localStorageDefaults = { token:null, passportProfile:null, user:null, localDb:null };
  const syncThreshold = 1000 * 60 * 10; // 10 minutes

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

  function signIn(token: string, profile: string) {
    // Called when a new token and profile have been given to the client
    console.log("Sign in called");

    // Handle token
    setToken(token);
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Handle profile
    //TODO: refresh the profile from time to time by querying Passport too
    setPassportProfile(JSON.parse(profile));

    // Set other values as null to confirm they are ready to be fetched
    setUser(null);
    setLocalDb(null);
  }

  function signOut() {
    console.log("Signing out...");
    setToken(null);
    setPassportProfile(null);
    setUser(null);
    setLocalDb(null);
    
    AxiosInstance.defaults.headers.common['Authorization'] = undefined;
    // Remove token from cookies to complete sign out
    if(Platform.OS == 'web' && document.cookie.includes('_passportToken=')) {
      // Clear cookies to log out everywhere
      document.cookie = `_passportToken=;domain=yiays.com;path=/;max-age=0`;
      document.cookie = `_passportProfile=;domain=yiays.com;path=/;max-age=0`;
      // Announce sign out event to any other open tabs
      const passportBroadcast = new BroadcastChannel('passport_auth_event');
      passportBroadcast.postMessage('token=');
      passportBroadcast.postMessage('profile=');
    }
  }

  async function getUser() {
    console.log("Fetching user data...");
    if(user) {
      console.log("Skipping as it's already stored.");
      return;
    }
    const result = await apiCall<User>('/user/');
    if(typeof result == 'number') {
      console.error("Fetching user failed", result);
      setTimeout(getUser, 5000);
    } else {
      console.log("Found user", result.id);
      setUser(result);
    }
  }

  function sync(now=false): void {
    // Sync with the database, writing is not implemented yet
    //TODO: find and push changes
    if(!token)
      return; // Nothing to retreive
    if(!now && localDb && localDb.lastSync > (Date.now() - syncThreshold + 30000))
      return; // No need to sync yet
    console.log("Syncing user data with api...");
    apiCall<Omit<UserDatabase, 'lastSync'>>('/sync/', {}, 'post').then((result) => {
      if(typeof result == 'number')
        console.error('Sync failed', result);
      else {
        setRemoteDb(result);
        setLocalDb({...result, lastSync: Date.now()});
      }
    });
  }

  function updateDb(changes:React.SetStateAction<UserDatabase|null|undefined>): void {
    setLocalDb(changes);
    sync(true);
  }
  
  useEffect(() => {
    if(
      typeof token == 'undefined' || typeof passportProfile == 'undefined' ||
      typeof user == 'undefined' || typeof localDb == 'undefined'
    ) {
      console.log("Waiting for AsyncStorage before syncing...");
      return; // AsyncStorage is still working...
    }

    if(!token || !passportProfile)
      return; // User is not signed in
    
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if(!user) {
      getUser();
    }

    // Use a debouncer to reduce calls when lots of changes happen at the same time
    const debouncer = setTimeout(() => {
      // Create a local storage task
      const snapshot = {
        ...(
          Platform.OS == 'web' && !__DEV__ ? {} :
          { token:token, passportProfile: passportProfile? JSON.stringify(passportProfile): null }
        ),
        user: passportProfile? JSON.stringify(user): null,
        localDb: passportProfile? JSON.stringify(localDb): null
      };
      console.log(1, snapshot);
      const entries = Object.entries(snapshot).filter((v) => v[1] != null) as [string, string][];
      console.log(2, entries);
      if(entries.length)
        AsyncStorage.multiSet(entries);
      const stored =  Object.fromEntries(entries);
      console.log(3, stored);
      const missing = Object.keys(localStorageDefaults).filter((k) => !(k in stored));
      console.log(4, missing);
      if(missing.length)
        AsyncStorage.multiRemove(missing);
      console.log("Saved state to device storage");
    }, 1000);

    
    return () => {
      if(debouncer) clearTimeout(debouncer);
    }
  }, [token, passportProfile, user, localDb]);

  useEffect(() => {
    if(!token || !passportProfile)
      return; // Not ready to sync yet

    let syncer: NodeJS.Timeout|undefined;

    // Use a debouncer to reduce calls when lots of changes happen at the same time
    const debouncer = setTimeout(() => {
      // Create a sync task
      sync(true);
      syncer = setInterval(sync, syncThreshold);
    }, 1000);

    return () => {
      if(syncer) clearInterval(syncer);
      if(debouncer) clearTimeout(debouncer);
    }
  }, [token, passportProfile]);

  useEffect(() => {
    // Sign in method support
    if(Platform.OS == 'web' && !__DEV__) {
      // Derive token from cookies provided by Passport
      if(document.cookie.includes('_passportToken=')) {
        const token = document.cookie.split('; ').filter((s) => s.startsWith('_passportToken='))[0].slice(15);
        setToken(token);
      }
      if(document.cookie.includes('_passportProfile=')) {
        const profile = document.cookie.split('; ').filter((s) => s.startsWith('_passportProfile='))[0].slice(17);
        setPassportProfile(JSON.parse(profile));
      }

      // Detect sign in from Passport running in another tab
      const passportBroadcast = new BroadcastChannel('passport_auth_event');
      passportBroadcast.onmessage = (ev) => {
        // User just logged in on another tab
        if(ev.data.startsWith('token='))
          setToken(ev.data.slice(6) || null);
        if(ev.data.startsWith('profile='))
          setPassportProfile(ev.data.slice(8)? JSON.parse(ev.data.slice(8)): null);
      }
      AsyncStorage.multiGet(['user', 'localDb']).then((results) => {
        // Default values
        setToken(markReady);
        setPassportProfile(markReady);
        setUser(markReady);
        setLocalDb(markReady);
        results.forEach((result) => {
          if(result[0] == 'user' && result[1])
            setUser(JSON.parse(result[1]));
          if(result[0] == 'localDb' && result[1])
            setLocalDb(JSON.parse(result[1]));
        });
      });
    } else {
      AsyncStorage.multiGet(['token', 'profile', 'user', 'localDb']).then((results) => {
        // Default values
        setToken(markReady);
        setPassportProfile(markReady);
        setUser(markReady);
        setLocalDb(markReady);
        results.forEach((result) => {
          if(result[0] == 'token' && result[1])
            setToken(result[1]);
          else if(result[0] == 'profile' && result[1])
            setPassportProfile(JSON.parse(result[1]));
          else if(result[0] == 'user' && result[1])
            setUser(JSON.parse(result[1]));
          else if(result[0] == 'localDb' && result[1])
            setLocalDb(JSON.parse(result[1]));
        });
      });
    }
  }, []);

  return (
    <DbContext.Provider
      value={{ token, passportProfile, user, localDb, offline, signIn, signOut, apiCall, updateDb }}
    >
      {children}
    </DbContext.Provider>
  )
}

export default DbProvider;