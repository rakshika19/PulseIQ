import { configureStore } from '@reduxjs/toolkit';
import medicationReducer from './medicationSlice';
import authReducer from './authSlice.js';

export const store = configureStore({
  reducer: {
    medications: medicationReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('medications', JSON.stringify(state.medications.medications));
}); 