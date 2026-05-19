import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
  },
});

export default store;
