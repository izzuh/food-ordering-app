import { StyleSheet, Text, View } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find your next meal</Text>
      <Text style={styles.subtitle}>Restaurants and menus will appear here next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 8, fontSize: 16 },
});
