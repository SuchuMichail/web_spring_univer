import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, checkAdmin } from '../../api/api';


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("SDFBSFBSFBSFGBFGNFDNDFNDGNGHDNGHD")
      const responseData  = await loginUser(credentials);
      //const userData = response.data?.userData; // Достаем userData из ответа
      console.log("IMINSLICEEEEEEEEEEE\nresponseData : ", responseData)
      
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
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;