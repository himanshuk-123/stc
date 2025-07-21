import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunks for side effects
export const loadUserData = createAsyncThunk(
  'user/loadData',
  async (_, { rejectWithValue }) => {
    try {
      const keys = [
        'tokenid',
        'username',
        'email',
        'usertype',
        'shopname',
        'mobilenumber',
        'closingbalance',
        'standingbalance',
      ];
      const items = await AsyncStorage.multiGet(keys);
      const storedData = {};
      items.forEach(([key, value]) => {
        storedData[key] = value;
      });
      
      return storedData;
    } catch (error) {
      console.error('Error loading user data:', error);
      return rejectWithValue('Failed to load user data');
    }
  }
);

export const saveUserData = createAsyncThunk(
  'user/saveData',
  async (newData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const keys = [
        'tokenid',
        'username',
        'email',
        'usertype',
        'shopname',
        'mobilenumber',
        'closingbalance',
        'standingbalance',
      ];
      
      const updatedData = { ...user, ...newData };
      const entries = keys.map(key => [key, updatedData[key]?.toString() || '']);
      await AsyncStorage.multiSet(entries);
      
      return newData;
    } catch (error) {
      console.error('Error saving user data:', error);
      return rejectWithValue('Failed to save user data');
    }
  }
);

export const clearUserData = createAsyncThunk(
  'user/clearData',
  async (_, { rejectWithValue }) => {
    try {
      // Remove only specific keys — exclude 'savedLogin'
      const keysToRemove = [
        'closingbalance',
        'email',
        'mobilenumber',
        'shopname',
        'standingbalance',
        'tokenid',
        'username',
        'usertype',
      ];

      await AsyncStorage.multiRemove(keysToRemove);
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return rejectWithValue('Failed to clear user data');
    }
  }
);


// Initial state matches the structure from Context
const initialState = {
  tokenid: null,
  username: '',
  email: '',
  usertype: '',
  shopname: '',
  mobilenumber: '',
  closingbalance: '',
  standingbalance: '',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load user data
    builder
      .addCase(loadUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(action.payload).forEach(key => {
          state[key] = action.payload[key];
        });
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Save user data
    builder
      .addCase(saveUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(action.payload).forEach(key => {
          state[key] = action.payload[key];
        });
      })
      .addCase(saveUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear user data
    builder
      .addCase(clearUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.tokenid = null;
        state.username = '';
        state.email = '';
        state.usertype = '';
        state.shopname = '';
        state.mobilenumber = '';
        state.closingbalance = '';
        state.standingbalance = '';
      })
      .addCase(clearUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer; 