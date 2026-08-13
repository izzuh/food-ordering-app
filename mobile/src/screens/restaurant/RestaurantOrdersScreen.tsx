import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getRestaurantOrders, updateRestaurantOrderStatus } from '../../services/restaurant-order.service';

const nextAction: Record<string, { status: string; label: string } | undefined> = { confirmed: { status: 'accepted', label: 'Accept order' }, accepted: { status: 'preparing', label: 'Start preparing' }, preparing: { status: 'ready_for_delivery', label: 'Ready for rider' } };
export default function RestaurantOrdersScreen({ accessToken }: { accessToken: string }) {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => getRestaurantOrders(accessToken).then(setOrders), [accessToken]);
  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);
  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  return <FlatList contentContainerStyle={styles.list} data={orders} keyExtractor={x => x.id} ListHeaderComponent={<Text style={styles.heading}>Restaurant orders</Text>} renderItem={({ item }) => { const action = nextAction[item.status]; return <View style={styles.card}><Text style={styles.order}>Order #{item.id.slice(0, 8)}</Text><Text>Status: {item.status}</Text><Text>Total: £{(item.total_minor / 100).toFixed(2)}</Text>{action && <Pressable style={styles.button} onPress={() => updateRestaurantOrderStatus(accessToken, item.id, action.status).then(refresh)}><Text style={styles.buttonText}>{action.label}</Text></Pressable>}</View>; }} />;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, list: { padding: 20, gap: 12 }, heading: { fontSize: 28, fontWeight: '800', marginBottom: 8 }, card: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#eee', gap: 6 }, order: { fontWeight: '800' }, button: { marginTop: 8, backgroundColor: '#111827', padding: 12, borderRadius: 10, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '700' } });
