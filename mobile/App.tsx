import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import HomeScreen from './src/screens/customer/HomeScreen';
import RestaurantMenuScreen from './src/screens/customer/RestaurantMenuScreen';
import type { Restaurant } from './src/types/restaurant';

const DEMO_ACCESS_TOKEN = '';

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedRestaurant ? (
        <View style={styles.container}>
          <Pressable onPress={() => setSelectedRestaurant(null)} style={styles.back}><Text>‹ Back</Text></Pressable>
          <RestaurantMenuScreen restaurant={selectedRestaurant} accessToken={DEMO_ACCESS_TOKEN} onCart={() => {}} />
        </View>
      ) : (
        <HomeScreen onSelectRestaurant={setSelectedRestaurant} />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  back: { paddingHorizontal: 20, paddingVertical: 12 },
});
