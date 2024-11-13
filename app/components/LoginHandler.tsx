import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "@/context/database";

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
          console.log(token, profile);
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