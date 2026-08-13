import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getAvailableDeliveries, claimDelivery, updateDeliveryStatus } from '../../services/delivery.service';
export default function RiderDashboardScreen({ accessToken }: { accessToken: string }) {
  const [deliveries, setDeliveries] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => getAvailableDeliveries(accessToken).then(setDeliveries), [accessToken]);
  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);
  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  return <FlatList contentContainerStyle={styles.list} data={deliveries} keyExtractor={x => x.id} ListHeaderComponent={<Text style={styles.heading}>Available deliveries</Text>} renderItem={({ item }) => <View style={styles.card}><Text style={styles.title}>{item.restaurant_name}</Text><Text>Order #{item.order_id.slice(0, 8)}</Text><Text>{item.delivery_address_snapshot?.address_line ?? 'Delivery address'}</Text><Pressable style={styles.button} onPress={() => claimDelivery(accessToken, item.id).then(refresh)}><Text style={styles.buttonText}>Claim delivery</Text></Pressable></View>} />;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, list: { padding: 20, gap: 12 }, heading: { fontSize: 28, fontWeight: '800', marginBottom: 8 }, card: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#eee', gap: 6 }, title: { fontSize: 18, fontWeight: '800' }, button: { marginTop: 8, backgroundColor: '#111827', padding: 12, borderRadius: 10, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '700' } });
