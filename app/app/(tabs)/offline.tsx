import { StyleSheet } from 'react-native';

import { Spacer, Text, View } from '@/components/Themed';
import { baseStyles } from '@/constants/Stylesheet';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Spacer/>
    </View>
  );
}

const styles = StyleSheet.create({
  ...baseStyles,
});
