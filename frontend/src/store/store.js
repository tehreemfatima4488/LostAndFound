import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    notifications: notificationReducer,
  },
});

export default store;
