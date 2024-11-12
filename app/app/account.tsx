import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';
import { baseStyles } from '@/constants/Stylesheet';
import { AuthContext } from '@/context/authenticator';

export default function AboutScreen() {
  return (
    <ScrollView style={{ flexGrow:0 }}>
      <View style={styles.container}>
        <AuthContext.Consumer>
          { ctx => ctx?.user ? <>
            <Image style={styles.logo} source={require('../assets/images/user.png')} resizeMode='contain'/>
            <Text style={styles.title}>{ctx.user?.username || 'Unknown username'}</Text>
            <Text style={styles.subtitle}>{(ctx.profile?.email || 'Unknown email')}</Text>
            <Spacer/>
            <Text style={styles.note}>
              This is your Passport account. Sign in with this account on other devices to sync your music, playlists, and metadata.
            </Text>
            <Spacer/>
            <ExternalLink href='https://passport.yiays.com/profile/' style={styles.link}>
              <Text style={styles.linkText}>Manage your Passport account</Text>
            </ExternalLink>
            <TouchableOpacity onPress={() => ctx.signOut} style={styles.link}>
              <Text style={styles.dangerLinkText}>Sign out</Text>
            </TouchableOpacity>
          </>:<>
            <Image style={styles.logo} source={require('../assets/images/user.png')} resizeMode='contain'/>
            <Text style={styles.title}>Not signed in</Text>
            <Spacer/>
            <Text style={styles.note}>
              Sign in with Passport to sync your music, playlists, and metadata to other devices.
            </Text>
            <Spacer/>
            <ExternalLink href="https://passport.yiays.com/?redirect=merely.yiays.com/music/" style={styles.button}>
              <Text style={styles.linkText}>Sign in with Passport</Text>
            </ExternalLink>
          </>}
        </AuthContext.Consumer>
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
      margin: 18,
      width: 220,
      height: 220,
      maxWidth: '80%',
      aspectRatio: '1'
    },
  })
}
