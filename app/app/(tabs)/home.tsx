import { ScrollView } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { baseStyles } from '@/constants/Stylesheet';
import { Albums, Playlists, Songs } from '@/components/DatabaseLists';
import { StatusBar } from 'expo-status-bar';
import { DbContext } from '@/context/database';
import { filterByMetadata, filterByRating, Metadata, ResolveObjects } from '@/models/database';
import { FontAwesome } from '@expo/vector-icons';
import { Theme } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function Home() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Library</Text>
        <Spacer/>
        <DbContext.Consumer>
          { ctx => ctx?.localDb? <>
              <Text style={styles.smallTitle}>Playlists</Text>
              <Playlists data={ctx.localDb.playlists}/>
              <Spacer/>
              { ctx.user?.ratings? <>
                <Text style={styles.smallTitle}>Liked songs</Text>
                <Songs data={filterByRating(ctx.user?.ratings, 1)}/>
                <Spacer/>
              </>: <></>}
              <Text style={styles.smallTitle}>Top Artists</Text>
              <Spacer/>
              <Text style={styles.smallTitle}>Top Albums</Text>
              <Albums data={filterByMetadata(ctx.localDb.albums, ctx.localDb.songs, 'album')}/>
          </> : (ctx?.token? <>
            <Text style={styles.smallTitle}>Loading...</Text>
          </> : <>
            <Text style={styles.smallTitle}>Not signed in</Text>
            <Text style={styles.paragraph}>
              Add your account using the
              <FontAwesome name="user-circle" color={Theme[colorScheme ?? 'light'].text}/> screen
              and start syncing your library everywhere.
            </Text>
          </> )}
        </DbContext.Consumer>
      </View>
      <StatusBar hidden={false}/>
    </ScrollView>
  );
}
const styles = {
  ...baseStyles
}
