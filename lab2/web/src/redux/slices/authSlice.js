import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, checkAdmin } from '../../api/api';


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const userData  = await loginUser(credentials);
      //const userData = response.data?.userData; // Достаем userData из ответа
      console.log("userData : ", userData)
      if (!userData) {
        return rejectWithValue('Неверный логин или пароль');
      }
      return {
        user: {
          id: userData.id,
          login: userData.login,
          password: userData.password,
          username: userData.username,
          university: userData.university,
          userGroup: userData.userGroup, // Используем userGroup
          isAdmin: userData.admin, // Используем поле isAdmin из UserData
          likedPosts: userData.likedPosts || [], // Добавляем likedPosts
          userPosts: userData.userPosts || [] // Добавляем userPosts
        },
        isAdmin: userData.admin // Дублируем для удобства
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAdmin: false,
    status: 'idle',
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAdmin = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      //login

      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        /*state.user = {
          id: action.payload.id,
          login: action.payload.login, 
          password: action.payload.password,
          username: action.payload.username, 
          university: action.payload.university,
          group: action.payload.userGroup,
          isAdmin: action.payload.isAdmin
        };*/
        state.user = action.payload.user; // Используем payload напрямую
        state.isAdmin = action.payload.isAdmin;
        state.error = null; // Очищаем ошибки при успешном входе
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAdmin = false;
      });
  }
  /*
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
  }*/
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;