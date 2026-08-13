import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getRestaurantMenu } from '../../services/restaurant.service';
import { addToCart } from '../../services/cart.service';
import type { MenuItem, Restaurant } from '../../types/restaurant';

export default function RestaurantMenuScreen({ restaurant, accessToken, onCart }: { restaurant: Restaurant; accessToken: string; onCart: () => void }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurantMenu(restaurant.id).then(({ items }) => setItems(items)).finally(() => setLoading(false));
  }, [restaurant.id]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return <FlatList
    contentContainerStyle={styles.list}
    data={items}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={<><Text style={styles.heading}>{restaurant.name}</Text><Text style={styles.subheading}>{restaurant.description ?? 'Menu'}</Text></>}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {!!item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.price}>£{(item.price_minor / 100).toFixed(2)}</Text>
        </View>
        <Pressable disabled={!item.is_available} style={styles.add} onPress={() => addToCart(accessToken, item.id).then(onCart)}>
          <Text style={styles.addText}>{item.is_available ? 'Add' : 'Unavailable'}</Text>
        </Pressable>
      </View>
    )}
  />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, gap: 12 },
  heading: { fontSize: 28, fontWeight: '800' },
  subheading: { color: '#6b7280', marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#eee' },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700' },
  description: { color: '#6b7280', marginTop: 4 },
  price: { marginTop: 8, fontWeight: '700' },
  add: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#111827' },
  addText: { color: '#fff', fontWeight: '700' },
});
