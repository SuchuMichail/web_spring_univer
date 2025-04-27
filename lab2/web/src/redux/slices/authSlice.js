import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../api/api';


export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Register UserData:\n",userData)
      const response = await registerUser(userData);

      console.log("I get response = \n",response.data)

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const responseData  = await loginUser(credentials);
      const userData = responseData.user;
      
      if (!responseData) {
        return rejectWithValue('Неверный логин или пароль');
      }
      return {
        user: {
          id: userData.user.id,
          login: userData.user.login,
          password: userData.user.password,
          username: userData.user.username,
          university: userData.user.university,
          userGroup: userData.user.userGroup, // Используем userGroup
          isAdmin: userData.user.isAdmin, // Используем поле isAdmin из UserData
          likedPosts: userData.likedPosts || [], // Добавляем likedPosts
          userPosts: userData.userPosts || [] // Добавляем userPosts
        },
        isAdmin: userData.user.isAdmin // Дублируем для удобства
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
    token: null,
    error: null
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('authToken');
      state.user = null;
      state.isAdmin = false;
      state.token = null;
      state.error = null;
    },
    addUserPost: (state, action) => {
      if (state.user) {
        state.user.userPosts = [action.payload, ...state.user.userPosts];
      }
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
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
        const { token, user } = action.payload;
        console.log("action.payload = ",action.payload)

        console.log("minimini user = ",user)

        localStorage.setItem('authToken', token);
        state.status = 'succeeded';
        state.user = user; 
        state.isAdmin = user.isAdmin;
        state.token = token;
        state.error = null; // Очищаем ошибки при успешном входе
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAdmin = false;
      })

      //register

      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("action_payload = ",action.payload)
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;