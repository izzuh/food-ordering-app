import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/customer/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RestaurantMenuScreen from './src/screens/customer/RestaurantMenuScreen';
import type { Restaurant } from './src/types/restaurant';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  if (!accessToken) return <SafeAreaView style={styles.safeArea}><LoginScreen onAuthenticated={setAccessToken} /><StatusBar style="auto" /></SafeAreaView>;
  return <SafeAreaView style={styles.safeArea}>
    {selectedRestaurant ? <View style={styles.container}><RestaurantMenuScreen restaurant={selectedRestaurant} accessToken={accessToken} onCart={() => {}} /></View> : <HomeScreen onSelectRestaurant={setSelectedRestaurant} />}
    <StatusBar style="auto" />
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea: { flex: 1 }, container: { flex: 1 } });
