import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { initializePayment, verifyPayment } from '../../services/payment.service';

export default function PaymentScreen({ accessToken, orderId, onPaid, onBack }: { accessToken: string; orderId: string; onPaid: () => void; onBack: () => void }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await initializePayment(accessToken, orderId);
        const { error: sheetError } = await initPaymentSheet({
          merchantDisplayName: 'Food Ordering',
          paymentIntentClientSecret: result.checkout.client_secret,
          allowsDelayedPaymentMethods: false,
        });
        if (sheetError) throw new Error(sheetError.message);
        if (!active) return;
        setPaymentIntentId(result.checkout.id);
        setReady(true);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Unable to prepare payment');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [accessToken, orderId, initPaymentSheet]);

  async function pay() {
    setError(null);
    setPaying(true);
    try {
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) {
        setError(paymentError.message);
        return;
      }
      if (!paymentIntentId) throw new Error('Payment session is unavailable.');
      const verification = await verifyPayment(accessToken, paymentIntentId);
      if (verification.status === 'paid') onPaid();
      else setError('Payment is not confirmed yet. Please try again shortly.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment could not be completed.');
    } finally {
      setPaying(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.heading}>Secure payment</Text>
    <Text style={styles.description}>Your payment is processed securely by Stripe.</Text>
    {loading && <ActivityIndicator />}
    {error && <Text style={styles.error}>{error}</Text>}
    <Pressable disabled={!ready || loading || paying} onPress={pay} style={styles.button}><Text style={styles.buttonText}>{paying ? 'Processing…' : loading ? 'Preparing…' : 'Pay securely'}</Text></Pressable>
    <Pressable disabled={paying} onPress={onBack} style={styles.back}><Text>Back</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 24 }, heading: { fontSize: 30, fontWeight: '800', marginBottom: 8 }, description: { color: '#6b7280', marginBottom: 20 }, error: { color: '#b91c1c', marginVertical: 12 }, button: { backgroundColor: '#111827', padding: 16, borderRadius: 12, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '700' }, back: { alignItems: 'center', padding: 16 } });
