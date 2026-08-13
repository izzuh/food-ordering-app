import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getCart, removeCartItem, updateCartItem } from '../../services/cart.service';
import type { Cart } from '../../types/cart';

export default function CartScreen({ accessToken, onCheckout }: { accessToken: string; onCheckout: () => void }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() { setCart(await getCart(accessToken)); }
  useEffect(() => { refresh().finally(() => setLoading(false)); }, [accessToken]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!cart || cart.items.length === 0) return <View style={styles.center}><Text style={styles.empty}>Your cart is empty</Text></View>;

  return <View style={styles.container}>
    <Text style={styles.heading}>Your cart</Text>
    {cart.items.map(item => <View key={item.id} style={styles.row}>
      <View style={styles.info}><Text style={styles.name}>{item.name}</Text><Text>£{(item.unit_price_minor / 100).toFixed(2)}</Text></View>
      <View style={styles.controls}>
        <Pressable onPress={() => (item.quantity === 1 ? removeCartItem(accessToken, item.menu_item_id) : updateCartItem(accessToken, item.menu_item_id, item.quantity - 1)).then(refresh)} style={styles.control}><Text>−</Text></Pressable>
        <Text>{item.quantity}</Text>
        <Pressable onPress={() => updateCartItem(accessToken, item.menu_item_id, item.quantity + 1).then(refresh)} style={styles.control}><Text>+</Text></Pressable>
      </View>
    </View>)}
    <View style={styles.total}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>£{(cart.subtotal_minor / 100).toFixed(2)}</Text></View>
    <Pressable onPress={onCheckout} style={styles.checkout}><Text style={styles.checkoutText}>Continue to checkout</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, empty: { fontSize: 18 }, container: { flex: 1, padding: 20 }, heading: { fontSize: 30, fontWeight: '800', marginBottom: 20 }, row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eee' }, info: { flex: 1 }, name: { fontWeight: '700', fontSize: 16, marginBottom: 5 }, controls: { flexDirection: 'row', alignItems: 'center', gap: 12 }, control: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }, total: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }, totalLabel: { fontSize: 18, fontWeight: '700' }, totalValue: { fontSize: 18, fontWeight: '800' }, checkout: { marginTop: 20, backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center' }, checkoutText: { color: '#fff', fontWeight: '700' } });
