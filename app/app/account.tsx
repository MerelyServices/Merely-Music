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
        <Text style={styles.title}>About Merely Music</Text>
        <Text style={styles.subtitle}>Version {Constants.expoConfig?.version || 'unknown'}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text>Merely Music is a simple cloud music service where you upload your own music, and keep the same playlists and metadata wherever you go.</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    textTransform: 'capitalize',
    color: 'grey',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  logo: {
    width: 256,
    height: 256,
    maxWidth: '80%',
    aspectRatio: '1'
  }
});
