import { ScrollView } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { baseStyles } from '@/constants/Stylesheet';
import { Albums, Playlists } from '@/components/DatabaseLists';
import { StatusBar } from 'expo-status-bar';

const data = 'T,e,s,t,i,n,g'.split(',');
function renderItem(item:string) {
  return(
    <View key={item}>
      <Text>{item}</Text>
    </View>
  )
}

export default function Home() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Playlists</Text>
        <Playlists data={[]} songs={{}}></Playlists>
        <Spacer/>
        <Text style={styles.title}>Liked songs</Text>
        {data.map(renderItem)}
        <Spacer/>
        <Text style={styles.title}>Top Artists</Text>
        {data.map(renderItem)}
        <Spacer/>
        <Text style={styles.title}>Top Albums</Text>
        <Albums data={[]} artists={{}}/>
      </View>
      <StatusBar hidden={false}/>
    </ScrollView>
  );
}
const styles = {
  ...baseStyles
}
