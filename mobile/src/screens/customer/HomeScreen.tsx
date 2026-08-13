import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getRestaurants } from '../../services/restaurant.service';
import type { Restaurant } from '../../types/restaurant';

export default function HomeScreen({ onSelectRestaurant }: { onSelectRestaurant: (restaurant: Restaurant) => void }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants().then(setRestaurants).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return <FlatList
    contentContainerStyle={styles.list}
    data={restaurants}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={<Text style={styles.heading}>Restaurants</Text>}
    renderItem={({ item }) => (
      <Pressable style={styles.card} onPress={() => onSelectRestaurant(item)}>
        <View style={styles.icon}><Text>🍽️</Text></View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={item.is_open ? styles.open : styles.closed}>{item.is_open ? 'Open' : 'Closed'}</Text>
        </View>
      </Pressable>
    )}
  />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, gap: 12 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  icon: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '700' },
  address: { marginTop: 4, color: '#6b7280' },
  open: { marginTop: 6, color: '#15803d', fontWeight: '600' },
  closed: { marginTop: 6, color: '#b91c1c', fontWeight: '600' },
});
