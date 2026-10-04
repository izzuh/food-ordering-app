import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '../../services/auth.service';
import type { User } from '../../types/auth';

export default function LoginScreen({
  onAuthenticated,
  onRegister,
}: {
  onAuthenticated: (accessToken: string, refreshToken: string, user: User) => void;
  onRegister: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login({ email: email.trim().toLowerCase(), password });
      onAuthenticated(result.tokens.accessToken, result.tokens.refreshToken, result.user);
    } catch {
      setError('Unable to sign in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.title}>Welcome back</Text>
    <Text style={styles.subtitle}>Sign in to order your favourite food.</Text>
    <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
    <TextInput secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
    {error && <Text style={styles.error}>{error}</Text>}
    <Pressable disabled={loading} onPress={submit} style={styles.button}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}</Pressable>
    <Pressable onPress={onRegister} style={styles.linkButton}><Text style={styles.link}>Create an account</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#6b7280', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 16 },
  error: { color: '#b91c1c' },
  button: { marginTop: 8, padding: 15, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkButton: { alignItems: 'center', padding: 12 },
  link: { fontWeight: '700' },
});
