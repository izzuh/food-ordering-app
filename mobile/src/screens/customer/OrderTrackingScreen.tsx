import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getOrder } from '../../services/order.service';
import { getOrderDelivery } from '../../services/delivery.service';
const labels: Record<string, string> = { pending_payment: 'Awaiting payment', confirmed: 'Order confirmed', accepted: 'Restaurant accepted', preparing: 'Being prepared', ready_for_delivery: 'Waiting for rider', delivered: 'Delivered', cancelled: 'Cancelled' };
export default function OrderTrackingScreen({ accessToken, orderId }: { accessToken: string; orderId: string }) {
  const [order, setOrder] = useState<any>(null); const [delivery, setDelivery] = useState<any>(null); const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { const [nextOrder, nextDelivery] = await Promise.all([getOrder(accessToken, orderId), getOrderDelivery(accessToken, orderId).catch(() => null)]); setOrder(nextOrder); setDelivery(nextDelivery); }, [accessToken, orderId]);
  useEffect(() => { refresh().finally(() => setLoading(false)); const timer = setInterval(refresh, 10000); return () => clearInterval(timer); }, [refresh]);
  if (loading) return <View style={styles.center}><ActivityIndicator /></View>; if (!order) return <View style={styles.center}><Text>Order not found.</Text></View>;
  return <View style={styles.container}><Text style={styles.heading}>Track order</Text><Text style={styles.status}>{labels[order.status] ?? order.status}</Text><Text>Payment: {order.payment_status}</Text>{delivery && <View style={styles.delivery}><Text style={styles.title}>Delivery</Text><Text>Status: {delivery.status}</Text>{delivery.rider_latitude != null && <Text>Rider location: {delivery.rider_latitude.toFixed(5)}, {delivery.rider_longitude.toFixed(5)}</Text>}</View>}<Text style={styles.total}>Total: £{(order.total_minor / 100).toFixed(2)}</Text></View>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, container: { flex: 1, padding: 24 }, heading: { fontSize: 30, fontWeight: '800', marginBottom: 20 }, status: { fontSize: 22, fontWeight: '700', marginBottom: 8 }, delivery: { marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: '#f3f4f6', gap: 6 }, title: { fontWeight: '800' }, total: { marginTop: 24, fontSize: 18, fontWeight: '800' } });
