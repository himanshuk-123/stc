import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To avoid serializable check warnings with AsyncStorage
    }),
});

export { store };
export default store; 