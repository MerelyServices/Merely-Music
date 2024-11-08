import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import { Text, View } from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';
import Colors from '@/constants/Colors';

export default function AboutScreen() {
  return (
    <ScrollView style={{ flexGrow:0 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/images/icon.png')} resizeMode='contain'/>
        <Text style={styles.title}>Merely Music</Text>
        <Text style={styles.subtitle}>Version {Constants.expoConfig?.version || 'unknown'}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.about}>
          Merely is a cloud music service which helps organize downloaded music, and keep your library in sync across all of your devices.
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <ExternalLink href='https://yiays.com'><Text>Created by Yiays</Text></ExternalLink>
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  logo: {
    width: 256,
    height: 256,
    maxWidth: '80%',
    aspectRatio: '1'
  },
  title: {
    fontSize: 28,
    fontWeight: 'normal',
  },
  subtitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 2,
  },
  about: {
    maxWidth: '80%',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
