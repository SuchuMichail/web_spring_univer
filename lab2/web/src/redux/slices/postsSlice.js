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
    likedBy: []
  },
  reducers: {
    // Синхронные редьюсеры
    /*addPost: (state, action) => {
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
    },*/
    addPost: (state, action) => {
      const postData = action.payload.post || action.payload;
      const newPost = {
        id: postData.id,
        title: postData.title,
        text: postData.text,
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
      /*.addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';

       // const newPost = action.payload;
       // state.items.unshift(newPost); // Новые посты в начало

        const postData = action.payload.post || action.payload;
        const newPost = {
          id: postData.id,
          title: postData.title,
          text: postData.text,
          subject: postData.subject,
          author: postData.author,
          files: postData.files || [],
          likes: 0,
          likedBy: []
        };

        state.items.unshift(newPost);
        state.userPosts.unshift(newPost);

        //state.items.push(newPost);

          // Обновляем postsBySubject если пост относится к текущему предмету
        //if (newPost.subject?.id) {
      //    state.postsBySubject.unshift(newPost);
       // }

        // Добавляем пост в userPosts, если автор - текущий пользователь
      //  if (state.userPosts.some(post => post.author?.id === newPost.author?.id)) {
      //    state.userPosts.unshift(newPost); // Добавляем в начало (новые сверху)
      //  }
      })*/

      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        const responseData = action.payload;
        const newPost = {
          id: responseData.post.id,
          title: responseData.post.title,
          text: responseData.post.text,
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
      /*.addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Преобразуем данные к единому формату
        // Проверяем структуру данных и нормализуем
        const userPosts = action.payload.map(post => {
          // Если данные вложены в поле post (как в FullPostDTO)
          const postData = post.post || post;
          
          return {
            id: postData.id,
            title: postData.title,
            text: postData.text,
            subject: postData.subject || post.subject,
            author: postData.author || post.author,
            files: postData.files || post.files || [],
            likes: postData.likes || post.likes || 0,
            likedBy: postData.likedBy || post.likedBy || []
          };
        });

        console.log("Normalized user posts:", action.payload.map(post => ({
          id: post.id,
          title: post.title,
          // ... другие поля
        })));

        // Сохраняем посты как есть, сортировка будет на уровне компонента
        state.userPosts = action.payload;



        console.log("actionpayload = ", action.payload)

        // Обновляем общий список
        //action.payload.forEach(post => {
      //    if (!state.items.some(p => p.id === post.id)) {
       //     state.items.push(post);
       //   }
       // });

        // Обновляем общий список
        userPosts.forEach(post => {
          const existingIndex = state.items.findIndex(p => p.id === post.id);
          if (existingIndex >= 0) {
            state.items[existingIndex] = post; // Обновляем существующий
          } else {
            state.items.push(post); // Добавляем новый
          }
        });
      })*/

        .addCase(fetchUserPosts.fulfilled, (state, action) => {
          state.status = 'succeeded';
          
          console.log('Данные с сервера:', action.payload);

          console.log('Старые userPosts:', state.userPosts); 

          // Нормализуем данные с сервера
          const userPosts = action.payload.map(item => ({
            post: {
              id: item.post.id,
              title: item.post.title,
              text: item.post.text
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
        state.postsBySubject = action.payload || [];
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