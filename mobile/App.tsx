import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import HomeScreen from './src/screens/customer/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RestaurantMenuScreen from './src/screens/customer/RestaurantMenuScreen';
import CartScreen from './src/screens/customer/CartScreen';
import CheckoutScreen from './src/screens/customer/CheckoutScreen';
import PaymentScreen from './src/screens/customer/PaymentScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import type { Restaurant } from './src/types/restaurant';

type Screen = 'home' | 'menu' | 'cart' | 'checkout' | 'payment' | 'complete';

function CustomerApp() {
  const { accessToken, user, hydrated, signIn, signOut } = useAuth();
  const [screen, setScreen] = useState<Screen>('home');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  if (!hydrated) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!accessToken || !user) return <LoginScreen onAuthenticated={signIn} />;
  if (user.role !== 'customer') return <View style={styles.center}><Text>This app currently provides the customer experience for this account.</Text><Pressable onPress={signOut}><Text style={styles.link}>Sign out</Text></Pressable></View>;

  if (screen === 'menu' && restaurant) return <View style={styles.container}><Header title={restaurant.name} onBack={() => setScreen('home')} /><RestaurantMenuScreen restaurant={restaurant} accessToken={accessToken} onCart={() => setScreen('cart')} /></View>;
  if (screen === 'cart') return <View style={styles.container}><Header title="Cart" onBack={() => setScreen('home')} /><CartScreen accessToken={accessToken} onCheckout={() => setScreen('checkout')} /></View>;
  if (screen === 'checkout') return <View style={styles.container}><Header title="Checkout" onBack={() => setScreen('cart')} /><CheckoutScreen accessToken={accessToken} onAddAddress={() => {}} onComplete={(order) => { setOrderId(order.id); setScreen('payment'); }} /></View>;
  if (screen === 'payment' && orderId) return <View style={styles.container}><PaymentScreen accessToken={accessToken} orderId={orderId} onBack={() => setScreen('checkout')} onPaid={() => setScreen('complete')} /></View>;
  if (screen === 'complete') return <View style={styles.center}><Text style={styles.success}>Order confirmed</Text><Text>Your payment was successful.</Text><Pressable onPress={() => { setOrderId(null); setScreen('home'); }} style={styles.button}><Text style={styles.buttonText}>Continue ordering</Text></Pressable></View>;
  return <View style={styles.container}><View style={styles.topbar}><Text style={styles.brand}>Food Ordering</Text><Pressable onPress={() => setScreen('cart')}><Text>Cart</Text></Pressable></View><HomeScreen onSelectRestaurant={(next) => { setRestaurant(next); setScreen('menu'); }} /></View>;
}

function Header({ title, onBack }: { title: string; onBack: () => void }) { return <View style={styles.header}><Pressable onPress={onBack}><Text>‹ Back</Text></Pressable><Text style={styles.headerTitle}>{title}</Text><View /></View>; }

export default function App() { return <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}><AuthProvider><SafeAreaView style={styles.safeArea}><CustomerApp /><StatusBar style="auto" /></SafeAreaView></AuthProvider></StripeProvider>; }

const styles = StyleSheet.create({ safeArea: { flex: 1 }, container: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }, topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }, brand: { fontSize: 20, fontWeight: '800' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }, headerTitle: { fontWeight: '800', fontSize: 18 }, link: { marginTop: 16, fontWeight: '700' }, success: { fontSize: 28, fontWeight: '800' }, button: { marginTop: 20, backgroundColor: '#111827', padding: 15, borderRadius: 12 }, buttonText: { color: '#fff', fontWeight: '700' } });
