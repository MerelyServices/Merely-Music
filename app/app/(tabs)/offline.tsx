import { ScrollView, StyleSheet } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { baseStyles } from '@/constants/Stylesheet';

export default function TabTwoScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Downloaded music</Text>
        <Spacer/>
        <Text style={styles.paragraph}>Downloaded music will appear here. - Downloading is not yet available.</Text>
        <Text style={{...styles.paragraph, fontStyle:'italic'}}>Downloaded music doesn't cost any data to stream, even when you're online.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ...baseStyles,
});
