import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthTokens, User } from '../types/auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    authSucceeded(state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.status = 'authenticated';
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { authStarted, authSucceeded, authFailed, logout } = authSlice.actions;
export default authSlice.reducer;
