import { FlatList, ScrollView, StyleSheet, VirtualizedList } from 'react-native';

import { Text, View } from '@/components/Themed';

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
        {data.map(renderItem)}
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>Liked songs</Text>
        {data.map(renderItem)}
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>Top Artists</Text>
        {data.map(renderItem)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 14,
  },
  separator: {
    marginTop: 30,
    height: 1,
    width: '100%',
  },
});
