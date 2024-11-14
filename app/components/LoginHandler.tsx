import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useContext, useEffect, useState } from "react";

import { baseStyles } from "@/constants/Stylesheet";
import { DbContext } from "@/context/database";
import { Text } from "@/components/Themed";

const includeQuery = '&includeToken=1&includeProfile=1';
export const loginUrl = 'https://passport.yiays.com/?redirect=' + (Platform.OS == 'web'?
  (__DEV__? encodeURIComponent('http://localhost:8081') + includeQuery : 'https://music.yiays.com/'):
  encodeURIComponent('merelymusic://account') + includeQuery
);

interface LoginHandlerProps {
  children: React.ReactNode;
  url: string|null;
}

export function LoginHandler(props:LoginHandlerProps) {
  const [url, setUrl] = useState<string|null>(null);
  const authctx = useContext(DbContext);

  if(url != props.url) {
    console.log("new url", props.url);
    setUrl(props.url);
  }

  useEffect(() => {
    if(url) {
      const { queryParams } = Linking.parse(url)
      if(queryParams) {
        const token = queryParams['token'] || null;
        const profile = queryParams['profile'] || null;
        if(typeof token == 'string' && typeof profile == 'string') {
          if(authctx)
            authctx.signIn(token, profile);
          else
            console.error("Received login data, but unable to process here.");
        }
      }
    }
  }, [url]);

  return props.children;
}

export function LoginButton(props: Omit<React.ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link
    style={styles.button}
    // @ts-expect-error: External URLs are not typed.
    href={loginUrl}
    onPress={(e) => {
      if(Platform.OS != 'web') {
        e.preventDefault();
        WebBrowser.openBrowserAsync(loginUrl);
      }
    }}>
      <Text style={styles.linkText}>Sign in with Passport</Text>
    </Link>
  )
}

const styles = { ...baseStyles };