import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addPost as apiAddPost, 
          fetchPostsBySubjectId as apiFetchPostsBySubjectId, 
          fetchUserPosts as apiFetchUserPosts } from '../../api/api';

// Асинхронные Thunk-функции
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await apiAddPost(postData);
      console.log("I get from server after createPost\n",response.data)
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

      console.log("User Posts (after fetchUserPosts)\n",response.data)

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Добавляем новый action
export const fetchPostsBySubjectId = createAsyncThunk(
  'posts/fetchBySubjectId',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await apiFetchPostsBySubjectId(subjectId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'post',
  initialState: {
    items: [],
    postsBySubject: [],
    status: 'idle',
    error: null,
    userPosts: [], // Отдельное поле для постов пользователя
    likedBy: [],
    filesLoaded: false // Добавляем флаг загрузки файлов
  },
  reducers: {
    // Синхронные редьюсеры

    addPost: (state, action) => {
      const postData = action.payload.post || action.payload;
      const existingIndex = state.items.findIndex(p => p.id === postData.id);

      console.log("action.payload ",action.payload)
      console.log("AAA postData = \n",postData)
      console.log("existingIndex = ",existingIndex)
      console.log("state.items ",state.items)
      
      const newPost = {
        post: {
          id: postData.id,
          title: postData.title,
          text: postData.text,
        },
        subject: action.payload.subject,
        author: action.payload.author,
        files: action.payload.files || [],
        likedBy: action.payload.likedBy || [],
        filesLoaded: action.payload.files ? true : false // Отмечаем, загружены ли файлы
      };

      console.log("ARARA newPost = ",newPost)

      if (existingIndex >= 0) {
        state.items[existingIndex] = newPost;
      } else {
        state.items.unshift(newPost);
      }
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
        
        const responseData = action.payload;
        const newPost = {
          post: {
            id: responseData.post.id,
            title: responseData.post.title,
            text: responseData.post.text,
          },
          subject: responseData.subject,
          author: responseData.author,
          files: responseData.files || [],
          likes: 0,
          likedBy: []
        };
      
        state.items.unshift(newPost);
        state.userPosts.unshift(newPost);
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
        
        console.log('Данные с сервера:', action.payload);

        console.log('Старые userPosts:', state.userPosts); 

        // Нормализуем данные с сервера
        const userPosts = action.payload.map(item => ({
          post: {
            id: item.post.id,
            title: item.post.title,
            text: item.post.text,
          },
          subject: item.subject,
          author: item.author,
          files: item.files || [],
          likes: item.post.likes || 0,
          likedBy: item.likedBy || []
        }));        
      
        state.userPosts = userPosts;
        
        // Обновляем общий список
        userPosts.forEach(post => {
          const existingIndex = state.items.findIndex(p => p.id === post.id);
          if (existingIndex >= 0) {
            state.items[existingIndex] = post;
          } else {
            state.items.push(post);
          }
        });

        console.log('Обновлённые userPosts в Redux:', state.userPosts);
      })

      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      

      //////////////////////////////////
      // Обработка fetchPostsBySubjectId
      .addCase(fetchPostsBySubjectId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsBySubjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("ACTION PAYLOAD\n",action.payload)

        // Нормализуем данные с сервера
        const normalizedPosts  = action.payload.map(item => ({
          post: {
            id: item.post.id,
            title: item.post.title,
            text: item.post.text,
          },
          subject: item.subject,
          author: item.author,
          files: item.files || [],
          likes: item.post.likes || 0,
          likedBy: item.likedBy || []
        }));

        state.postsBySubject = normalizedPosts  || [];
        console.log('Posts loaded:', action.payload);
      })
      .addCase(fetchPostsBySubjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

  }
});

export const { addPost, toggleLike } = postsSlice.actions;
export default postsSlice.reducer;