import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addPost as apiAddPost, getPosts, deletePost, fetchUserPosts as apiFetchUserPosts } from '../../api/api';

// Асинхронные Thunk-функции
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await apiAddPost(postData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiFetchUserPosts(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    userPosts: [], // Отдельное поле для постов пользователя
  },
  reducers: {
    // Синхронные редьюсеры
    addPost: (state, action) => {
      const newPost = {
        id: action.payload.id,
        title: action.payload.title,
        text: action.payload.text,
        subject: action.payload.subject,
        author: action.payload.author,
        files: action.payload.files || [],
        likes: 0,
        likedBy: []
      };
      state.items.push(newPost);
    },
    toggleLike: (state, action) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        const index = post.likedBy.indexOf(action.payload.userId);
        if (index === -1) {
          post.likedBy.push(action.payload.userId);
          post.likes += 1;
        } else {
          post.likedBy.splice(index, 1);
          post.likes -= 1;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка createPost
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Обработка fetchUserPosts
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addPost, toggleLike } = postsSlice.actions;
export default postsSlice.reducer;