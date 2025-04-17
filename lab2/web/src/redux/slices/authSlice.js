import { createSlice } from '@reduxjs/toolkit';
import { loginUser, checkAdmin } from '../../api/api';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAdmin: false,
    status: 'idle'
  },
  reducers: {
    loginSuccess(state, action) {
      const { name, password, university, group } = action.payload;
      state.user = { 
        name,
        university,
        group
      };
      state.isAdmin = (name === 'admin' && password === '123');
      state.status = 'succeeded';
    },
    registerSuccess(state, action) {
      const { name, university, group } = action.payload;
      state.user = {
        name,
        university,
        group
      };
      state.isAdmin = false;
      state.status = 'succeeded';
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
    }
  }
});

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;