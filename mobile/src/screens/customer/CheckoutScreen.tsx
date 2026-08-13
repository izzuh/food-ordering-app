import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getAddresses } from '../../services/address.service';
import { checkout } from '../../services/order.service';
import type { Address } from '../../services/address.service';

export default function CheckoutScreen({ accessToken, onComplete, onAddAddress }: { accessToken: string; onComplete: (order: any) => void; onAddAddress: () => void }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getAddresses(accessToken).then(items => { setAddresses(items); setSelected(items.find(x => x.is_default)?.id ?? items[0]?.id ?? null); }).finally(() => setLoading(false)); }, [accessToken]);
  async function placeOrder() { if (!selected) return; setSubmitting(true); try { onComplete(await checkout(accessToken, selected)); } finally { setSubmitting(false); } }

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  return <View style={styles.container}>
    <Text style={styles.heading}>Delivery address</Text>
    {addresses.map(address => <Pressable key={address.id} onPress={() => setSelected(address.id)} style={[styles.address, selected === address.id && styles.selected]}>
      <Text style={styles.name}>{address.recipient_name}</Text><Text>{address.address_line}</Text><Text>{address.city}, {address.postcode}</Text>
    </Pressable>)}
    <Pressable onPress={onAddAddress} style={styles.secondary}><Text>Add a new address</Text></Pressable>
    <Pressable disabled={!selected || submitting} onPress={placeOrder} style={styles.button}><Text style={styles.buttonText}>{submitting ? 'Creating order…' : 'Continue to payment'}</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, container: { flex: 1, padding: 20 }, heading: { fontSize: 28, fontWeight: '800', marginBottom: 16 }, address: { padding: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, marginBottom: 10 }, selected: { borderColor: '#111827', borderWidth: 2 }, name: { fontWeight: '700', marginBottom: 4 }, secondary: { padding: 15, alignItems: 'center' }, button: { marginTop: 'auto', backgroundColor: '#111827', padding: 16, borderRadius: 12, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '700' } });
