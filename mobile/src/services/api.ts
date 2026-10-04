import axios from 'axios';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const defaultApiUrl = 'http://10.0.2.2:4000/api/v1';

export const api = axios.create({
  baseURL: configuredApiUrl || defaultApiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
