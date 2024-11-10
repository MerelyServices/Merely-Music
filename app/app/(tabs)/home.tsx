import { ScrollView } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { baseStyles } from '@/constants/Stylesheet';
import { Playlists } from '@/components/DatabaseLists';

const data = 'T,e,s,t,i,n,g'.split(',');
function renderItem(item:string) {
  return(
    <View key={item}>
      <Text>{item}</Text>
    </View>
  )
}

export default function TabOneScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Playlists</Text>
        <Playlists data={[]}></Playlists>
        <Spacer/>
        <Text style={styles.title}>Liked songs</Text>
        {data.map(renderItem)}
        <Spacer/>
        <Text style={styles.title}>Top Artists</Text>
        {data.map(renderItem)}
      </View>
    </ScrollView>
  );
}
const styles = {
  ...baseStyles
}
