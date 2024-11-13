'use client';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/components/useColorScheme';
import DbProvider from '@/context/database';
import { LoginHandler } from '@/components/LoginHandler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const deepLinkUrl = Linking.useURL();
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [ welcomeDone, setWelcomeDone ] = useState<boolean | null>(null);
  const { getItem:retreiveWelcomeDone } = useAsyncStorage('welcome_done');

  useEffect(() => {
    (async () => {
      setWelcomeDone(Boolean(await retreiveWelcomeDone()));
    })();
  }, []);

  useEffect(() => {
    if (loaded && welcomeDone !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || welcomeDone === null) {
    return null;
  }

  return (
    <DbProvider>
      <LoginHandler url={deepLinkUrl}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName={welcomeDone?'(tabs)':'welcome'}>
            <Stack.Screen name="welcome" options={{headerShown: false, title: "Welcome" }}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Back" }} />
            <Stack.Screen name="about" options={{ presentation: 'modal', title: "About" }} />
            <Stack.Screen name="account" options={{ presentation: 'modal', title: "Account" }} />
          </Stack>
        </ThemeProvider>
      </LoginHandler>
    </DbProvider>
  );
}
