import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Theme } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { baseStyles } from '@/constants/Stylesheet';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.toolbarIcon} {...props} />;
}

function headerRight() {
  const colorScheme = useColorScheme();
  return <View style={styles.headerRight}>
    <Link href="/about" asChild>
      <TouchableOpacity>
        <FontAwesome
          name="info-circle"
          size={35}
          color={Theme[colorScheme ?? 'light'].text}
          style={{ marginTop:-2.75, ...styles.headerButton }}
        />
      </TouchableOpacity>
    </Link>
    <Link href="/account" asChild>
      <TouchableOpacity>
        <FontAwesome
          name="user-circle"
          size={30}
          color={Theme[colorScheme ?? 'light'].text}
          style={styles.headerButton}
        />
      </TouchableOpacity>
    </Link>
  </View>
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: Theme[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Merely Music',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: 'Home',
          headerRight: headerRight,
        }}
      />
      <Tabs.Screen
        name="offline"
        options={{
          title: 'Offline',
          tabBarIcon: ({ color }) => <TabBarIcon name="cloud-download" color={color} />,
          headerRight: headerRight,
        }}
      />
    </Tabs>
  );
}

const styles = {
  ...baseStyles,
  ...StyleSheet.create({
    toolbarIcon: {
      marginBottom: -1,
      paddingRight: 3,
      width: 34,
      textAlign: 'center',
    }
  })
}