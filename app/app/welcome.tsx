import { StatusBar } from 'expo-status-bar';
import { Image, ImageURISource, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from 'expo-linear-gradient';

import { ExternalLink } from '@/components/ExternalLink';
import { baseStyles } from '@/constants/Stylesheet';
import Colors from '@/constants/Colors';
import { AuthContext } from '@/context/authenticator';

interface Slide {
  key: number,
  title: string,
  text: string,
  image?: ImageURISource,
  backgroundColor?: string
}

const slides = [
  {
    key: 1,
    title: "Merely organize your Music everywhere",
    text: "Bring your own music, create playlists, tweak metadata, and take it with you on the go.",
    image: require('../assets/images/logowhite.png')
  },{
    key: 2,
    title: "Sign in with Passport",
    text: "Signing in is as easy as entering a code from your email. As a bonus, you can reuse the account for other Yiays projects.",
    image: require('../assets/images/passport.png')
  }
] as Slide[]

function renderItem({ item, dimensions }: {item: Slide} & any) {
  // Specifying height can cause unintended consequences, so only do it when we have to
  // - Still not ideal. Not all window resize events trigger renderItem.
  let extraStyle:any = {};
  if(Platform.OS=='web')
    extraStyle['height'] = dimensions.height;
  return (
    <View key={item.key} style={{ ...styles.slide, ...extraStyle }}>
      <View style={styles.cell}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      {item.image?
        <Image style={styles.image} source={item.image} resizeMode='contain'/>
      :<></>}
      <View style={styles.cell}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  )
}

async function setWelcomeDone() {
  await AsyncStorage.setItem('welcome_done', '1');
  router.push('/(tabs)/home');
}

export default function WelcomeScreen() {
  return (
    <LinearGradient style={styles.root} colors={['#813694', '#454B9F']} start={{x:0, y:0}} end={{x:1,y:1}}>
      <AppIntroSlider renderItem={renderItem} data={slides} showPrevButton={true} onDone={setWelcomeDone}/>
      <AuthContext.Consumer>
        { ctx => ctx?.token ? 
          <View style={styles.buttonStack}>
            <ExternalLink href="https://passport.yiays.com/profile/" style={styles.button}>
              <Text style={styles.buttonText}>Signed in as {ctx.profile?.username || 'Unknown'}</Text>
            </ExternalLink>
            <TouchableOpacity onPress={ctx.signOut} style={styles.link}>
              <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        :
          <View style={styles.buttonStack}>
            <ExternalLink href="https://passport.yiays.com/?redirect=merely.yiays.com/music/" style={styles.button}>
              <Text style={styles.buttonText}>Sign in with Passport</Text>
            </ExternalLink>
            <Link href="/(tabs)/home" style={styles.link} onPress={setWelcomeDone}>
              <Text style={styles.buttonText}>Use Merely Music with local storage</Text>
            </Link>
          </View>
        }
      </AuthContext.Consumer>
      <StatusBar hidden={true}/>
    </LinearGradient>
  );
}

const styles = {
  ...baseStyles,
  ...StyleSheet.create({
    root: {
      position: 'relative',
      height: '100%',
    },
    slide: {
      flexGrow: 1,
      paddingBottom: 170,
      marginHorizontal: 30,
      alignItems: 'center',
    },
    cell: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '100',
      marginTop: 0,
      color: '#ffffff',
      textAlign: 'center',
    },
    text: {
      fontSize: 18,
      color: '#ffffff',
      textAlign: 'center',
    },
    image: {
      width: '90%',
      height: '60%',
      opacity: 0.6,
    },
    buttonStack: {
      position: 'absolute',
      bottom: 60,
      left:0,
      right:0,
      flex: 1,
      alignItems: 'center',
    },
    button: {
      ...baseStyles.button,
      backgroundColor: Colors.fg,
      textAlign: 'center',
    }
  })
}
