import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../api/api';


export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);
      const userData = response.user;

      console.log("I get response = \n",response.data)

      localStorage.setItem('authToken', response.token);
      console.log("YUYUYU token = ",response.token)

      return {
        user: {
          id: userData.user.id,
          login: userData.user.login,
          password: userData.user.password,
          username: userData.user.username,
          university: userData.user.university,
          userGroup: userData.user.userGroup,
          isAdmin: userData.user.admin, 
          likedPosts: userData.likedPosts || [], 
          userPosts: userData.userPosts || [] 
        },
        isAdmin: userData.user.admin // Дублируем для удобства
      };
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

      localStorage.setItem('authToken', responseData.token);
      console.log("AHAHAH token = ",responseData.token)

      return {
        user: {
          id: userData.user.id,
          login: userData.user.login,
          password: userData.user.password,
          username: userData.user.username,
          university: userData.user.university,
          userGroup: userData.user.userGroup,
          isAdmin: userData.user.admin, 
          likedPosts: userData.likedPosts || [], 
          userPosts: userData.userPosts || [] 
        },
        isAdmin: userData.user.admin // Дублируем для удобства
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
      state.isAdmin = action.payload.user.admin;
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
        console.log("action = ", action)
        console.log("action.payload = ",action.payload)
        //console.log("token = ",token)
        console.log("minimini user = ",user)

        //localStorage.setItem('authToken', token);
        state.status = 'succeeded';
        state.user = user; 
        state.isAdmin = user.isAdmin;
        state.token = token;
        state.error = null; // Очищаем ошибки при успешном входе

        console.log("user = ",user)
        console.log("isAdmin = ",state.isAdmin)
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