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
      
      if (!responseData) {
        return rejectWithValue('Неверный логин или пароль');
      }
      return {
        user: {
          id: responseData.user.id,
          login: responseData.user.login,
          password: responseData.user.password,
          username: responseData.user.username,
          university: responseData.user.university,
          userGroup: responseData.user.userGroup, // Используем userGroup
          isAdmin: responseData.user.admin, // Используем поле isAdmin из UserData
          likedPosts: responseData.likedPosts || [], // Добавляем likedPosts
          userPosts: responseData.userPosts || [] // Добавляем userPosts
        },
        isAdmin: responseData.user.admin // Дублируем для удобства
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
    },
    addUserPost: (state, action) => {
      if (state.user) {
        state.user.userPosts = [action.payload, ...state.user.userPosts];
      }
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