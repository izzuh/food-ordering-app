import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { register } from '../../services/auth.service';
import type { User } from '../../types/auth';

export default function RegisterScreen({
  onAuthenticated,
  onBack,
}: {
  onAuthenticated: (accessToken: string, refreshToken: string, user: User) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (name.trim().length < 2) return setError('Enter your name.');
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });
      onAuthenticated(result.tokens.accessToken, result.tokens.refreshToken, result.user);
    } catch {
      setError('Unable to create your account. The email may already be registered.');
    } finally {
      setLoading(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.title}>Create account</Text>
    <Text style={styles.subtitle}>Join us and start ordering.</Text>
    <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
    <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
    <TextInput keyboardType="phone-pad" placeholder="Phone (optional)" value={phone} onChangeText={setPhone} style={styles.input} />
    <TextInput secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
    <TextInput secureTextEntry placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
    {error && <Text style={styles.error}>{error}</Text>}
    <Pressable disabled={loading} onPress={submit} style={styles.button}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}</Pressable>
    <Pressable onPress={onBack} style={styles.linkButton}><Text>Already have an account? Sign in</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 10 },
  title: { fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#6b7280', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 16 },
  error: { color: '#b91c1c' },
  button: { marginTop: 8, padding: 15, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkButton: { alignItems: 'center', padding: 12 },
});
