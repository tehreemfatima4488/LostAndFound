import { createSlice } from '@reduxjs/toolkit';

// Safely parse user from localStorage — handles corrupted/invalid JSON on refresh
const getSavedUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const savedToken = localStorage.getItem('token') || null;
const savedUser = getSavedUser();

// If token exists but user is missing/corrupt, clear everything
if (savedToken && !savedUser) {
  localStorage.removeItem('token');
}

const initialState = {
  user: savedUser,
  token: savedToken && savedUser ? savedToken : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!(savedToken && savedUser),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    authError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  registerSuccess,
  authError,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
