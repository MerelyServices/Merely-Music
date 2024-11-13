import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'expo-router';

import { Spacer, Text, View } from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';
import { baseStyles } from '@/constants/Stylesheet';
import { FontAwesome } from '@expo/vector-icons';
import { Theme } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AboutScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={{ flexGrow:0 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/images/icon.png')} resizeMode='contain'/>
        <Text style={styles.title}>Merely Music</Text>
        <Text style={styles.subtitle}>Version {Constants.expoConfig?.version || 'unknown'}</Text>
        <Spacer/>
        <Text style={styles.note}>
          Merely is a cloud music service which helps organize downloaded music, and keep your library in sync across all of your devices.
        </Text>
        <Text style={{ ...styles.note, fontStyle:'italic' }}>
          Sign in is powered by Passport, learn more on the <FontAwesome name="user-circle" color={Theme[colorScheme ?? 'light'].text}/> screen.
        </Text>
        <Link style={styles.link} href="/welcome">
          <Text style={styles.linkText}>Revisit first time setup</Text>
        </Link>
        <Spacer/>
        <ExternalLink href="https://yiays.com" style={styles.link}>
          <Text style={styles.linkText}>Created by Yiays</Text>
        </ExternalLink>
        <Spacer/>
        <Text style={styles.smallTitle}>Related projects</Text>
        <ExternalLink style={styles.link} href="https://passport.yiays.com">
          <Text style={styles.linkText}>Passport</Text>
        </ExternalLink>
        <ExternalLink style={styles.link} href="https://meme.yiays.com">
          <Text style={styles.linkText}>MemeDB</Text>
        </ExternalLink>
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </ScrollView>
  );
}
const styles = {
  ...baseStyles,
  ...StyleSheet.create({
    container: {
      alignItems: 'center'
    },
    logo: {
      width: 256,
      height: 256,
      maxWidth: '80%',
      aspectRatio: '1'
    },
  })
}
