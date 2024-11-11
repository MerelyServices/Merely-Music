import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [ welcomeDone, setWelcomeDone ] = useState<boolean | null>(null);
  const { getItem:retreiveWelcomeDone } = useAsyncStorage('welcome_done');

  useEffect(() => {
    (async () => {
      setWelcomeDone(Boolean(await retreiveWelcomeDone()));
    })()
  });

  if (welcomeDone === null) {
    return null;
  }

  return <Redirect href={welcomeDone?'/(tabs)/home':'/welcome'}/>
}