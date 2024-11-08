import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import { Spacer, Text, View } from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';
import { baseStyles } from '@/constants/Stylesheet';

export default function AboutScreen() {
  return (
    <ScrollView style={{ flexGrow:0 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/images/user.png')} resizeMode='contain'/>
        <Text style={styles.title}>email@email.com</Text>
        <Text style={styles.subtitle}>username</Text>
        <Spacer/>
        <Text style={styles.note}>
          This is your Passport account. You can use it on other services created by Yiays.
        </Text>
        <Spacer/>
        <ExternalLink href='https://passport.yiays.com' style={styles.link}>
          <Text style={styles.linkText}>Manage your Passport account</Text>
        </ExternalLink>
        <ExternalLink href='https://yiays.com' style={styles.link}>
          <Text style={styles.dangerLinkText}>Sign out</Text>
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
      marginTop: 18,
      width: 256,
      height: 256,
      maxWidth: '80%',
      aspectRatio: '1'
    },
  })
}
